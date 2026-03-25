using System.Reflection;
using System.Reflection.Emit;
using NexoLogic.Models;
using NexoLogic.Parsing;
using NexoLogic.Lexing;

namespace NexoLogic.Execution;

public class Compiler {
    private List<AstNodes.Statement> _ast;
    
    // Funzioni Compilate
    private readonly Dictionary<string, MethodBuilder> _methods = new();
    private readonly HashSet<string> _loadedModules = new();
    
    // Contesti Locali (usati solo dentro una funzione, null nella Main)
    private Dictionary<string, LocalBuilder>? _locals = null;
    private Dictionary<string, int>? _parameters = null;
    
    // Stack dei Jump per i cicli (while)
    private Stack<Label> _breakLabels = new();
    private Stack<Label> _continueLabels = new();

    public Compiler(List<AstNodes.Statement> ast) {
        _ast = ast;
    }

    public void Compile(string outputFilePath) {
        try {
            // PASS 1: Risolve e appiattisce gli Using (inclusione dei file)
            string currentDir = Path.GetDirectoryName(outputFilePath) ?? "";
            _ast = ResolveUsings(_ast, currentDir);
            
            string assemblyNameStr = Path.GetFileNameWithoutExtension(outputFilePath);
            var assemblyName = new AssemblyName(assemblyNameStr);
            
            // Requisito per .NET 9: PersistedAssemblyBuilder
            Type? pabType = Type.GetType("System.Reflection.Emit.PersistedAssemblyBuilder, System.Reflection.Emit");
            if (pabType == null) {
                throw new Exception("PersistedAssemblyBuilder not found! Assicurati di usare .NET 9.");
            }
            
            object? ab = Activator.CreateInstance(pabType, new object?[] { assemblyName, typeof(object).Assembly, null });
            MethodInfo? defineDynamicModuleMethod = pabType.GetMethod("DefineDynamicModule", new[] { typeof(string) });
            ModuleBuilder mb = (ModuleBuilder)defineDynamicModuleMethod!.Invoke(ab, new object[] { assemblyNameStr + ".dll" })!;

            TypeBuilder tb = mb.DefineType("Program", TypeAttributes.Public | TypeAttributes.Class);

            // Estrapoliamo tutte le funzioni (e separiamole dalla main globale)
            var functions = _ast.OfType<AstNodes.FunctionStatement>().ToList();
            var mainStmts = _ast.Where(s => s is not AstNodes.FunctionStatement).ToList();

            // PASS 2: Pre-Dichiarazione delle Funzioni (MethodBuilder)
            foreach (var func in functions) {
                // Ogni parametro in MSIL sarà di tipo object
                var paramTypes = Enumerable.Repeat(typeof(object), func.Parameters.Count).ToArray();
                var mbMethod = tb.DefineMethod(func.Name, 
                    MethodAttributes.Public | MethodAttributes.Static, 
                    typeof(object), 
                    paramTypes);
                
                _methods[func.Name] = mbMethod;
            }

            // PASS 3: Emetti il corpo IL di ogni Funzione
            foreach (var func in functions) {
                var mbMethod = _methods[func.Name];
                var il = mbMethod.GetILGenerator();
                
                // Inizializza lo Scope Locale per questa funzione
                _locals = new Dictionary<string, LocalBuilder>();
                _parameters = new Dictionary<string, int>();
                
                for (int i = 0; i < func.Parameters.Count; i++) {
                    _parameters[func.Parameters[i]] = i; // mappa il nome al'indice Ldarg
                }
                
                EmitStatement(il, func.Body);
                
                // Nel caso la funzione non abbia un return esplicito, ritorniamo null
                il.Emit(OpCodes.Ldnull);
                il.Emit(OpCodes.Ret);
            }

            // Ripristina lo scope per il Main (Accesso Globale puro)
            _locals = null;
            _parameters = null;

            // PASS 4: Main Method
            MethodBuilder mainMethod = tb.DefineMethod("Main", 
                MethodAttributes.Public | MethodAttributes.Static, 
                typeof(void), 
                Type.EmptyTypes);

            ILGenerator mainIl = mainMethod.GetILGenerator();

            foreach (var stmt in mainStmts) {
                EmitStatement(mainIl, stmt);
            }

            mainIl.Emit(OpCodes.Ret);

            // Genera il tipo
            tb.CreateType();

            // Salva su disco l'Assembly
            MethodInfo saveMethod = pabType.GetMethod("Save", new[] { typeof(string) })!;
            saveMethod.Invoke(ab, new object[] { outputFilePath });

            Console.WriteLine($"\n[SUCCESS] Compiled successfully to {outputFilePath}");
        } catch (Exception ex) {
            Console.WriteLine($"\n[COMPILER ERROR] {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }

    // Risolve le importazioni leggendo i file
    private List<AstNodes.Statement> ResolveUsings(List<AstNodes.Statement> stmts, string currentDir) {
        var result = new List<AstNodes.Statement>();
        foreach (var stmt in stmts) {
            if (stmt is AstNodes.UsingStatement u) {
                if (_loadedModules.Contains(u.ModuleName)) continue;
                _loadedModules.Add(u.ModuleName);
                
                string relativePath = u.ModuleName.Replace(".", Path.DirectorySeparatorChar.ToString()) + ".nexo";
                string path = Path.Combine(currentDir, relativePath);
                
                if (!File.Exists(path)) {
                    // Fallback to Global Libs
                    string globalPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Libs", relativePath);
                    if (File.Exists(globalPath)) {
                        path = globalPath;
                    } else {
                        throw new Exception($"Library non trovata per la compilazione: {u.ModuleName}");
                    }
                }
                
                string source = File.ReadAllText(path);
                var lexer = new Lexer(source);
                var parser = new Parser(lexer.Tokenize());
                var importedAst = parser.Parse();
                
                // Ricerca usings all'interno del modulo importato
                result.AddRange(ResolveUsings(importedAst, currentDir));
            } else {
                result.Add(stmt);
            }
        }
        return result;
    }

    private void EmitStatement(ILGenerator il, AstNodes.Statement stmt) {
        switch (stmt) {
            case AstNodes.PrintStatement p:
                EmitExpression(il, p.Expression);
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Print))!);
                break;
                
            case AstNodes.AssignmentStatement a:
                if (_locals != null && _parameters != null) {
                    // Siamo dentro una funzione: variabile locale (o parametro)!
                    EmitExpression(il, a.Value);
                    if (_parameters.TryGetValue(a.VariableName, out int pIdx)) {
                        il.Emit(OpCodes.Starg, pIdx);
                    } else {
                        if (!_locals.TryGetValue(a.VariableName, out var lb)) {
                            lb = il.DeclareLocal(typeof(object));
                            _locals[a.VariableName] = lb;
                        }
                        il.Emit(OpCodes.Stloc, lb);
                    }
                } else {
                    // Siamo nel Root (Global)
                    il.Emit(OpCodes.Ldstr, a.VariableName); // Nome
                    EmitExpression(il, a.Value);            // Valore
                    il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.SetGlobal))!);
                }
                break;
                
            case AstNodes.ExpressionStatement e:
                EmitExpression(il, e.Expression);
                il.Emit(OpCodes.Pop); // Scarta via il risultato, non serve a nessuno
                break;
                
            case AstNodes.IfStatement i:
                Label elseLabel = il.DefineLabel();
                Label endLabel = il.DefineLabel();
                
                EmitExpression(il, i.Condition);
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.IsTrue))!);
                il.Emit(OpCodes.Brfalse, elseLabel); 
                
                EmitStatement(il, i.ThenBranch);
                il.Emit(OpCodes.Br, endLabel);       
                
                il.MarkLabel(elseLabel);
                if (i.ElseBranch != null) {
                    EmitStatement(il, i.ElseBranch);
                }
                
                il.MarkLabel(endLabel);
                break;
            
            case AstNodes.WhileStatement w:
                Label startLoop = il.DefineLabel();
                Label endLoop = il.DefineLabel();
                
                _continueLabels.Push(startLoop);
                _breakLabels.Push(endLoop);
                
                il.MarkLabel(startLoop);
                EmitExpression(il, w.Condition);
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.IsTrue))!);
                il.Emit(OpCodes.Brfalse, endLoop);
                
                EmitStatement(il, w.Body);
                
                il.Emit(OpCodes.Br, startLoop);
                
                il.MarkLabel(endLoop);
                
                _continueLabels.Pop();
                _breakLabels.Pop();
                break;
                
            case AstNodes.BlockStatement b:
                foreach (var s in b.Statements) {
                    EmitStatement(il, s);
                }
                break;

            case AstNodes.ReturnStatement r:
                if (r.Value != null) {
                    EmitExpression(il, r.Value); 
                } else {
                    il.Emit(OpCodes.Ldnull); // Return empty
                }
                il.Emit(OpCodes.Ret);
                break;

            case AstNodes.BreakStatement:
                if (_breakLabels.Count == 0) throw new Exception("Break Statement usato fuori da un loop!");
                il.Emit(OpCodes.Br, _breakLabels.Peek());
                break;
                
            case AstNodes.ContinueStatement:
                if (_continueLabels.Count == 0) throw new Exception("Continue Statement usato fuori da un loop!");
                il.Emit(OpCodes.Br, _continueLabels.Peek());
                break;
                
            default:
                throw new Exception($"Statement type {stmt.GetType().Name} non supportato dal Compilatore Emit.");
        }
    }

    private void EmitExpression(ILGenerator il, AstNodes.Expression expr) {
        switch (expr) {
            case AstNodes.NumberExpression n:
                il.Emit(OpCodes.Ldc_I4, n.Value);
                il.Emit(OpCodes.Box, typeof(int));
                break;
                
            case AstNodes.StringExpression s:
                il.Emit(OpCodes.Ldstr, s.Value);
                break;
                
            case AstNodes.BoolExpression b:
                il.Emit(b.Value ? OpCodes.Ldc_I4_1 : OpCodes.Ldc_I4_0);
                il.Emit(OpCodes.Box, typeof(bool));
                break;
                
            case AstNodes.ReadExpression r:
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Read))!);
                break;
                
            case AstNodes.VariableExpression v:
                if (_locals != null && _parameters != null) {
                    // Cerca il nome prima nei parametri, poi nei locals
                    if (_parameters.TryGetValue(v.Name, out int pIdx)) {
                        il.Emit(OpCodes.Ldarg, pIdx);
                        break;
                    } else if (_locals.TryGetValue(v.Name, out var lb)) {
                        il.Emit(OpCodes.Ldloc, lb);
                        break;
                    }
                }
                // Fallback a Globale se non c'e'
                il.Emit(OpCodes.Ldstr, v.Name);
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.GetGlobal))!);
                break;

            case AstNodes.CallExpression c:
                if (_methods.TryGetValue(c.Callee, out var method)) {
                    if (c.Arguments.Count != method.GetParameters().Length) {
                        throw new Exception($"La funzione '{c.Callee}' richiede {method.GetParameters().Length} argomenti.");
                    }
                    foreach (var arg in c.Arguments) {
                        EmitExpression(il, arg);
                    }
                    il.Emit(OpCodes.Call, method);
                } else {
                    // Native C# Fallback
                    string targetName = c.Callee.Replace("_", "");
                    var nativeMethod = typeof(NexoRuntime).GetMethods(BindingFlags.Public | BindingFlags.Static)
                        .FirstOrDefault(m => string.Equals(m.Name, targetName, StringComparison.OrdinalIgnoreCase));
                    
                    if (nativeMethod != null) {
                        if (c.Arguments.Count != nativeMethod.GetParameters().Length) {
                             throw new Exception($"La funzione nativa '{c.Callee}' richiede {nativeMethod.GetParameters().Length} argomenti.");
                        }
                        foreach (var arg in c.Arguments) { EmitExpression(il, arg); }
                        il.Emit(OpCodes.Call, nativeMethod);
                        // Preveniamo il crash d'Underflow nel CIL spingendo Null se il metodo e' void
                        if (nativeMethod.ReturnType == typeof(void)) {
                            il.Emit(OpCodes.Ldnull);
                        }
                    } else {
                        throw new Exception($"Funzione sconosciuta: '{c.Callee}'");
                    }
                }
                break;
                
            case AstNodes.BinaryExpression bin:
                EmitExpression(il, bin.Left);
                EmitExpression(il, bin.Right);
                MethodInfo m = bin.Op switch {
                    "+" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Add))!,
                    "-" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Sub))!,
                    "*" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Mul))!,
                    "/" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Div))!,
                    "==" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Eq))!,
                    "!=" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Neq))!,
                    ">" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Gt))!,
                    "<" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Lt))!,
                    ">=" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Gte))!,
                    "<=" => typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Lte))!,
                    _ => throw new Exception($"Operatore {bin.Op} non supportato in compilazione")
                };
                il.Emit(OpCodes.Call, m);
                break;
                
            default:
                throw new Exception($"Espressione {expr.GetType().Name} non supportata dal Compilatore Emit.");
        }
    }
}
