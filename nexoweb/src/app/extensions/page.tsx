import Logo from "../../components/Logo";

export default function Extensions() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1rem" }}>
      
      {/* Hero Section */}
      <header className="animate-fade-in" style={{ textAlign: "center", marginBottom: "5rem" }}>
        <div style={{ marginBottom: "2rem", display: "inline-block", filter: "drop-shadow(0 0 15px rgba(124, 58, 237, 0.4))" }}>
          <Logo size={100} />
        </div>
        <h1 className="hero-title" style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>IDE Extensions</h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
          Elevate your Nexo development experience with professional language support. 
          Native integration for industry-standard IDEs, designed for performance and precision.
        </p>
      </header>

      {/* Main Extension Highlight - JetBrains */}
      <section className="animate-fade-in delay-1" style={{ marginBottom: "6rem" }}>
        <div className="glass-panel" style={{ padding: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", position: "relative", overflow: "hidden" }}>
          <div className="animate-shimmer" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}></div>
          
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #000 0%, #333 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold", background: "linear-gradient(to right, #7C3AED, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>JB</span>
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "800" }}>Nexo for JetBrains</h2>
            </div>
            
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ background: "rgba(124, 58, 237, 0.15)", color: "#a5b4fc", padding: "6px 12px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "600", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
                Version 1.0.6 (Stable)
              </span>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "2rem" }}>
              The official Nexo plugin for the JetBrains ecosystem. Experience full-featured NPL development with advanced instrumentation and native performance.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp" target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: "none" }}>
                Download Plugin (.zip)
              </a>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center" }}>
                ID: org.nexo.NexoLanguageSupport
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
             <div className="glass-panel" style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--accent-secondary)" }}>✨ Features</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.95rem", lineHeight: "1.8", color: "var(--text-muted)" }}>
                  <li style={{ display: "flex", gap: "0.75rem" }}><span>•</span> Syntax Highlighting for NPL keywords</li>
                  <li style={{ display: "flex", gap: "0.75rem" }}><span>•</span> Smart Code Completion (IntelliSense)</li>
                  <li style={{ display: "flex", gap: "0.75rem" }}><span>•</span> Real-time Error Detection</li>
                  <li style={{ display: "flex", gap: "0.75rem" }}><span>•</span> Native Nexo.exe Run Configurations</li>
                  <li style={{ display: "flex", gap: "0.75rem" }}><span>•</span> Automated File Templates</li>
                </ul>
             </div>

             <div className="glass-panel" style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--accent-primary)" }}>🖥️ Compatible IDEs</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {["IntelliJ IDEA", "Rider", "CLion", "PyCharm", "WebStorm"].map(ide => (
                    <span key={ide} style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem", border: "1px solid var(--glass-border)" }}>{ide}</span>
                  ))}
                </div>
                <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>Requires IDE version 241 (2024.1) or higher.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="animate-fade-in delay-2" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>Manual Installation</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>1️⃣</div>
            <h4 style={{ marginBottom: "1rem" }}>Download</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Get the latest plugin build (NexoLanguageSupport-1.0.6.zip) from our official distribution channel.</p>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>2️⃣</div>
            <h4 style={{ marginBottom: "1rem" }}>Install from Disk</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Open IDE Settings → Plugins → ⚙️ Icon → Install Plugin from Disk...</p>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>3️⃣</div>
            <h4 style={{ marginBottom: "1rem" }}>Restart</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Apply changes and restart your IDE to activate Nexo syntax and instrumentation.</p>
          </div>

        </div>
      </section>

      {/* Future Support */}
      <section className="animate-fade-in delay-3" style={{ background: "rgba(124, 58, 237, 0.05)", borderRadius: "24px", padding: "4rem 2rem", border: "1px solid var(--glass-border)", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>More Platforms Coming Soon</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 2rem", lineHeight: "1.7" }}>
          We are actively developing extensions for **Visual Studio Code** and **Visual Studio**. Stay tuned for updates on our official repository.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <div style={{ color: "var(--text-muted)", opacity: 0.5 }}>VS Code • In Development</div>
          <div style={{ color: "var(--text-muted)", opacity: 0.5 }}>Visual Studio • Planning</div>
        </div>
      </section>

    </div>
  );
}
