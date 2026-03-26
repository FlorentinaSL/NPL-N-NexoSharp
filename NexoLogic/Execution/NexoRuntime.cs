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
    // DYNAMIC COLLECTIONS & ITERATORS BINDING
    // =========================================================================
    
    public static object CreateList(object[] elements) {
        return new List<object>(elements);
    }
    
    public static object GetIndex(object obj, object index) {
        if (obj is List<object> list) {
            int i = Convert.ToInt32(index);
            if (i < 0 || i >= list.Count) throw new Exception($"[NXC-025] Array Bounds Error: Index {i} is strictly out of the list evaluation bounds.");
            return list[i];
        }
        if (obj is string str) {
            int i = Convert.ToInt32(index);
            if (i < 0 || i >= str.Length) throw new Exception($"[NXC-025] String Bounds Error: Index {i} out of bounds.");
            return str[i].ToString();
        }
        throw new Exception($"[NXC-026] Type Error: Target variable is not inherently indexable.");
    }
    
    public static void SetIndex(object obj, object index, object value) {
        if (obj is List<object> list) {
            int i = Convert.ToInt32(index);
            if (i >= list.Count) {
                // Auto-expand dynamic list mapping smoothly
                while (list.Count <= i) list.Add(null!);
            }
            list[i] = value;
            return;
        }
        throw new Exception($"[NXC-027] Type Error: Left hand side assignment target is not an open dynamic list.");
    }
    
    public static object GetEnumerator(object obj) {
        if (obj is System.Collections.IEnumerable enumerable) {
            return enumerable.GetEnumerator();
        }
        throw new Exception($"[NXC-028] Type Error: Attempted to perform iteration over a non-enumerable object structural footprint.");
    }
    
    public static bool MoveNext(object enumerator) {
        return ((System.Collections.IEnumerator)enumerator).MoveNext();
    }
    
    public static object GetCurrent(object enumerator) {
        return ((System.Collections.IEnumerator)enumerator).Current!;
    }
    
    // Explicit runtime push extension allowing list appending remotely
    public static void ListPush(object obj, object val) {
        if (obj is List<object> list) list.Add(val);
    }

    // --- Dynamic Key-Value Mapping (Dictionaries) ---
    public static object MapCreate() => new Dictionary<string, object>();
    
    public static void MapSet(object map, object key, object value) {
        if (map is Dictionary<string, object> dict) dict[key.ToString()!] = value;
        else throw new Exception("[NXC-029] Type Error: MapSet strictly requires an active Dictionary allocation.");
    }
    
    public static object MapGet(object map, object key) {
        if (map is Dictionary<string, object> dict) {
            return dict.TryGetValue(key.ToString()!, out var val) ? val : "";
        }
        throw new Exception("[NXC-030] Type Error: MapGet exclusively binds to Dictionary matrix formats.");
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
    // NATIVE .NET FRAMEWORK BRIDGING
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

    // --- Enterprise Networking (HTTP/HTTPS) ---
    public static object HttpGet(object url) {
        using var client = new System.Net.Http.HttpClient();
        client.DefaultRequestHeaders.Add("User-Agent", "NexoRuntime/1.0");
        return client.GetStringAsync(url.ToString()).GetAwaiter().GetResult();
    }
    
    public static object HttpPost(object url, object jsonBody) {
        using var client = new System.Net.Http.HttpClient();
        client.DefaultRequestHeaders.Add("User-Agent", "NexoRuntime/1.0");
        var content = new System.Net.Http.StringContent(jsonBody.ToString()!, System.Text.Encoding.UTF8, "application/json");
        var response = client.PostAsync(url.ToString()!, content).GetAwaiter().GetResult();
        return response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
    }

    // --- OS Terminal Thread Executions ---
    public static object ExecuteCommand(object cmd) {
        var process = new System.Diagnostics.Process {
            StartInfo = new System.Diagnostics.ProcessStartInfo {
                FileName = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows) ? "cmd.exe" : "/bin/bash",
                Arguments = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows) ? $"/c {cmd}" : $"-c \"{cmd}\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };
        process.Start();
        return process.StandardOutput.ReadToEnd();
    }

    // --- String Manipulation APIs ---
    public static object StringLength(object str) => str.ToString()!.Length;
    public static object StringReplace(object str, object oldVal, object newVal) => str.ToString()!.Replace(oldVal.ToString()!, newVal.ToString()!);
    public static object StringContains(object str, object val) => str.ToString()!.Contains(val.ToString()!) ? 1 : 0;
    public static object StringUpper(object str) => str.ToString()!.ToUpper();
    public static object StringLower(object str) => str.ToString()!.ToLower();
    
    // --- Cryptographic String Primitives ---
    public static object Base64Encode(object plainText) {
        var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText.ToString()!);
        return System.Convert.ToBase64String(plainTextBytes);
    }
    
    public static object Base64Decode(object base64EncodedData) {
        var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData.ToString()!);
        return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    }

    /// <summary>
    /// Explicit Integer coercion casting.
    /// </summary>
    public static object ParseInt(object val) => int.TryParse(val.ToString(), out int r) ? r : 0;
}
