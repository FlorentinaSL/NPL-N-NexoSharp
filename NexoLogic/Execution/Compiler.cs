using System.Reflection;
using System.Reflection.Emit;
using NexoLogic.Models;
using NexoLogic.Parsing;
using NexoLogic.Lexing;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System;

namespace NexoLogic.Execution;

/// <summary>
/// Core MSIL Code Generator for the Nexo Programming Language (NPL).
/// Translates the Abstract Syntax Tree (AST) constructed by the Parser directly 
/// into .NET Common Intermediate Language (CIL) binary executables using System.Reflection.Emit.
/// </summary>
public class Compiler {
    private List<AstNodes.Statement> _ast;
    
    // --- Compilation Metatables ---
    // Registers globally accessible pre-declared routine signatures
    private readonly Dictionary<string, MethodBuilder> _methods = new();
    
    // Prevents cyclic linker dependencies by tracking successfully resolved packages
    private readonly HashSet<string> _loadedModules = new();
    
    // --- Scoped Memory Pointers ---
    // Tracks local variable bounds (null if executing in global/main scope)
    private Dictionary<string, LocalBuilder>? _locals = null;
    
    // Maps function parameter identifiers to MSIL argument stack indices
    private Dictionary<string, int>? _parameters = null;
    
    // --- Control Flow Mechanics ---
    // Tracks MSIL Labels for conditional jumping within continuous iterative loops
    private Stack<Label> _breakLabels = new();
    private Stack<Label> _continueLabels = new();

    public Compiler(List<AstNodes.Statement> ast) {
        _ast = ast;
    }

