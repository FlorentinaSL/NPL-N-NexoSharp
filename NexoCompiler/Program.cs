using System.Diagnostics;
using NexoLogic.Lexing;
using NexoLogic.Parsing;
using NexoLogic.Execution;

Console.WriteLine("NPL (Nexo Programming Language) - Version 1.0.0");
Console.WriteLine("Copyright (c) 2026 Luca Cisternino. All rights reserved.");
Console.WriteLine("Type 'help' for usage, 'exit' to quit.\n");

// Gestione immediata se passato come argomento esterno (es. doppio clic o CLI)
if (args.Length > 0)
{
    string command = args[0].ToLower();
    if (command == "build" && args.Length > 1) {
        BuildFile(args[1]);
    } else if (command == "run" && args.Length > 1) {
        RunDll(args[1]);
    } else if (command == "open" && args.Length > 1) {
        ExecuteFile(args[1]);
    } else if (command != "build" && command != "open" && command != "run") {
        ExecuteFile(command); // Se ha passato direttamente il path
    } else {
        Console.WriteLine("Usage: NexoCompiler [build|open] file.nexo");
    }
    
    // We don't read key physically if there's no console window attached, 
    // but for simplicity let's just return to avoid hanging CI/CD processes.
    return;
}

bool running = true;
while (running)
{
    Console.Write("Nexo > ");
    string fullInput = Console.ReadLine()?.Trim() ?? "";
    if (string.IsNullOrEmpty(fullInput)) continue;

    // Dividiamo l'input: la prima parola è il comando, il resto è l'argomento (il percorso)
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
                // Se scrivi solo 'open', apriamo la cartella di installazione come bonus
                string appPath = AppDomain.CurrentDomain.BaseDirectory;
                Process.Start("explorer.exe", appPath);
                Console.WriteLine($"Installation directory opened: {appPath}");
            }
            else
            {
                // Se scrivi 'open C:\file.nexo', lo eseguiamo
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

        default:
            // Se trascini solo il file senza scrivere 'open' prima, funziona lo stesso
            ExecuteFile(fullInput.Replace("\"", ""));
            break;
    }
}

// --- FUNZIONI DI SUPPORTO ---

static void ShowHelp()
{
    Console.WriteLine("\n--- AVAILABLE COMMANDS ---");
    Console.WriteLine("help              : Show this help message");
    Console.WriteLine("version           : Display NPL information");
    Console.WriteLine("open [file_path]  : Execute a specific .nexo file");
    Console.WriteLine("build [file_path] : Compile a .nexo file into an executable assembly (.dll)");
    Console.WriteLine("run [file.dll]    : Run a compiled .nexo IL assembly natively");
    Console.WriteLine("open              : Open NPL installation folder");
    Console.WriteLine("exit              : Close the Nexo shell");
    Console.WriteLine("---------------------------\n");
}

static void ShowVersion()
{
    Console.WriteLine("\nNPL - Nexo Programming Language");
    Console.WriteLine("Build: 1.0.0-Stable");
    Console.WriteLine("Developed by: Luca Cisternino\n");
}

static void ExecuteFile(string filePath)
{
    if (!File.Exists(filePath))
    {
        Console.WriteLine($"\nERROR: File not found: '{filePath}'");
        return;
    }

    try 
    {
        string sourceCode = File.ReadAllText(filePath);
        Console.WriteLine($"\n[Running: {Path.GetFileName(filePath)}]");
        
        var lexer = new Lexer(sourceCode);
        var tokens = lexer.Tokenize();
        var parser = new Parser(tokens);
        var ast = parser.Parse();
        var interpreter = new Interpreter();
        
        interpreter.Execute(ast);
        Console.WriteLine("[Done]\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nRUNTIME ERROR: {ex.Message}\n");
    }
}

static void BuildFile(string filePath)
{
    if (!File.Exists(filePath))
    {
        Console.WriteLine($"\nERROR: File not found: '{filePath}'");
        return;
    }

    try 
    {
        string sourceCode = File.ReadAllText(filePath);
        Console.WriteLine($"\n[Compiling: {Path.GetFileName(filePath)}]");
        
        var lexer = new Lexer(sourceCode);
        var tokens = lexer.Tokenize();
        var parser = new Parser(tokens);
        var ast = parser.Parse();
        
        // Output as DLL for Core/5+
        string outPath = Path.Combine(Path.GetDirectoryName(filePath) ?? "", Path.GetFileNameWithoutExtension(filePath) + ".dll");
        
        var compiler = new Compiler(ast);
        compiler.Compile(outPath);
        
        // Optional: generate runtimeconfig.json so it can be run with 'dotnet myapp.dll'
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
        
        Console.WriteLine($"[Done] You can run your compiled program with: dotnet {Path.GetFileNameWithoutExtension(filePath)}.dll\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nCOMPILATION ERROR: {ex.Message}\n");
    }
}

static void RunDll(string dllPath)
{
    if (!File.Exists(dllPath))
    {
        Console.WriteLine($"\nERROR: Compiled file not found: '{dllPath}'");
        return;
    }

    try 
    {
        Console.WriteLine($"\n[Native Execution: {Path.GetFileName(dllPath)}]");
        var assembly = System.Reflection.Assembly.LoadFrom(dllPath);
        var programType = assembly.GetType("Program");
        if (programType == null) throw new Exception("Entry class 'Program' not found in DLL.");
        var mainMethod = programType.GetMethod("Main");
        if (mainMethod == null) throw new Exception("Entry method 'Main' not found in DLL.");
        
        mainMethod.Invoke(null, null);
        Console.WriteLine("\n[Done]\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nNATIVE EXECUTION ERROR: {ex.Message}\n");
    }
}