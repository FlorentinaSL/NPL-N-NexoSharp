using NexoLogic.Execution;
using System;
using System.IO;

class TestNPM {
    static void Main() {
        try {
            Console.WriteLine("--- Nexo.Package.Manager (NPM) Test ---");
            // Attempt to resolve a module that doesn't exist locally
            string path = PackageManager.EnsureModule("nexocore.math");
            Console.WriteLine($"Result: {path}");
            if (File.Exists(path)) {
                Console.WriteLine("SUCCESS: Module downloaded and verified.");
            } else {
                Console.WriteLine("FAILURE: File not found after download.");
            }
        } catch (Exception e) {
            Console.WriteLine($"ERROR: {e.Message}");
        }
    }
}