    /// <summary>
    /// Bootstraps the 4-Pass Compilation Pipeline:
    /// Pass 1: Dependency resolution and modular flat-packing.
    /// Pass 2: Method signature pre-allocation (Hoisting boundaries).
    /// Pass 3: OpCode injection logic.
    /// Pass 4: Entry point serialization.
    /// </summary>
    public void Compile(string outputFilePath) {
        try {
            // [PASS 1]: Traverse and aggregate external modular dependencies (Linker Pass)
            string currentDir = Path.GetDirectoryName(outputFilePath) ?? "";
            _ast = ResolveUsings(_ast, currentDir);
            
            string assemblyNameStr = Path.GetFileNameWithoutExtension(outputFilePath);
            var assemblyName = new AssemblyName(assemblyNameStr);
            
            // Standard .NET 9+ Disk Emission Requirement
            Type? pabType = Type.GetType("System.Reflection.Emit.PersistedAssemblyBuilder, System.Reflection.Emit");
            if (pabType == null) {
                throw new Exception("[NXC-001] Internal Toolchain Error: PersistedAssemblyBuilder not found. Ensure the host environment supports .NET 9+ execution.");
            }
            
            // Allocate Dynamic Assembly Block
            object? ab = Activator.CreateInstance(pabType, new object?[] { assemblyName, typeof(object).Assembly, null });
            MethodInfo? defineDynamicModuleMethod = pabType.GetMethod("DefineDynamicModule", new[] { typeof(string) });
            ModuleBuilder mb = (ModuleBuilder)defineDynamicModuleMethod!.Invoke(ab, new object[] { assemblyNameStr + ".dll" })!;

            TypeBuilder tb = mb.DefineType("Program", TypeAttributes.Public | TypeAttributes.Class);

            // Separate callable modules from the executable global root definitions
            var functions = _ast.OfType<AstNodes.FunctionStatement>().ToList();
            var mainStmts = _ast.Where(s => s is not AstNodes.FunctionStatement).ToList();

            // [PASS 2]: Routine Hoisting (Establish symbolic tables to allow recursive/forward calls)
            foreach (var func in functions) {
                // NPL dictates dynamic variant typing; mapped strictly to CLR typeof(object)
                var paramTypes = Enumerable.Repeat(typeof(object), func.Parameters.Count).ToArray();
                var mbMethod = tb.DefineMethod(func.Name, 
                    MethodAttributes.Public | MethodAttributes.Static, 
                    typeof(object), 
                    paramTypes);
                
                _methods[func.Name] = mbMethod;
            }

            // [PASS 3]: Intermediate Language Body Synthesis
            foreach (var func in functions) {
                var mbMethod = _methods[func.Name];
                var il = mbMethod.GetILGenerator();
                
                // Reboot localized symbol tracking grids for the current context frame
                _locals = new Dictionary<string, LocalBuilder>();
                _parameters = new Dictionary<string, int>();
                
                for (int i = 0; i < func.Parameters.Count; i++) {
                    _parameters[func.Parameters[i]] = i; // Assign numeric hardware index for Ldarg
                }
                
                EmitStatement(il, func.Body);
                
                // Memory Assurance: Implicitly inject Void return handling to prevent MSIL Evaluation Stack Underflow
                // [Stack Transition: 0 -> 1] Pushes null object reference
                il.Emit(OpCodes.Ldnull);
                // [Stack Transition: 1 -> 0] Safely consumes reference and returns control sequence
                il.Emit(OpCodes.Ret);
            }

            // Flush scoped evaluation frames, falling back to absolute Root Execution Frame
            _locals = null;
            _parameters = null;

            // [PASS 4]: Synthesize the Binary Execution Entry Point
            MethodBuilder mainMethod = tb.DefineMethod("Main", 
                MethodAttributes.Public | MethodAttributes.Static, 
                typeof(void), 
                Type.EmptyTypes);

            ILGenerator mainIl = mainMethod.GetILGenerator();

            foreach (var stmt in mainStmts) {
                EmitStatement(mainIl, stmt);
            }

            // [Stack Transition: 0 -> 0] Standard application termination
            mainIl.Emit(OpCodes.Ret);

            // Commit object types into non-volatile CLR classes
            tb.CreateType();

            // Serialize internal abstractions into executable disk persistence
            MethodInfo saveMethod = pabType.GetMethod("Save", new[] { typeof(string) })!;
            saveMethod.Invoke(ab, new object[] { outputFilePath });

            Console.WriteLine($"\n[+] Build succeeded -> Assembly written to: {outputFilePath}");
        } catch (Exception ex) {
            Console.WriteLine($"\n[FATAL NPL MSIL Compiler Exception]\n{ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }

    /// <summary>
    /// Recursive abstract dependency injection. Reads remote scripts via lexing/parsing pipeline
    /// and flattens their resulting logical ASTs directly into the primary execution unit.
    /// </summary>
    private List<AstNodes.Statement> ResolveUsings(List<AstNodes.Statement> stmts, string currentDir) {
        var result = new List<AstNodes.Statement>();
        foreach (var stmt in stmts) {
            if (stmt is AstNodes.UsingStatement u) {
                if (_loadedModules.Contains(u.ModuleName)) continue;
                _loadedModules.Add(u.ModuleName);
                
                string relativePath = u.ModuleName.Replace(".", Path.DirectorySeparatorChar.ToString()) + ".nexo";
                string path = Path.Combine(currentDir, relativePath);
                
                if (!File.Exists(path)) {
                    // Fallback bridging strictly aimed at the physical global NPL executable library payload
                    string globalPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Libs", relativePath);
                    if (File.Exists(globalPath)) {
                        path = globalPath;
                    } else {
                        throw new Exception($"[NXC-002] Linker Error: Module '{u.ModuleName}' could not be located in the current execution directory or global libraries.");
                    }
                }
                
                string source = File.ReadAllText(path);
                var lexer = new Lexer(source);
                var parser = new Parser(lexer.Tokenize());
                var importedAst = parser.Parse();
                
                // Deep recursive sweep ensuring trailing circular dependencies are also captured
                result.AddRange(ResolveUsings(importedAst, currentDir));
            } else {
                result.Add(stmt);
            }
        }
        return result;
    }

    /// <summary>
    /// Consumes explicit structural AST statements and maps them perfectly to MSIL memory/instruction patterns.
    /// </summary>
    private void EmitStatement(ILGenerator il, AstNodes.Statement stmt) {
        switch (stmt) {
            case AstNodes.PrintStatement p:
                EmitExpression(il, p.Expression);
                // [Stack: -1, +0] Consumes evaluation argument to bridge the runtime console hook.
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Print))!);
                break;
                
            case AstNodes.AssignmentStatement a:
                if (_locals != null && _parameters != null) {
                    // Current Frame Scope: Injecting local transient assignments
                    EmitExpression(il, a.Value);
                    if (_parameters.TryGetValue(a.VariableName, out int pIdx)) {
                        // [Stack: -1, +0] Stores computational result inside function argument slot
                        il.Emit(OpCodes.Starg, pIdx);
                    } else {
                        if (!_locals.TryGetValue(a.VariableName, out var lb)) {
                            lb = il.DeclareLocal(typeof(object));
                            _locals[a.VariableName] = lb;
                        }
                        // [Stack: -1, +0] Stores computational result in transient local allocation block
                        il.Emit(OpCodes.Stloc, lb);
                    }
                } else {
                    // Root Global Frame Logic Bypass
                    il.Emit(OpCodes.Ldstr, a.VariableName); // Parameter 1: Registration Key
                    EmitExpression(il, a.Value);            // Parameter 2: Computable Payload Value
                    il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.SetGlobal))!);
                }
                break;
                
            case AstNodes.ExpressionStatement e:
                EmitExpression(il, e.Expression);
                // Memory Hazard Mitigation: Ensures pure side-effect executions drop off from stack evaluation.
                il.Emit(OpCodes.Pop);
                break;
                
            case AstNodes.IfStatement i:
                // Pre-allocates destination blocks for Jump execution bypassing logic
                Label elseLabel = il.DefineLabel();
                Label endLabel = il.DefineLabel();
                
                EmitExpression(il, i.Condition);
                // Implicit dynamic truthy constraint parsing.
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.IsTrue))!);
                // Check evaluated boolean byte. Branches strictly upon integer 0 constraint.
                il.Emit(OpCodes.Brfalse, elseLabel); 
                
                EmitStatement(il, i.ThenBranch);
                // Explicitly vault over trailing else executions ensuring sequential bounds safely
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
                il.Emit(OpCodes.Brfalse, endLoop); // Conditional trigger dropping us to end loop scope
                
                EmitStatement(il, w.Body);
                
                il.Emit(OpCodes.Br, startLoop); // Infinite return binding
                
                il.MarkLabel(endLoop); // Target allocation bounds tracking
                
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
                    il.Emit(OpCodes.Ldnull);
                }
                il.Emit(OpCodes.Ret);
                break;

            case AstNodes.BreakStatement:
                if (_breakLabels.Count == 0) throw new Exception("[NXC-003] Semantic Error: Invalid 'break' statement outside of a valid loop scope.");
                il.Emit(OpCodes.Br, _breakLabels.Peek());
                break;
                
            case AstNodes.ContinueStatement:
                if (_continueLabels.Count == 0) throw new Exception("[NXC-004] Semantic Error: Invalid 'continue' statement outside of a valid loop scope.");
                il.Emit(OpCodes.Br, _continueLabels.Peek());
                break;
                
            default:
                throw new Exception($"[NXC-005] MSIL Generation Error: Statement node '{stmt.GetType().Name}' is not supported by the current emission engine.");
        }
    }

    /// <summary>
    /// Processes computational expressions and enforces C# Object-Boxing to satisfy NPL's untyped operational methodology.
    /// </summary>
    private void EmitExpression(ILGenerator il, AstNodes.Expression expr) {
        switch (expr) {
            case AstNodes.NumberExpression n:
                // [Stack: 0 -> 1] Push unboxed int32 mapping constraint
                il.Emit(OpCodes.Ldc_I4, n.Value);
                // Encase integer bytes into Object payload mapping structures natively
                il.Emit(OpCodes.Box, typeof(int));
                break;
                
            case AstNodes.StringExpression s:
                // [Stack: 0 -> 1] Loads string memory pointer
                il.Emit(OpCodes.Ldstr, s.Value);
                break;
                
            case AstNodes.BoolExpression b:
                // [Stack: 0 -> 1] Loads boolean logic binary representation flags (1/0)
                il.Emit(b.Value ? OpCodes.Ldc_I4_1 : OpCodes.Ldc_I4_0);
                il.Emit(OpCodes.Box, typeof(bool));
                break;
                
            case AstNodes.ReadExpression r:
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.Read))!);
                break;
                
            case AstNodes.VariableExpression v:
                if (_locals != null && _parameters != null) {
                    // Stack Crawl Phase: Evaluates priority scoping across execution levels
                    if (_parameters.TryGetValue(v.Name, out int pIdx)) {
                        il.Emit(OpCodes.Ldarg, pIdx);
                        break;
                    } else if (_locals.TryGetValue(v.Name, out var lb)) {
                        il.Emit(OpCodes.Ldloc, lb);
                        break;
                    }
                }
                // Memory Fetch Fallback: Safely pulls missing frames out of the continuous Global Hash map 
                il.Emit(OpCodes.Ldstr, v.Name);
                il.Emit(OpCodes.Call, typeof(NexoRuntime).GetMethod(nameof(NexoRuntime.GetGlobal))!);
                break;

            case AstNodes.CallExpression c:
                if (_methods.TryGetValue(c.Callee, out var method)) {
                    if (c.Arguments.Count != method.GetParameters().Length) {
                        throw new Exception($"[NXC-006] Resolution Error: NPL Invocation of '{c.Callee}' requires exactly {method.GetParameters().Length} arguments but got {c.Arguments.Count}.");
                    }
                    foreach (var arg in c.Arguments) {
                        EmitExpression(il, arg);
                    }
                    // Dispatches internal compiled logic bridging sequentially
                    il.Emit(OpCodes.Call, method);
                } else {
                    // --- NPL Magic: Native C# Framework Fallback Search Engine ---
                    // Safely overrides normal function structures and directly binds to robust platform functionalities implicitly.
                    string targetName = c.Callee.Replace("_", "");
                    var nativeMethod = typeof(NexoRuntime).GetMethods(BindingFlags.Public | BindingFlags.Static)
                        .FirstOrDefault(m => string.Equals(m.Name, targetName, StringComparison.OrdinalIgnoreCase));
                    
                    if (nativeMethod != null) {
                        if (c.Arguments.Count != nativeMethod.GetParameters().Length) {
                             throw new Exception($"[NXC-007] Native Bridge Error: Framework method '{c.Callee}' requires strictly {nativeMethod.GetParameters().Length} arguments.");
                        }
                        foreach (var arg in c.Arguments) { EmitExpression(il, arg); }
                        
                        // Reflection dynamic opcode invocation against the platform architecture
                        il.Emit(OpCodes.Call, nativeMethod);
                        
                        // Strict CIL Evaluation Bounds protection: Ensure MSIL retains 1 depth item when popping void methods natively
                        if (nativeMethod.ReturnType == typeof(void)) {
                            il.Emit(OpCodes.Ldnull);
                        }
                    } else {
                        throw new Exception($"[NXC-008] Linker Error: Unresolved invokable symbol '{c.Callee}' could not be found in user scopes or native C# bridge.");
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
                    _ => throw new Exception($"[NXC-009] Syntax Generation Error: Binary operator '{bin.Op}' is not legally handled by the MSIL code emitter.")
                };
                // Dispatches numerical payload evaluations to explicit unboxing handlers safely avoiding data corruption
                il.Emit(OpCodes.Call, m);
                break;
                
            default:
                throw new Exception($"[NXC-010] MSIL Generation Error: Execution expression node '{expr.GetType().Name}' is fatally unrecognized.");
        }
    }
}
