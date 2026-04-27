using System;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System.Net;
using System.Net.Sockets;

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

    /// <summary>
    /// AOT Linker Rooting Entry Point.
    /// Explicitly references native methods to prevent the Native AOT Linker from stripping them during compilation.
    /// </summary>
    public static void AnchorNativeMethods() {
        // Cozmo Hardware Stack (Forced Rooting)
        var _ = new Action<object>(CozmoSay);
        var __ = new Func<object, object>(CozmoConnect);
        var ___ = new Action<object, object>(CozmoMove);
        var ____ = new Action<object>(CozmoAnimate);
        var _____ = new Action<object>(CozmoSetHeadAngle);
        var ______ = new Action<object>(Wait);
        var _______ = new Action<object, object>(CozmoTurn);
        var ________ = new Action<object>(CozmoSetLift);
    }

    // =========================================================================
    // NATIVE COZMO HARDWARE ENGINE (NPL CLAD DRIVER)
    // =========================================================================
    private static TcpClient? _cozmoClient;
    private static NetworkStream? _cozmoStream;
    private static bool _cozmoActive = false;

    private static void SendCozmoBinary(ushort id, byte[] payload) {
        if (_cozmoStream == null || !_cozmoActive) return;
        
        int length = 2 + payload.Length;
        byte[] header = new byte[6];
        
        byte[] lenBytes = BitConverter.GetBytes(length);
        byte[] idBytes = BitConverter.GetBytes(id);
        
        Array.Copy(lenBytes, 0, header, 0, 4);
        Array.Copy(idBytes, 0, header, 4, 2);
        
        _cozmoStream.Write(header, 0, 6);
        _cozmoStream.Write(payload, 0, payload.Length);
        _cozmoStream.Flush();
    }

    private static void CozmoHeartbeatLoop() {
        while (_cozmoActive) {
            try {
                SendCozmoBinary((ushort)0x00, Array.Empty<byte>());
                Thread.Sleep(2000);
            } catch {
                _cozmoActive = false; break;
            }
        }
    }

    private static float ToFloat(object val) {
        if (val is int i) return (float)i;
        if (val is float f) return f;
        if (val is double d) return (float)d;
        if (val is long l) return (float)l;
        if (float.TryParse(val.ToString(), out float r)) return r;
        return 0.0f;
    }

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
    // ENTERPRISE JSON SERIALIZATION ENGINE
    // =========================================================================

    public static object JsonParse(object jsonString) {
        try {
            var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var doc = System.Text.Json.JsonDocument.Parse(jsonString.ToString()!);
            return UnwrapJsonElement(doc.RootElement);
        } catch {
            throw new Exception("[NXC-040] Serialization Fault: String footprint is not structurally valid JSON.");
        }
    }

    private static object UnwrapJsonElement(System.Text.Json.JsonElement element) {
        switch (element.ValueKind) {
            case System.Text.Json.JsonValueKind.Object:
                var dict = new Dictionary<string, object>();
                foreach (var prop in element.EnumerateObject()) dict[prop.Name] = UnwrapJsonElement(prop.Value);
                return dict;
            case System.Text.Json.JsonValueKind.Array:
                var list = new List<object>();
                foreach (var item in element.EnumerateArray()) list.Add(UnwrapJsonElement(item));
                return list;
            case System.Text.Json.JsonValueKind.String: return element.GetString()!;
            case System.Text.Json.JsonValueKind.Number: 
                // Dynamically box back to int for N# compatibility
                return element.TryGetInt32(out int n) ? n : element.GetDouble();
            case System.Text.Json.JsonValueKind.True: return 1;
            case System.Text.Json.JsonValueKind.False: return 0;
            default: return "";
        }
    }
    
    public static object JsonStringify(object obj) {
        return System.Text.Json.JsonSerializer.Serialize(obj);
    }

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

    // =========================================================================
    // URL PACKET MANIPULATION
    // =========================================================================

    public static object UrlEncode(object rawString) => System.Web.HttpUtility.UrlEncode(rawString.ToString()!);
    public static object UrlDecode(object encodedString) => System.Web.HttpUtility.UrlDecode(encodedString.ToString()!);

    // =========================================================================
    // CLOUD ARTIFICIAL INTELLIGENCE (LLM INJECTION)
    // =========================================================================

    public static object AiGenerate(object systemPrompt, object userPrompt, object bearerToken) {
        using var client = new System.Net.Http.HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {bearerToken}");
        client.DefaultRequestHeaders.Add("User-Agent", "NPL/2.0");

        var payload = new {
            model = "gpt-4o",
            messages = new[] {
                new { role = "system", content = systemPrompt.ToString() },
                new { role = "user", content = userPrompt.ToString() }
            }
        };

        var content = new System.Net.Http.StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
        var response = client.PostAsync("https://api.openai.com/v1/chat/completions", content).GetAwaiter().GetResult();
        
        try {
            var rawJson = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            var doc = System.Text.Json.JsonDocument.Parse(rawJson);
            return doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString()!;
        } catch {
            return "[NXC-050] AI Generation Fault: The LLM Provider rejected the sequence or the hardware token is restricted.";
        }
    }

    // =========================================================================
    // COZMO ROBOTICS ENGINE (NPL BRIDGE)
    // =========================================================================

    public static object CozmoConnect(object host) {
        string target = host.ToString()!;
        if (target == "" || target == "localhost") target = "127.0.0.1";
        
        Console.WriteLine($"[NEXO-NATIVE] Connecting to Cozmo SDK Bridge @ {target}:5106");
        
        try {
            return AttemptConnection(target);
        } catch {
            // Auto-Linker: If on localhost, try ADB forwarding once
            if (target == "127.0.0.1") {
                Console.WriteLine("[NEXO-NATIVE] Link failed. Attempting ADB Auto-Forward (Bridge Tunneling)...");
                TryAdbForward();
                Thread.Sleep(1000); // Wait for ADB to stabilize
                
                try {
                    return AttemptConnection(target);
                } catch (Exception e2) {
                    Console.WriteLine($"[NEXO-NATIVE] Auto-Link Failed: {e2.Message}");
                    return 0;
                }
            }
            return 0;
        }
    }

    private static object AttemptConnection(string target) {
        _cozmoClient = new TcpClient(target, 5106);
        _cozmoStream = _cozmoClient.GetStream();
        _cozmoActive = true;
        SendCozmoBinary((ushort)0x01, System.Text.Encoding.UTF8.GetBytes("NexoRuntime"));
        new Thread(CozmoHeartbeatLoop).Start();
        Console.WriteLine("[NEXO-NATIVE] Native Handle Established. Robot linked.");
        return 1;
    }

    private static void TryAdbForward() {
        string localAdb = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "adb.exe");
        string[] possibleAdbPaths = {
            localAdb,
            "adb",
            @"C:\Users\ciste\AppData\Local\Android\Sdk\platform-tools\adb.exe"
        };

        foreach (var path in possibleAdbPaths) {
            try {
                var process = new System.Diagnostics.Process {
                    StartInfo = new System.Diagnostics.ProcessStartInfo {
                        FileName = path,
                        Arguments = "forward tcp:5106 tcp:5106",
                        RedirectStandardOutput = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };
                process.Start();
                process.WaitForExit();
                if (process.ExitCode == 0) return; // Success!
            } catch {
                continue;
            }
        }
        Console.WriteLine("[NEXO-NATIVE] ADB not found in system PATH or common SDK locations. Port forwarding might fail.");
    }

    public static void CozmoSay(object text) {
        byte[] payload = System.Text.Encoding.UTF8.GetBytes(text.ToString()!);
        SendCozmoBinary((ushort)0x02, payload);
    }

    public static void CozmoMove(object speed, object distance) {
        byte[] payload = new byte[8];
        byte[] sBytes = BitConverter.GetBytes(ToFloat(speed));
        byte[] dBytes = BitConverter.GetBytes(ToFloat(distance));
        
        Array.Copy(sBytes, 0, payload, 0, 4);
        Array.Copy(dBytes, 0, payload, 4, 4);
        
        SendCozmoBinary((ushort)0x03, payload);
    }

    public static void CozmoAnimate(object animName) {
        string nameStr = animName?.ToString() ?? "";
        byte[] payload = System.Text.Encoding.UTF8.GetBytes(nameStr);
        ushort packetId = (ushort)0x04;
        SendCozmoBinary(packetId, payload);
    }

    public static void CozmoSetHeadAngle(object angle) {
        byte[] payload = BitConverter.GetBytes(ToFloat(angle));
        SendCozmoBinary((ushort)0x05, payload);
    }

    public static void CozmoTurn(object angle, object speed) {
        byte[] payload = new byte[8];
        byte[] aBytes = BitConverter.GetBytes(ToFloat(angle));
        byte[] sBytes = BitConverter.GetBytes(ToFloat(speed));
        Array.Copy(aBytes, 0, payload, 0, 4);
        Array.Copy(sBytes, 0, payload, 4, 4);
        SendCozmoBinary((ushort)0x06, payload);
    }

    public static void CozmoSetLift(object height) {
        byte[] payload = BitConverter.GetBytes(ToFloat(height));
        SendCozmoBinary((ushort)0x07, payload);
    }

    /// <summary>
    /// Explicit Integer coercion casting.
    /// </summary>
    public static object ParseInt(object val) => int.TryParse(val.ToString(), out int r) ? r : 0;

    /// <summary>
    /// Core System Sync Utility.
    /// Performs a synchronous execution pause on the current thread.
    /// </summary>
    public static void Wait(object ms) {
        if (ms is int val) Thread.Sleep(val);
        else if (int.TryParse(ms.ToString(), out int parsed)) Thread.Sleep(parsed);
    }
}
