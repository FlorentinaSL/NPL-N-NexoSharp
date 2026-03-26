using NexoLogic.Models;
using NexoLogic.Lexing;
using NexoLogic.Parsing;
using System.IO;
using System.Linq;
using System;
using System.Collections.Generic;

namespace NexoLogic.Execution;

// --- Runtime Evaluation Exceptions ---
// Structurally dictates flow control interrupts during AST (Abstract Syntax Tree) traversal.

public class ReturnException : Exception {
    public object Value { get; }
    public ReturnException(object value) { Value = value; }
}

public class BreakException : Exception { }
public class ContinueException : Exception { }

/// <summary>
/// Pre-calculated functional signature payload storing parameter identifiers and executable block bodies.
/// </summary>
public record FunctionData(List<string> Parameters, AstNodes.BlockStatement Body);

/// <summary>
/// Tree-Walking AST Interpreter.
/// Instantiates an interactive, real-time memory loop capable of executing NPL natively without MSIL pre-compilation.
/// Primarily used for REPL environments, debugging cycles, or JIT execution pathways.
/// </summary>
public class Interpreter {
    // --- Architectural Heap Pointers ---
    private readonly Dictionary<string, object> _vars = new();
    private readonly Dictionary<string, FunctionData> _functions = new();
    
    // Safety lock ensuring acyclic package linkage
    private readonly HashSet<string> _loadedModules = new();

    /// <summary>
    /// Core bootstrapper algorithm. Iterates sequentially over the highest-order logical nodes.
    /// </summary>
    public void Execute(List<AstNodes.Statement> stmts) {
        try { 
            foreach (var s in stmts) EvalStmt(s, _vars); 
        }
        catch (Exception e) { 
            Console.ForegroundColor = ConsoleColor.Red; 
            Console.WriteLine($"\n[FATAL] NPL Interpreter Fault: {e.Message}"); 
            Console.ResetColor(); 
        }
    }

