"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [packages, setPackages] = useState<string[]>([]);
  const [pubName, setPubName] = useState("");
  const [pubCode, setPubCode] = useState("");
  const [pubStatus, setPubStatus] = useState("");

  // Hook Next.js API dynamic state mapping correctly
  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/registry");
      const data = await res.json();
      if (Array.isArray(data)) setPackages(data);
    } catch(e) {}
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPubStatus("Publishing strictly to network registry...");
    try {
      const res = await fetch("/api/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pubName, code: pubCode })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPubStatus(`Success! '${pubName}' is now hosted globally via NPM.`);
      setPubName("");
      setPubCode("");
      fetchPackages(); // Reload ecosystem bounds
    } catch(e: any) {
      setPubStatus(e.message || "Failed deployment payload.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", padding: "0 2rem", paddingBottom: "5rem" }}>
      <div className="ambient-glow"></div>
      
      {/* Navigation */}
      <nav className="animate-fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 0", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "-1px" }}>NEXO</div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Docs</a>
          <a href="#registry" style={{ color: "inherit", textDecoration: "none" }}>NPM Registry</a>
          <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp" target="_blank" rel="noopener noreferrer" style={{ color: "#a5b4fc", textDecoration: "none" }}>GitHub</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="animate-fade-in delay-1" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "5rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ 
          border: "1px solid var(--accent-primary)", color: "#a5b4fc", padding: "4px 12px", 
          borderRadius: "99px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "2rem", background: "rgba(124, 58, 237, 0.1)"
        }}>
          v1.0.0 Global NPM Sync Enabled
        </div>
        
        <h1 className="hero-title">The Future of <br/>Dynamic Scripting.</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.25rem", lineHeight: "1.6", marginBottom: "3rem" }}>
          NPL (Nexo Programming Language) is an enterprise-grade ecosystem. <br/>
          Write typed-free dynamic syntax. Compile linearly to MSIL logic. <br/>
          Push massive N# libraries to the entire world via our NPM Hub.
        </p>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp" target="_blank" rel="noreferrer" className="primary-btn" style={{textDecoration: "none"}}>Star on GitHub</a>
          <a href="#registry" className="secondary-btn" style={{textDecoration: "none"}}>Explore Ecosytem</a>
        </div>
      </section>

      {/* Interactive Terminal */}
      <section className="animate-fade-in delay-2 animate-float" style={{ maxWidth: "800px", margin: "4rem auto 3rem" }}>
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
            {"    "}<span style={{ color: "#e06c75" }}>config</span> = <span style={{ color: "#56b6c2" }}>http_get</span>(<span style={{ color: "#98c379" }}>"https://api.nexo.dev/v1/launch"</span>)<br/>
            {"    "}<span style={{ color: "#e5c07b" }}>write</span> <span style={{ color: "#98c379" }}>"Node Ready: "</span> + <span style={{ color: "#e06c75" }}>config</span><br/>
            <span style={{ color: "#d1d5db" }}>{"}"}</span><br/>
          </pre>
        </div>
        <div className="animate-fade-in delay-3" style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          $ nexo install nexocore.http <span style={{ color: "#22c55e" }}># Download dynamically utilizing NPM mapping</span>
        </div>
      </section>

      {/* Global Interactive NPM Ecosystem Panel */}
      <section id="registry" className="animate-fade-in delay-3" style={{ maxWidth: "1000px", margin: "8rem auto" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Global NPM Registry</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.1rem" }}>Discover official and community N# packages. Fully detached from native core bounds.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
          
          {/* Active Cloud Index */}
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#a5b4fc" }}>Available Ecosystem Modules</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {packages.map(pkg => (
                <div key={pkg} className="glass-panel" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "1.1rem" }}>{pkg}</strong>
                  <code style={{ background: "rgba(0,0,0,0.3)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", color: "#98c379" }}>
                    nexo install {pkg}
                  </code>
                </div>
              ))}
              {packages.length === 0 && <div style={{ color: "var(--text-muted)" }}>Registry offline or no modules dynamically resolved.</div>}
            </div>
          </div>
          
          {/* Community Source Upload Hook */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Publish Your Code.</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>Extend Nexo's architectural boundaries. Submitting this directly links your text blocks to the global Cloud Database Array.</p>
            
            <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a5b4fc" }}>Package Identifier Namespace</label>
                <input 
                  type="text" 
                  value={pubName}
                  onChange={(e) => setPubName(e.target.value)}
                  placeholder="custom.networking" 
                  style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "white", padding: "12px", borderRadius: "6px", outline: "none" }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a5b4fc" }}>Raw N# Source Execution Flow</label>
                <textarea 
                  value={pubCode}
                  onChange={(e) => setPubCode(e.target.value)}
                  placeholder={`<3 Internal Community Extension\ndo broadcast_signal() {\n    write "Transmitting sequence..."\n}`} 
                  style={{ width: "100%", height: "150px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "#d1d5db", padding: "12px", borderRadius: "6px", outline: "none", fontFamily: "monospace", resize: "vertical" }}
                  required
                />
              </div>
              
              <button type="submit" className="primary-btn" style={{ marginTop: "0.5rem", width: "100%" }}>Broadcast NPM Release</button>
              
              {pubStatus && (
                <div style={{ marginTop: "1rem", padding: "12px", borderRadius: "6px", fontSize: "0.9rem", background: pubStatus.includes("NXC") || pubStatus.includes("Failed") ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", color: pubStatus.includes("NXC") || pubStatus.includes("Failed") ? "#ef4444" : "#22c55e", border: "1px solid var(--glass-border)" }}>
                  {pubStatus}
                </div>
              )}
            </form>
          </div>
          
        </div>
      </section>
    </main>
  );
}
