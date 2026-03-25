using NexoLogic.Models;
using NexoLogic.Lexing;
using NexoLogic.Parsing;
using System.IO;
using System.Linq;

namespace NexoLogic.Execution;

public class ReturnException : Exception {
    public object Value { get; }
    public ReturnException(object value) { Value = value; }
}

public class BreakException : Exception { }
public class ContinueException : Exception { }

// Definiamo cosa salva Nexo quando vede "do nome()"
public record FunctionData(List<string> Parameters, AstNodes.BlockStatement Body);

public class Interpreter {
    // Memoria globale (Variabili e Funzioni)
    private readonly Dictionary<string, object> _vars = new();
    private readonly Dictionary<string, FunctionData> _functions = new();
    private readonly HashSet<string> _loadedModules = new();

    // Punto di ingresso principale
    public void Execute(List<AstNodes.Statement> stmts) {
        try { 
            foreach (var s in stmts) EvalStmt(s, _vars); 
        }
        catch (Exception e) { 
            Console.ForegroundColor = ConsoleColor.Red; 
            Console.WriteLine($"\n[NEXO RUNTIME ERROR]: {e.Message}"); 
            Console.ResetColor(); 
        }
    }

    // Valuta uno Statement (Comando) 
    // Passiamo 'currentScope' per permettere alle funzioni di avere la loro memoria locale
    private void EvalStmt(AstNodes.Statement s, Dictionary<string, object> currentScope) {
        switch (s) {
            case AstNodes.UsingStatement u:
                HandleUsing(u.ModuleName);
                break;

            case AstNodes.FunctionStatement f:
                _functions[f.Name] = new FunctionData(f.Parameters, f.Body);
                break;

            case AstNodes.AssignmentStatement a: 
                currentScope[a.VariableName] = EvalExpr(a.Value, currentScope); 
                break;

            case AstNodes.ExpressionStatement ex:
                EvalExpr(ex.Expression, currentScope);
                break;

            case AstNodes.PrintStatement p: 
                Console.WriteLine(EvalExpr(p.Expression, currentScope)); 
                break;

            case AstNodes.IfStatement i: 
                if (IsTrue(EvalExpr(i.Condition, currentScope))) EvalStmt(i.ThenBranch, currentScope); 
                else if (i.ElseBranch != null) EvalStmt(i.ElseBranch, currentScope); 
                break;

            case AstNodes.WhileStatement w: 
                while (IsTrue(EvalExpr(w.Condition, currentScope))) {
                    try {
                        EvalStmt(w.Body, currentScope); 
                    } catch (BreakException) {
                        break;
                    } catch (ContinueException) {
                        continue;
                    }
                }
                break;

            case AstNodes.BlockStatement b: 
                foreach (var sub in b.Statements) EvalStmt(sub, currentScope); 
                break;

            case AstNodes.ReturnStatement r:
                object retVal = r.Value != null ? EvalExpr(r.Value, currentScope) : null;
                throw new ReturnException(retVal);

            case AstNodes.BreakStatement:
                throw new BreakException();

            case AstNodes.ContinueStatement:
                throw new ContinueException();

            default:
                throw new Exception($"Statement type {s.GetType().Name} not implemented.");
        }
    }

    // Gestione della chiamata a funzione 'do'
    private object ExecuteFunction(string name, List<AstNodes.Expression> args, Dictionary<string, object> callingScope) {
        if (_functions.TryGetValue(name, out var func)) {
            if (args.Count != func.Parameters.Count)
                throw new Exception($"Function '{name}' expects {func.Parameters.Count} arguments, got {args.Count}.");

            var localScope = new Dictionary<string, object>();
            for (int i = 0; i < args.Count; i++) {
                localScope[func.Parameters[i]] = EvalExpr(args[i], callingScope);
            }

            try {
                EvalStmt(func.Body, localScope);
            } catch (ReturnException rex) {
                return rex.Value;
            }
            return null;
        }

        // Native C# Fallback
        string targetName = name.Replace("_", "");
        var nativeMethod = typeof(NexoRuntime).GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
            .FirstOrDefault(m => string.Equals(m.Name, targetName, StringComparison.OrdinalIgnoreCase));
        
        if (nativeMethod != null) {
            if (args.Count != nativeMethod.GetParameters().Length) {
                throw new Exception($"La funzione nativa '{name}' richiede {nativeMethod.GetParameters().Length} argomenti.");
            }
            var argVals = args.Select(a => EvalExpr(a, callingScope)).ToArray();
            return nativeMethod.Invoke(null, argVals);
        }

        throw new Exception($"Function '{name}' is not defined.");
    }

    private void HandleUsing(string moduleName) {
        if (_loadedModules.Contains(moduleName)) return;

        string relativePath = moduleName.Replace(".", Path.DirectorySeparatorChar.ToString()) + ".nexo";
        string path = relativePath;
        
        // Verifica se presente localmente
        if (!File.Exists(path)) {
            // Cerca nella cartella Libs di installazione globale
            string globalPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Libs", relativePath);
            if (File.Exists(globalPath)) {
                path = globalPath;
            } else {
                throw new Exception($"Library not found: {moduleName}");
            }
        }

        string source = File.ReadAllText(path);
        _loadedModules.Add(moduleName);

        var lexer = new Lexer(source);
        var tokens = lexer.Tokenize();
        var parser = new Parser(tokens);
        var externalStatements = parser.Parse();

        foreach (var stmt in externalStatements) EvalStmt(stmt, _vars);
    }

    // Valuta un'Espressione (Valore)
    private object EvalExpr(AstNodes.Expression e, Dictionary<string, object> currentScope) => e switch {
        AstNodes.ReadExpression => Read(),
        AstNodes.NumberExpression n => n.Value,
        AstNodes.StringExpression s => s.Value,
        AstNodes.BoolExpression b => b.Value,
        AstNodes.VariableExpression v => GetVariable(v.Name, currentScope),
        AstNodes.BinaryExpression bin => EvalBin(bin, currentScope),
        AstNodes.CallExpression c => ExecuteFunction(c.Callee, c.Arguments, currentScope),
        _ => throw new Exception($"Unknown expression: {e.GetType().Name}")
    };

    private object GetVariable(string name, Dictionary<string, object> currentScope) {
        // Cerca prima nello scope locale, poi in quello globale
        if (currentScope.TryGetValue(name, out var val)) return val;
        if (_vars.TryGetValue(name, out var globalVal)) return globalVal;
        
        throw new Exception($"Variable '{name}' is not defined.");
    }

    private object Read() {
        var input = Console.ReadLine();
        return int.TryParse(input, out int n) ? n : input ?? "";
    }

    private object EvalBin(AstNodes.BinaryExpression b, Dictionary<string, object> currentScope) {
        var l = EvalExpr(b.Left, currentScope); 
        var r = EvalExpr(b.Right, currentScope);
        
        return b.Op switch {
            "+" => (l is int li && r is int ri) ? li + ri : l.ToString() + r.ToString(),
            "-" => (int)l - (int)r, 
            "*" => (int)l * (int)r, 
            "/" => (int)l / (int)r,
            "==" => Equals(l, r), 
            "!=" => !Equals(l, r),
            ">" => (int)l > (int)r, 
            "<" => (int)l < (int)r, 
            ">=" => (int)l >= (int)r, 
            "<=" => (int)l <= (int)r,
            _ => throw new Exception($"Operator {b.Op} not supported")
        };
    }

    private bool IsTrue(object v) => v is bool b ? b : v is int i ? i != 0 : v != null;
}