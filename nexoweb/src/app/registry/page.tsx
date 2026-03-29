"use client";
import React, { useState, useEffect } from "react";
import Logo from "../../components/Logo";

interface NexoPackage {
  name: string;
  version: string;
  author: string;
  description: string;
  category: string;
  icon: string;
  timestamp: string;
}

export default function Registry() {
  const [packages, setPackages] = useState<NexoPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<NexoPackage[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [pubName, setPubName] = useState("");
  const [pubCode, setPubCode] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [pubStatus, setPubStatus] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/registry");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPackages(data);
        setFilteredPackages(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(search.toLowerCase()) || 
      pkg.description.toLowerCase().includes(search.toLowerCase())
    );
    if (activeCategory !== "all") {
      filtered = filtered.filter(pkg => pkg.category === activeCategory);
    }
    setFilteredPackages(filtered);
  }, [search, activeCategory, packages]);

  const categories = ["all", ...Array.from(new Set(packages.map(p => p.category)))];

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
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "4rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
         <Logo size={80} />
         <h1 className="hero-title" style={{ fontSize: "3.5rem", textAlign: "center", marginBottom: "0.5rem" }}>Global NPM Registry</h1>
         <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", textAlign: "center", maxWidth: "600px" }}>
           Discover official and community N# packages. Fully detached from native core bounds.
         </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem", alignItems: "start" }}>
        
        {/* Package Explorer */}
        <div>
          <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <input 
              type="text" 
              placeholder="Search packages..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: "250px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "white", padding: "12px 20px", borderRadius: "100px", outline: "none" }}
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "1px solid var(--glass-border)",
                    background: activeCategory === cat ? "var(--accent-primary)" : "rgba(255,255,255,0.05)",
                    color: activeCategory === cat ? "white" : "var(--text-muted)",
                    transition: "all 0.2s"
                  }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            {filteredPackages.map(pkg => (
              <div key={pkg.name} className="glass-panel animate-scale" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "start" }}>
                <div style={{ fontSize: "2.5rem", background: "rgba(124, 58, 237, 0.1)", width: "80px", height: "80px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {pkg.icon || "📦"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                        {pkg.name}
                        <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>v{pkg.version}</span>
                      </h3>
                      <p style={{ color: "var(--accent-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>by {pkg.author}</p>
                    </div>
                    <code style={{ background: "rgba(0,0,0,0.3)", padding: "10px 16px", borderRadius: "8px", fontSize: "0.9rem", color: "#98c379", border: "1px solid rgba(152, 195, 121, 0.2)" }}>
                      nexo install {pkg.name}
                    </code>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>{pkg.description}</p>
                </div>
              </div>
            ))}
            {filteredPackages.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", border: "2px dashed var(--glass-border)", borderRadius: "24px" }}>
                No packages found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Publish & Info */}
        <div style={{ position: "sticky", top: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "#a5b4fc" }}>Publish Package</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Extend Nexo's architectural boundaries directly to the Cloud database.</p>
            
            <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <input 
                type="text" 
                value={pubName}
                onChange={(e) => setPubName(e.target.value)}
                placeholder="Package Name (e.g. system.io)" 
                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "white", padding: "12px", borderRadius: "8px", outline: "none" }}
                required
              />
              <textarea 
                value={pubCode}
                onChange={(e) => setPubCode(e.target.value)}
                placeholder="Raw N# Source Code..." 
                style={{ width: "100%", height: "120px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "#d1d5db", padding: "12px", borderRadius: "8px", outline: "none", fontFamily: "monospace", resize: "vertical" }}
                required
              />
              <input 
                type="password" 
                value={pubKey}
                onChange={(e) => setPubKey(e.target.value)}
                placeholder="V3 API Key" 
                style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--glass-border)", color: "white", padding: "12px", borderRadius: "8px", outline: "none" }}
                required
              />
              <button type="submit" className="primary-btn" style={{ width: "100%", padding: "12px" }}>Broadcast Release</button>
              
              {pubStatus && (
                <p style={{ 
                  marginTop: "0.5rem", fontSize: "0.85rem", 
                  color: pubStatus.includes("Success") ? "#22c55e" : "#ef4444" 
                }}>{pubStatus}</p>
              )}
            </form>
          </div>

          <div className="glass-panel" style={{ padding: "2rem", background: "linear-gradient(135deg, rgba(124,58,237,0.1), transparent)" }}>
            <h4 style={{ color: "white", marginBottom: "0.75rem" }}>Registry Protocol</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              All packages are served via the decentralized Nexo Cloud API. The N# CLI uses secure handshakes to fetch, verify, and write modules to your local `/Libs` directory automatically.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