    /// <summary>
    /// Primary Statement Dispatch Router.
    /// Routes the current AST instruction into its designated runtime mutation logic, 
    /// inheriting explicit variable visibility limits via Dictionary scoping arrays.
    /// </summary>
    private void EvalStmt(AstNodes.Statement s, Dictionary<string, object> currentScope) {
        switch (s) {
            case AstNodes.UsingStatement u:
                HandleUsing(u.ModuleName);
                break;

            case AstNodes.FunctionStatement f:
                // Stores routine footprint into active heap memory
                _functions[f.Name] = new FunctionData(f.Parameters, f.Body);
                break;

            case AstNodes.AssignmentStatement a: 
                // Forces raw memory mapping creation or overwrite dynamically
                currentScope[a.VariableName] = EvalExpr(a.Value, currentScope); 
                break;

            case AstNodes.IndexAssignmentStatement idxAsn:
                object targetObj = EvalExpr(idxAsn.Obj, currentScope);
                object targetIdx = EvalExpr(idxAsn.Index, currentScope);
                object mutateVal = EvalExpr(idxAsn.Value, currentScope);
                NexoRuntime.SetIndex(targetObj, targetIdx, mutateVal);
                break;

            case AstNodes.ExpressionStatement ex:
                EvalExpr(ex.Expression, currentScope);
                break;

            case AstNodes.PrintStatement p: 
                Console.WriteLine(EvalExpr(p.Expression, currentScope)); 
                break;

            case AstNodes.IfStatement i: 
                if (IsTrue(EvalExpr(i.Condition, currentScope))) {
                    EvalStmt(i.ThenBranch, currentScope); 
                }
                else if (i.ElseBranch != null) {
                    EvalStmt(i.ElseBranch, currentScope); 
                }
                break;

            case AstNodes.WhileStatement w: 
                while (IsTrue(EvalExpr(w.Condition, currentScope))) {
                    try {
                        EvalStmt(w.Body, currentScope); 
                    } catch (BreakException) {
                        break; // Drops iteration frame globally
                    } catch (ContinueException) {
                        continue; // Resets iteration PC to header
                    }
                }
                break;

            case AstNodes.ForeachStatement f:
                // Native Iterator Extraction dynamically bounding memory targets
                object iterableObj = EvalExpr(f.Iterable, currentScope);
                object enumerator = NexoRuntime.GetEnumerator(iterableObj);
                
                while (NexoRuntime.MoveNext(enumerator)) {
                    object itemVal = NexoRuntime.GetCurrent(enumerator);
                    currentScope[f.ItemName] = itemVal; // Bind local transient ref
                    
                    try {
                        EvalStmt(f.Body, currentScope); 
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
                object? retVal = r.Value != null ? EvalExpr(r.Value, currentScope) : null;
                // Throws an exception artificially bridging stack trace to exit execution blocks optimally
                throw new ReturnException(retVal!);

            case AstNodes.BreakStatement:
                throw new BreakException();

            case AstNodes.ContinueStatement:
                throw new ContinueException();

            default:
                throw new Exception($"[NXC-012] Interpreter Fault: Operation logic for AST segment '{s.GetType().Name}' is inexplicably undefined.");
        }
    }

    /// <summary>
    /// Executes a custom-defined procedural routine node or delegates transparently to the implicit Native .NET bridge.
    /// </summary>
    private object? ExecuteFunction(string name, List<AstNodes.Expression> args, Dictionary<string, object> callingScope) {
        if (_functions.TryGetValue(name, out var func)) {
            if (args.Count != func.Parameters.Count)
                throw new Exception($"[NXC-013] Validation Error: Function '{name}' natively requires exactly {func.Parameters.Count} parameters, received {args.Count}.");

            // Generates an isolated stack-frame simulation for local mutable variables
            var localScope = new Dictionary<string, object>();
            for (int i = 0; i < args.Count; i++) {
                localScope[func.Parameters[i]] = EvalExpr(args[i], callingScope);
            }

            try {
                EvalStmt(func.Body, localScope);
            } catch (ReturnException rex) {
                return rex.Value;
            }
            return null; // Implicit evaluation termination
        }

        // --- Active Native .NET Framework Bridging ---
        string targetName = name.Replace("_", "");
        var nativeMethod = typeof(NexoRuntime).GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static)
            .FirstOrDefault(m => string.Equals(m.Name, targetName, StringComparison.OrdinalIgnoreCase));
        
        if (nativeMethod != null) {
            if (args.Count != nativeMethod.GetParameters().Length) {
                throw new Exception($"[NXC-014] Bridging Error: Bound Native Framework Method '{name}' physically requires {nativeMethod.GetParameters().Length} arguments.");
            }
            
            // Execute synchronous reflection translation mappings recursively
            var argVals = args.Select(a => EvalExpr(a, callingScope)).ToArray();
            return nativeMethod.Invoke(null, argVals);
        }

        throw new Exception($"[NXC-015] Linker Fault: Pointer to routine '{name}' returned null memory mapping. Method is strictly undefined.");
    }

    /// <summary>
    /// Replicating FileLinker mechanics natively to import textual libraries dynamically during sequential evaluation.
    /// </summary>
    private void HandleUsing(string moduleName) {
        if (_loadedModules.Contains(moduleName)) return;

        string relativePath = moduleName.Replace(".", Path.DirectorySeparatorChar.ToString()) + ".nexo";
        string path = relativePath;
        
        if (!File.Exists(path)) {
            // Absolute path probing on core NPL generic NPM libraries
            string globalPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Libs", relativePath);
            string npmGlobalPath = Path.Combine(@"C:\Programs\Nexo\libs", relativePath);
            
            if (File.Exists(globalPath)) {
                path = globalPath;
            } else if (File.Exists(npmGlobalPath)) {
                path = npmGlobalPath;
            } else {
                throw new Exception($"[NXC-016] Path Traversal Error: NPM network fallback failed. Module '{moduleName}' not installed globally.");
            }
        }

        // Recursively boot a temporary parser environment
        string source = File.ReadAllText(path);
        _loadedModules.Add(moduleName);

        var lexer = new Lexer(source);
        var tokens = lexer.Tokenize();
        var parser = new Parser(tokens);
        var externalStatements = parser.Parse();

        // Inject compiled nodes directly targeting current internal bindings
        foreach (var stmt in externalStatements) EvalStmt(stmt, _vars);
    }

    /// <summary>
    /// Calculates R-Value atomic expressions recursively generating highly typed payload clusters.
    /// </summary>
    private object EvalExpr(AstNodes.Expression e, Dictionary<string, object> currentScope) => e switch {
        AstNodes.ReadExpression => Read(),
        AstNodes.NumberExpression n => n.Value,
        AstNodes.StringExpression s => s.Value,
        AstNodes.BoolExpression b => b.Value,
        AstNodes.VariableExpression v => GetVariable(v.Name, currentScope),
        AstNodes.ArrayDeclarationExpression arr => NexoRuntime.CreateList(arr.Elements.Select(expr => EvalExpr(expr, currentScope)).ToArray()),
        AstNodes.IndexAccessExpression idx => NexoRuntime.GetIndex(EvalExpr(idx.Obj, currentScope), EvalExpr(idx.Index, currentScope)),
        AstNodes.BinaryExpression bin => EvalBin(bin, currentScope),
        AstNodes.CallExpression c => ExecuteFunction(c.Callee, c.Arguments, currentScope)!,
        _ => throw new Exception($"[NXC-017] Deserialization Bug: Unidentifiable semantic node struct '{e.GetType().Name}'.")
    };

    /// <summary>
    /// Sweeps memory scopes sequentially starting from explicit Local parameters, bubbling upwards to absolute variables.
    /// </summary>
    private object GetVariable(string name, Dictionary<string, object> currentScope) {
        if (currentScope.TryGetValue(name, out var val)) return val;
        if (_vars.TryGetValue(name, out var globalVal)) return globalVal;
        
        throw new Exception($"[NXC-018] Memory Access Fault: Reference tracking pointer '{name}' represents a null allocation block.");
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
            _ => throw new Exception($"[NXC-019] Mathematical Parser Engine failed translating arithmetic token delimiter '{b.Op}'.")
        };
    }

    // Internal Truthiness conversion mapping
    private bool IsTrue(object v) => v is bool b ? b : v is int i ? i != 0 : v != null;
}