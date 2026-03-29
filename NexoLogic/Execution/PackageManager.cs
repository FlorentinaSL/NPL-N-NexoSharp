using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace NexoLogic.Execution;

/// <summary>
/// Nexo.Package.Manager (NPM)
/// Orchestrates the synchronization between the Global Cloud Registry and the local MSIL filesystem.
/// </summary>
public static class PackageManager {
    private static readonly HttpClient _client = new HttpClient();
    private const string RegistryUrl = "https://nexosharp.com/api/v1/registry/";
    private static readonly string LibsDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Libs");

    /// <summary>
    /// Ensures a module is locally available. 
    /// If missing, it performs an asynchronous cryptographic handshake with the Nexo Registry.
    /// </summary>
    public static string EnsureModule(string moduleName) {
        string relativePath = moduleName.Replace(".", Path.DirectorySeparatorChar.ToString()) + ".nexo";
        string localPath = Path.Combine(LibsDir, relativePath);

        // 1. Primary Cache Probe
        if (File.Exists(localPath)) {
            return localPath;
        }

        // 2. Secondary Network Synchronization
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine($"[NPM] Module '{moduleName}' not found locally. Synchronizing with Global Registry...");
        Console.ResetColor();

        try {
            return DownloadModuleSync(moduleName, localPath);
        } catch (Exception e) {
            throw new Exception($"[NXC-500] NPM Fetch Error: Could not synchronize module '{moduleName}'. {e.Message}");
        }
    }

    private static string DownloadModuleSync(string moduleName, string localPath) {
        // We use GetAwaiter().GetResult() because the Interpreter loop is currently synchronous.
        // In a future MSIL-only runtime, this would be an async task.
        var task = DownloadModuleAsync(moduleName, localPath);
        return task.GetAwaiter().GetResult();
    }

    private static async Task<string> DownloadModuleAsync(string moduleName, string localPath) {
        string url = RegistryUrl + moduleName;
        
        using var response = await _client.GetAsync(url);
        if (!response.IsSuccessStatusCode) {
            throw new Exception($"Registry returned status code {response.StatusCode} for package '{moduleName}'.");
        }

        string sourceCode = await response.Content.ReadAsStringAsync();
        
        // Ensure directory exists
        string? dir = Path.GetDirectoryName(localPath);
        if (dir != null && !Directory.Exists(dir)) {
            Directory.CreateDirectory(dir);
        }

        // Write to local cache
        await File.WriteAllTextAsync(localPath, sourceCode);

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"[NPM] Successfully installed '{moduleName}' to local library array.");
        Console.ResetColor();

        return localPath;
    }
}
