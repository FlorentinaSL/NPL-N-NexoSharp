import React from "react";
import Logo from "../../components/Logo";

export default function Download() {
  return (
    <div className="animate-fade-in delay-1" style={{ maxWidth: "1000px", margin: "4rem auto", padding: "0 1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginBottom: "1rem" }}><Logo size={80} /></div>
      <h1 className="hero-title" style={{ fontSize: "3.5rem", marginBottom: "0.5rem", textAlign: "center" }}>Global Distribution.</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", textAlign: "center", marginBottom: "4rem" }}>Acquire the NPL (Nexo Programming Language) engine natively compiled for your architecture.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {/* Windows Core */}
        <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", background: "rgba(124, 58, 237, 0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem" }}>🪟</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Windows OS</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", flex: 1 }}>
            Official Setup Installer (.exe) — registers .nexo file association, injects PATH globally, and creates a Start Menu shortcut automatically.
          </p>
          <a href="/NexoSetup.exe" download="NexoSetup.exe" className="primary-btn" style={{ width: "100%", textDecoration: "none" }}>Download Setup v3.0 (x64)</a>
        </div>

        {/* Linux Core */}
        <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: "64px", height: "64px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem" }}>🐧</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Linux Architecture</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", flex: 1 }}>
            Self-contained binary bridging natively via .NET 9. Drop directly into /usr/local/bin to engage MSIL mapping.
          </p>
          <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp/releases/latest/download/nexo-linux" className="primary-btn" style={{ width: "100%", textDecoration: "none", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>Download Binary (x64)</a>
        </div>

        {/* macOS Core */}
        <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: "64px", height: "64px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem" }}>🍎</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Apple macOS</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", flex: 1 }}>
            Compiled universally for Apple Silicon & Intel processors. Bypasses Roslyn dependencies utilizing raw MSIL emission.
          </p>
          <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp/releases/latest/download/nexo-mac" className="primary-btn" style={{ width: "100%", textDecoration: "none", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>Download Binary (x64)</a>
        </div>
      </div>
      
      <div style={{ marginTop: "4rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.95rem", background: "rgba(124, 58, 237, 0.05)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
        <strong style={{ color: "#a5b4fc" }}>Architectural Note:</strong> Nexo runs strictly locally as a pure native executable. Absolutely zero telemetry or background daemons are injected into your system memory.
      </div>
    </div>
  );
}
