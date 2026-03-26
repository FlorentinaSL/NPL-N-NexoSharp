using System;
using System.Diagnostics;
using System.IO;
using NexoLogic.Lexing;
using NexoLogic.Parsing;
using NexoLogic.Execution;
using System.Net.Http;
using System.Threading.Tasks;

namespace NexoCompiler;

/// <summary>
/// CLI Bootstrap entry point for the Nexo Programming Language (NPL).
/// Orchestrates REPL environments, Just-In-Time execution traversing, and Ahead-Of-Time (AOT) MSIL compilation workloads.
/// </summary>
public static class Program {
    
    public static void Main(string[] args) {
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.WriteLine(@"
  _   _ _______   _____  
 | \ | |  ____\ \ / / _ \ 
 |  \| | |__   \ V / | | |
 | . ` |  __|   > <| | | |
 | |\  | |____ / . \ |_| |
 |_| \_|______/_/ \_\___/ 
");
        Console.ResetColor();
        Console.WriteLine("    [NPL - Nexo Programming Language] - Version 2.0.0");
        Console.WriteLine("    Copyright (c) 2026 Spicco D'aura. All rights reserved.\n");
        Console.WriteLine("Type 'help' for explicit daemon architecture usage, or 'exit' to unmount.\n");

        // Native Argument Binding: Handle implicit executions via OS double-clicks or shell parameters
        if (args.Length > 0)
        {
            string command = args[0].ToLower();
            if (command == "build" && args.Length > 1) {
                BuildFile(args[1]);
            } else if (command == "run" && args.Length > 1) {
                RunDll(args[1]);
            } else if (command == "install" && args.Length > 1) {
                InstallPackage(args[1]).Wait();
            } else if (command == "publish" && args.Length > 1) {
                PublishPackage(string.Join(" ", args[1..])).Wait();
            } else if (command == "open" && args.Length > 1) {
                ExecuteFile(args[1]);
            } else if (command != "build" && command != "open" && command != "run" && command != "publish" && command != "install") {
                // Fallback: Default to JIT execution if raw path is passed without explicit commands
                ExecuteFile(command); 
            } else {
                Console.WriteLine("Usage: NexoCompiler [build|open|install|publish] args");
            }
            
            // Unmount process synchronously without hanging CI/CD daemon layers
            return;
        }

        // REPL Emulation Sequence
        bool running = true;
        while (running)
        {
            Console.Write("Nexo > ");
            string fullInput = Console.ReadLine()?.Trim() ?? "";
            if (string.IsNullOrEmpty(fullInput)) continue;

            // Lexical Pre-Parsing: Splitting terminal commands from target file descriptor payloads
            string[] parts = fullInput.Split(' ', 2); 
            string command = parts[0].ToLower();
            string argument = parts.Length > 1 ? parts[1].Replace("\"", "") : "";

            switch (command)
            {
                case "help":
                    ShowHelp();
                    break;

                case "version":
                    ShowVersion();
                    break;

                case "exit":
                    running = false;
                    break;

                case "open":
                    if (string.IsNullOrEmpty(argument))
                    {
                        // Open the runtime binaries folder securely using OS explorer mapping
                        string appPath = AppDomain.CurrentDomain.BaseDirectory;
                        Process.Start("explorer.exe", appPath);
                        Console.WriteLine($"[INFO] Installation directory linked: {appPath}");
                    }
                    else
                    {
                        ExecuteFile(argument);
                    }
                    break;

                case "build":
                    if (string.IsNullOrEmpty(argument))
                    {
                        Console.WriteLine("Usage: build [file_path]");
                    }
                    else
                    {
                        BuildFile(argument);
                    }
                    break;

                case "run":
                    if (string.IsNullOrEmpty(argument) || !argument.EndsWith(".dll"))
                    {
                        Console.WriteLine("Usage: run [compiled_file.dll]");
                    }
                    else
                    {
                        RunDll(argument);
                    }
                    break;
                    
                case "install":
                    if (string.IsNullOrEmpty(argument))
                    {
                        Console.WriteLine("Usage: install [package] (e.g., nexo install nexocore.math)");
                    }
                    else
                    {
                        InstallPackage(argument).Wait();
                    }
                    break;
                    
                case "publish":
                    if (string.IsNullOrEmpty(argument))
                    {
                        Console.WriteLine("Usage: publish <namespace> <file.nexo> <auth_key>");
                    }
                    else
                    {
                        PublishPackage(argument).Wait();
                    }
                    break;

                default:
                    // Implicit execution fallback for raw file dropping into the shell
                    ExecuteFile(fullInput.Replace("\"", ""));
                    break;
            }
        }
    }

    // =========================================================================
    // CLI DAEMON SUPPORT SUBROUTINES
    // =========================================================================

    private static void ShowHelp()
    {
        Console.WriteLine("\n--- AVAILABLE COMMANDS ---");
        Console.WriteLine("help              : Show this diagnostic help message");
        Console.WriteLine("version           : Display underlying NPL runtime infrastructure version");
        Console.WriteLine("open [file_path]  : Execute a specific .nexo script in JIT memory via Interpreter");
        Console.WriteLine("build [file_path] : Compile a .nexo script into a native .NET execution assembly (.dll)");
        Console.WriteLine("run [file.dll]    : Fast-launch a pre-compiled MSIL .nexo assembly directly into CLR");
        Console.WriteLine("install [package] : Download and map remote .nexo ecosystems globally via NPM");
        Console.WriteLine("publish [args]    : Upload native modules to explicitly authenticated NPM domains");
        Console.WriteLine("open              : Explore internal host installation architecture");
        Console.WriteLine("exit              : Terminate the active Nexo REPL shell");
        Console.WriteLine("---------------------------\n");
    }

    private static void ShowVersion()
    {
        Console.WriteLine("\nNPL - Nexo Programming Language");
        Console.WriteLine("Core Build: 1.0.0-Stable");
        Console.WriteLine("Developed by: Luca Cisternino\n");
    }

    /// <summary>
    /// JIT Execution Environment Pipeline.
    /// Bypasses explicit disk compilation by dynamically streaming tokens into the Interpreter's active memory grid.
    /// </summary>
    private static void ExecuteFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            Console.WriteLine($"\n[FATAL] I/O Error: Target file reference not found at: '{filePath}'");
            return;
        }

        try 
        {
            string sourceCode = File.ReadAllText(filePath);
            Console.WriteLine($"\n[JIT Execution Protocol: {Path.GetFileName(filePath)}]");
            
            var lexer = new Lexer(sourceCode);
            var tokens = lexer.Tokenize();
            var parser = new Parser(tokens);
            var ast = parser.Parse();
            
            var interpreter = new Interpreter();
            interpreter.Execute(ast);
            
            Console.WriteLine("[System Halted Gracefully]\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n[FATAL] Interpreter Crash Hook: {ex.Message}\n");
        }
    }

    /// <summary>
    /// Ahead-Of-Time (AOT) Emission Engine.
    /// Links, Parses, and emits raw .NET MSIL bytecodes to disk utilizing Reflection.Emit algorithms.
    /// </summary>
    private static void BuildFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            Console.WriteLine($"\n[FATAL] I/O Error: Target compilation file reference not found at: '{filePath}'");
            return;
        }

        try 
        {
            string sourceCode = File.ReadAllText(filePath);
            Console.WriteLine($"\n[MSIL Compilation Booting: {Path.GetFileName(filePath)}]");
            
            var lexer = new Lexer(sourceCode);
            var tokens = lexer.Tokenize();
            var parser = new Parser(tokens);
            var ast = parser.Parse();
            
            // Establish payload target trajectory relative to the compiling host string
            string outPath = Path.Combine(Path.GetDirectoryName(filePath) ?? "", Path.GetFileNameWithoutExtension(filePath) + ".dll");
            
            var compiler = new Compiler(ast);
            compiler.Compile(outPath);
            
            // Target specific framework compatibility by actively dropping .runtimeconfig.json mappings
            string configPath = Path.Combine(Path.GetDirectoryName(filePath) ?? "", Path.GetFileNameWithoutExtension(filePath) + ".runtimeconfig.json");
            File.WriteAllText(configPath, @"{
  ""runtimeOptions"": {
    ""tfm"": ""net9.0"",
    ""framework"": {
      ""name"": ""Microsoft.NETCore.App"",
      ""version"": ""9.0.0""
    }
  }
}");
            
            Console.WriteLine($"[SUCCESS] Pipeline finalized. Execute payload bounds natively using: dotnet {Path.GetFileNameWithoutExtension(filePath)}.dll\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n[FATAL] MSIL Emission Crash Hook: {ex.Message}\n");
        }
    }

    /// <summary>
    /// Invokes pre-compiled Common Intermediate Language (CIL) bytes transparently inside 
    /// the host infrastructure's execution limits via dynamic reflection instantiation.
    /// </summary>
    private static void RunDll(string dllPath)
    {
        if (!File.Exists(dllPath))
        {
            Console.WriteLine($"\n[FATAL] Executable Fault: Native Assembly mapping not found at: '{dllPath}'");
            return;
        }

        try 
        {
            Console.WriteLine($"\n[Native CLR Shell Execution: {Path.GetFileName(dllPath)}]");
            var assembly = System.Reflection.Assembly.LoadFrom(dllPath);
            var programType = assembly.GetType("Program");
            if (programType == null) throw new Exception("[NXC-100] Execution Fault: Bootstrapper root class 'Program' is strictly omitted from generated DLL bounds.");
            
            var mainMethod = programType.GetMethod("Main");
            if (mainMethod == null) throw new Exception("[NXC-101] Execution Fault: Sequential bootstrapping method 'Main' is utterly unreachable.");
            
            mainMethod.Invoke(null, null);
            Console.WriteLine("\n[System Halted Gracefully]\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n[FATAL] Abstract Architecture Exception: {ex.Message}\n");
        }
    }

    /// <summary>
    /// NPM (Nexo Package Manager) Native CLI Downloader.
    /// Reaches out to the Nexo Registry API to fetch standard '.nexo' library sources and map them physically globally.
    /// </summary>
    private static async Task InstallPackage(string packageName)
    {
        Console.WriteLine($"\n[NPM] Contacting global registry for package: '{packageName}'...");
        string registryUrl = $"https://nexosharp.vercel.app/api/registry/{packageName}";
        
        try 
        {
            using var client = new HttpClient();
            // Assign custom timeout to prevent REPL from halting indefinitely on networking stalls
            client.Timeout = TimeSpan.FromSeconds(15);
            var response = await client.GetAsync(registryUrl);
            
            if (!response.IsSuccessStatusCode) {
                Console.WriteLine($"[FATAL] NPM Registry Fault: Package '{packageName}' was not found across the index bounds (Status: {response.StatusCode}).");
                return;
            }
            
            string sourceCode = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"[SUCCESS] NPM payload extraction complete ({sourceCode.Length} bytes).");
            
            // Map payload strictly towards User-Requested OS Bounds
            string targetBaseDir = @"C:\Programs\Nexo\libs";
            if (!Directory.Exists(targetBaseDir)) Directory.CreateDirectory(targetBaseDir);
            
            string fileName = packageName.Replace(".", @"\") + ".nexo";
            string fullDestPath = Path.Combine(targetBaseDir, fileName);
            
            // Build trailing recursive folder injections seamlessly
            string fileDir = Path.GetDirectoryName(fullDestPath)!;
            if (!Directory.Exists(fileDir)) Directory.CreateDirectory(fileDir);
            
            File.WriteAllText(fullDestPath, sourceCode);
            Console.WriteLine($"[+] Module deployed structurally to: {fullDestPath}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n[FATAL] NPM Networking Crash Hook: {ex.Message}\n");
        }
    }

    /// <summary>
    /// NPM Edge Deployment Engine.
    /// Bridges raw local N# syntax files to the Global Vercel Next.js Database via strict Cryptographic Bearer Auths.
    /// </summary>
    private static async Task PublishPackage(string arguments)
    {
        string[] parts = arguments.Split(' ', 3, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 3) {
            Console.WriteLine("[FATAL] NPM Publishing Syntax Constraint: 'nexo publish <namespace> <file_path.nexo> <cryptographic_key>'");
            return;
        }
        
        string packageName = parts[0];
        string filePath = parts[1];
        string token = parts[2];
        
        if (!File.Exists(filePath)) {
            Console.WriteLine($"[FATAL] I/O Fault: Target blueprint script '{filePath}' is structurally unreachable.");
            return;
        }
        
        string sourceCode = File.ReadAllText(filePath);
        Console.WriteLine($"\n[NPM] Authenticating global deploy sequence for namespace '{packageName}'...");
        
        try {
            using var client = new HttpClient();
            // Assign strict 20-second timeout constraints
            client.Timeout = TimeSpan.FromSeconds(20);
            
            // Inject Cryptographic Metadata
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            
            // Build raw JSON payload natively without massive external dependencies
            string escapedCode = sourceCode.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "");
            string jsonPayload = $"{{\"name\": \"{packageName}\", \"code\": \"{escapedCode}\"}}";
            
            var content = new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://nexosharp.vercel.app/api/registry", content);
            
            string responseBody = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode) {
                Console.WriteLine($"[SUCCESS] Cryptographic verification confirmed. Package '{packageName}' dynamically synced terminating to Next.js API Hub.\n");
            } else {
                Console.WriteLine($"\n[FATAL] NPM Edge Integrity Rejection (HTTP {response.StatusCode}): {responseBody}\n");
            }
        }
        catch (Exception ex) {
            Console.WriteLine($"\n[FATAL] NPM Networking Crash Hook: {ex.Message}\n");
        }
    }
}