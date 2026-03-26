export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Hero Section */}
      <section className="animate-fade-in delay-1" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "5rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ 
          border: "1px solid var(--accent-primary)", color: "#a5b4fc", padding: "4px 12px", 
          borderRadius: "99px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "2rem", background: "rgba(124, 58, 237, 0.1)"
        }}>
          v1.0.0 Online: Advanced Windows MSI Available
        </div>
        
        <h1 className="hero-title">The Future of <br/>Dynamic Scripting.</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.25rem", lineHeight: "1.6", marginBottom: "3rem" }}>
          NPL (Nexo Programming Language) is an enterprise-grade ecosystem. <br/>
          Write typed-free dynamic syntax. Compile linearly to MSIL logic. <br/>
          Push massive N# libraries to the entire world via our NPM Hub.
        </p>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="/NexoSetup.exe" download className="primary-btn" style={{textDecoration: "none", display: "inline-block"}}>Download Windows Setup</a>
          <a href="/docs" className="secondary-btn" style={{textDecoration: "none", display: "inline-block"}}>Read Documentation</a>
        </div>
      </section>

      {/* Interactive Terminal */}
      <section className="animate-fade-in delay-2 animate-float" style={{ maxWidth: "800px", margin: "4rem auto 0rem", width: "100%" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", position: "relative" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#eab308" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }}></div>
          </div>
          <pre style={{ color: "#d1d5db", fontSize: "0.95rem", lineHeight: "1.5", overflowX: "auto", fontFamily: "monospace" }}>
            <span style={{ color: "#c678dd" }}>using</span> <span style={{ color: "#61afef" }}>nexocore.http</span><br/>
            <br/>
            <span style={{ color: "#c678dd" }}>do</span> <span style={{ color: "#61afef" }}>NexoArchitecture</span>()<span style={{ color: "#d1d5db" }}> {"{"}</span><br/>
            {"    "}<span style={{ color: "#e06c75" }}>config</span> = <span style={{ color: "#56b6c2" }}>http_get</span>(<span style={{ color: "#98c379" }}>"https://nexosharp.vercel.app/api/launch"</span>)<br/>
            {"    "}<span style={{ color: "#e5c07b" }}>write</span> <span style={{ color: "#98c379" }}>"Node Ready: "</span> + <span style={{ color: "#e06c75" }}>config</span><br/>
            <span style={{ color: "#d1d5db" }}>{"}"}</span><br/>
          </pre>
        </div>
        <div className="animate-fade-in delay-3" style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          $ nexo install nexocore.http <span style={{ color: "#22c55e" }}>{"<3"} Download dynamically utilizing NPM mapping</span>
        </div>
      </section>
    </div>
  );
}
