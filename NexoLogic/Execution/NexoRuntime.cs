using System;
using System.Collections.Generic;
using System.Threading;
using System.IO;

namespace NexoLogic.Execution;

/// <summary>
/// Runtime Environment Context for Compiled NPL Executables.
/// Exposes a robust, natively-compiled API surface mapped directly to CLR methods.
/// Bypasses the need for complex MSIL type-checking by dynamically unwrapping generic Object payloads.
/// </summary>
public static class NexoRuntime {
    
    /// <summary>
    /// Global Heap Memory Allocation.
    /// Manages transient state for root-level variables and data structures inaccessible via local stack pointers.
    /// </summary>
    public static readonly Dictionary<string, object> Globals = new();

    // =========================================================================
    // STANDARD I/O BINDINGS
    // =========================================================================
    
    /// <summary>
    /// Dispatches an object string representation directly to the standard output buffer.
    /// </summary>
    public static void Print(object o) {
        Console.WriteLine(o);
    }

    /// <summary>
    /// Blocks the current thread awaiting synchronous user input.
    /// Automatically attempts scalar coercion to Int32 before falling back to string literals.
    /// </summary>
    public static object Read() {
        var input = Console.ReadLine();
        return int.TryParse(input, out int n) ? n : input ?? "";
    }

    // =========================================================================
    // MEMORY MANAGEMENT
    // =========================================================================

    public static void SetGlobal(string name, object value) {
        Globals[name] = value;
    }

    public static object GetGlobal(string name) {
        if (Globals.TryGetValue(name, out var val)) return val;
        throw new Exception($"[NXC-011] Runtime Memory Fault: Unresolved heap reference to global variable '{name}'.");
    }

    // =========================================================================
    // DATA TYPE COERCION & ARITHMETIC
    // =========================================================================

    /// <summary>
    /// Truthiness Evaluator: Ascertains the logical boolean value of dynamically boxed primitives.
    /// </summary>
    public static bool IsTrue(object v) {
        if (v is bool b) return b;
        if (v is int i) return i != 0;
        return v != null;
    }

    public static object Add(object l, object r) {
        if (l is int li && r is int ri) return li + ri;
        return l.ToString() + r.ToString();
    }

    public static object Sub(object l, object r) => (int)l - (int)r;
    public static object Mul(object l, object r) => (int)l * (int)r;
    public static object Div(object l, object r) => (int)l / (int)r;
    
    // Abstract integer-encoded boolean mapping for conditional branch predictions
    public static object Eq(object l, object r) => Equals(l, r) ? 1 : 0;
    public static object Neq(object l, object r) => !Equals(l, r) ? 1 : 0;
    public static object Gt(object l, object r) => (int)l > (int)r ? 1 : 0;
    public static object Lt(object l, object r) => (int)l < (int)r ? 1 : 0;
    public static object Gte(object l, object r) => (int)l >= (int)r ? 1 : 0;
    public static object Lte(object l, object r) => (int)l <= (int)r ? 1 : 0;

    // =========================================================================
    // NATIVE C# FRAMEWORK BRIDGING
    // Externally invokable via NPL code implicitly bypassing structural paradigms
    // =========================================================================
    
    // --- System Control ---
    public static void ClearConsole() => Console.Clear();
    public static void Sleep(object ms) => Thread.Sleep(Convert.ToInt32(ms));
    public static object Random(object min, object max) => new Random().Next(Convert.ToInt32(min), Convert.ToInt32(max));
    public static object SystemTime() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();

    // --- File System Descriptors ---
    public static object FileRead(object path) => File.ReadAllText(path.ToString()!);
    public static void FileWrite(object path, object content) => File.WriteAllText(path.ToString()!, content.ToString()!);
    public static object FileExists(object path) => File.Exists(path.ToString()!) ? 1 : 0;

    // --- String Manipulation APIs ---
    public static object StringLength(object str) => str.ToString()!.Length;
    public static object StringReplace(object str, object oldVal, object newVal) => str.ToString()!.Replace(oldVal.ToString()!, newVal.ToString()!);
    public static object StringContains(object str, object val) => str.ToString()!.Contains(val.ToString()!) ? 1 : 0;
    public static object StringUpper(object str) => str.ToString()!.ToUpper();
    public static object StringLower(object str) => str.ToString()!.ToLower();

    /// <summary>
    /// Explicit Integer coercion casting.
    /// </summary>
    public static object ParseInt(object val) => int.TryParse(val.ToString(), out int r) ? r : 0;
}
