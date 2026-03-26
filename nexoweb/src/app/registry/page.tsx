"use client";

import React, { useState, useEffect } from "react";

export default function Registry() {
  const [packages, setPackages] = useState<string[]>([]);
  const [pubName, setPubName] = useState("");
  const [pubCode, setPubCode] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [pubStatus, setPubStatus] = useState("");

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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pubKey}`
        },
        body: JSON.stringify({ name: pubName, code: pubCode })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPubStatus(`Success! '${pubName}' is now hosted globally via NPM.`);
      setPubName("");
      setPubCode("");
      fetchPackages(); 
    } catch(e: any) {
      setPubStatus(e.message || "Failed deployment payload.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1000px", margin: "4rem auto" }}>
      <h1 className="hero-title" style={{ fontSize: "3rem", textAlign: "center" }}>Global NPM Registry</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.1rem", textAlign: "center" }}>Discover official and community N# packages. Fully detached from native core bounds.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
        {/* Active Cloud Index */}
        <div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#a5b4fc" }}>Available Modules</h3>
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
        <div className="glass-panel" style={{ padding: "2rem", height: "fit-content" }}>
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
                placeholder={`<3 Internal Community Extension\ndo broadcast() {\n    return "Signal Sent"\n}`} 
                style={{ width: "100%", height: "150px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "#d1d5db", padding: "12px", borderRadius: "6px", outline: "none", fontFamily: "monospace", resize: "vertical" }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a5b4fc" }}>V1 Cryptographic API Key</label>
              <input 
                type="password" 
                value={pubKey}
                onChange={(e) => setPubKey(e.target.value)}
                placeholder="••••••••••••••••" 
                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "white", padding: "12px", borderRadius: "6px", outline: "none" }}
                required
              />
            </div>
            
            <button type="submit" className="primary-btn" style={{ marginTop: "0.5rem", width: "100%" }}>Broadcast Secure NPM Release</button>
            
            {pubStatus && (
              <div style={{ marginTop: "1rem", padding: "12px", borderRadius: "6px", fontSize: "0.9rem", background: pubStatus.includes("NXC") || pubStatus.includes("Failed") ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", color: pubStatus.includes("NXC") || pubStatus.includes("Failed") ? "#ef4444" : "#22c55e", border: "1px solid var(--glass-border)" }}>
                {pubStatus}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
