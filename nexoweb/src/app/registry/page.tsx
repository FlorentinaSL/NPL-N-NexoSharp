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
  const [activeTab, setActiveTab] = useState<"all" | "official" | "community">("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const [pubName, setPubName] = useState("");
  const [pubCode, setPubCode] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [pubStatus, setPubStatus] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/v1/registry");
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
    
    // Tab Filtering
    if (activeTab === "official") {
      filtered = filtered.filter(pkg => pkg.name.startsWith("nexocore."));
    } else if (activeTab === "community") {
      filtered = filtered.filter(pkg => !pkg.name.startsWith("nexocore."));
    }

    // Category Filtering
    if (activeCategory !== "all") {
      filtered = filtered.filter(pkg => pkg.category === activeCategory);
    }
    
    setFilteredPackages(filtered);
  }, [search, activeCategory, activeTab, packages]);

  const categories = ["all", ...Array.from(new Set(packages.map(p => p.category)))];

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPubStatus("Authenticating v3 release handshake...");
    try {
      const res = await fetch("/api/v1/registry", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pubKey}`
        },
        body: JSON.stringify({ name: pubName, code: pubCode })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPubStatus(`Success! '${pubName}' is now live on the v1 Registry.`);
      setPubName("");
      setPubCode("");
      fetchPackages(); 
    } catch(e: any) {
      setPubStatus(e.message || "Deployment rejection.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "4rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "3rem" }}>
         <Logo size={80} />
         <h1 className="hero-title" style={{ fontSize: "4rem", textAlign: "center", marginBottom: "0.75rem", letterSpacing: "-1px" }}>Universal Registry.</h1>
         <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", textAlign: "center", maxWidth: "700px", lineHeight: "1.6" }}>
           The decentralized backbone of the Nexo ecosystem. Discover official core primitives and community-driven modules.
         </p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "4rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--accent-primary)" }}>{packages.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Modules</div>
        </div>
        <div style={{ width: "1px", background: "var(--glass-border)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>100%</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Uptime</div>
        </div>
        <div style={{ width: "1px", background: "var(--glass-border)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>v3.0</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Engine</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "4rem", alignItems: "start" }}>
        
        {/* Package Explorer */}
        <div>
          {/* Main Controls */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <input 
                type="text" 
                placeholder="Search the global index..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, background: "rgba(0,0,0,0.6)", border: "1px solid var(--glass-border)", color: "white", padding: "16px 24px", borderRadius: "16px", outline: "none", fontSize: "1.1rem" }}
              />
            </div>

            {/* Tabs & Categories */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
               <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                  {(["all", "official", "community"] as const).map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "8px 20px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", border: "none",
                        background: activeTab === tab ? "rgba(124, 58, 237, 0.2)" : "transparent",
                        color: activeTab === tab ? "var(--accent-primary)" : "var(--text-muted)",
                        transition: "all 0.2s"
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
               </div>

               <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "5px" }}>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: "6px 14px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "500", cursor: "pointer",
                        border: "1px solid var(--glass-border)",
                        background: activeCategory === cat ? "white" : "transparent",
                        color: activeCategory === cat ? "black" : "var(--text-muted)",
                        transition: "all 0.2s", whiteSpace: "nowrap"
                      }}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            {filteredPackages.map(pkg => (
              <div key={pkg.name} className="glass-panel animate-scale" style={{ padding: "2rem", display: "flex", gap: "2rem", alignItems: "start", border: pkg.name.startsWith("nexocore.") ? "1px solid rgba(124,58,237,0.3)" : "1px solid var(--glass-border)" }}>
                <div style={{ 
                  fontSize: "2.8rem", 
                  background: pkg.name.startsWith("nexocore.") ? "linear-gradient(135deg, rgba(124, 58, 237, 0.2), transparent)" : "rgba(255,255,255,0.03)", 
                  width: "90px", height: "90px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: pkg.name.startsWith("nexocore.") ? "0 0 20px rgba(124, 58, 237, 0.1)" : "none"
                }}>
                  {pkg.icon || "📦"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "12px", letterSpacing: "-0.5px" }}>
                        {pkg.name}
                        {pkg.name.startsWith("nexocore.") && (
                          <span title="Official Nexo Core Library" style={{ cursor: "help", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                          </span>
                        )}
                        <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", color: "var(--text-muted)", fontWeight: "500" }}>v{pkg.version}</span>
                      </h3>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "4px" }}>
                         <p style={{ color: "var(--accent-secondary)", fontSize: "0.9rem", fontWeight: "600" }}>{pkg.author}</p>
                         <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>•</span>
                         <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "capitalize" }}>{pkg.category}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                       <code style={{ background: "rgba(0,0,0,0.4)", padding: "10px 18px", borderRadius: "10px", fontSize: "0.85rem", color: "#a3e635", border: "1px solid rgba(163, 230, 21, 0.2)", fontFamily: "'Fira Code', monospace" }}>
                         nexo install {pkg.name}
                       </code>
                    </div>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: "1.7", maxWidth: "600px" }}>{pkg.description}</p>
                </div>
              </div>
            ))}
            {filteredPackages.length === 0 && (
              <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", border: "2px dashed var(--glass-border)", borderRadius: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "3rem" }}>🛰️</span>
                <div>
                  <h3 style={{ fontSize: "1.2rem", color: "white" }}>No modules found</h3>
                  <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>The orbital sensors couldn't locate any packages matching your search.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="glass-panel" style={{ padding: "2.5rem", background: "linear-gradient(180deg, rgba(124,58,237,0.05), transparent)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <h3 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "0.75rem", color: "white", letterSpacing: "-0.5px" }}>Broadcast Code.</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: "1.5" }}>Publish your native N# modules to the Orion Bridge for global availability.</p>
            
            <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", paddingLeft: "4px" }}>Namespace</label>
                <input 
                  type="text" 
                  value={pubName}
                  onChange={(e) => setPubName(e.target.value)}
                  placeholder="e.g. math.matrix" 
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid var(--glass-border)", color: "white", padding: "14px", borderRadius: "12px", outline: "none" }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", paddingLeft: "4px" }}>Source Code</label>
                <textarea 
                  value={pubCode}
                  onChange={(e) => setPubCode(e.target.value)}
                  placeholder="do main() { ... }" 
                  style={{ width: "100%", height: "160px", background: "rgba(0,0,0,0.6)", border: "1px solid var(--glass-border)", color: "#a5b4fc", padding: "14px", borderRadius: "12px", outline: "none", fontFamily: "'Fira Code', monospace", fontSize: "0.85rem", resize: "none" }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", paddingLeft: "4px" }}>Auth Token</label>
                <input 
                  type="password" 
                  value={pubKey}
                  onChange={(e) => setPubKey(e.target.value)}
                  placeholder="V3 API Access Key" 
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid var(--glass-border)", color: "white", padding: "14px", borderRadius: "12px", outline: "none" }}
                  required
                />
              </div>

              <button type="submit" className="primary-btn" style={{ width: "100%", padding: "16px", fontWeight: "700", marginTop: "0.5rem" }}>Broadcast Release</button>
              
              {pubStatus && (
                <div style={{ 
                  marginTop: "1rem", padding: "12px", borderRadius: "10px", fontSize: "0.85rem",
                  background: pubStatus.includes("Success") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: pubStatus.includes("Success") ? "#4ade80" : "#f87171",
                  border: pubStatus.includes("Success") ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)"
                }}>
                  {pubStatus}
                </div>
              )}
            </form>
          </div>

          <div className="glass-panel" style={{ padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
            <h4 style={{ color: "white", marginBottom: "0.75rem", fontSize: "1.1rem" }}>Architectural Safety</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              The NPM Registry operates on a strictly non-executable payload basis. The CLI downloads source code and compiles it locally, ensuring absolutely zero remote code execution risks on your host architecture.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
