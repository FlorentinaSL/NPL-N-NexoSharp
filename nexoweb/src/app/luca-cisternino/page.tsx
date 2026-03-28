import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luca Cisternino | Founder & Architect of Nexo",
  description: "Luca Cisternino is the developer behind the Nexo Programming Language (NPL) and the NexoCloud ecosystem. Expert in MSIL architecture and native C# systems.",
  keywords: ["Luca Cisternino", "Nexo Founder", "NPL Architect", "FlorentinaSL", "Software Engineer", "Robotics Dev"],
  openGraph: {
    title: "Luca Cisternino | Architect of Nexo",
    description: "The official profile of the engineer behind the Nexo ecosystem.",
    images: [{ url: "https://github.com/FlorentinaSL.png" }]
  }
};

export default function OwnerPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem", minHeight: "100vh" }}>

      {/* ── HERO: Sidebar layout (image left, content right) ── */}
      <section className="animate-fade-in" style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "5rem",
        alignItems: "center",
        padding: "6rem 0 5rem",
        borderBottom: "1px solid var(--glass-border)",
        marginBottom: "5rem"
      }}>
        {/* Left: Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              padding: "4px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
            }}>
              <img
                src="https://github.com/FlorentinaSL.png"
                alt="Luca Cisternino"
                style={{ width: "220px", height: "220px", borderRadius: "50%", display: "block", objectFit: "cover" }}
              />
            </div>
            <div style={{
              position: "absolute", inset: "-10px", borderRadius: "50%",
              background: "var(--accent-primary)", filter: "blur(40px)", opacity: 0.25, zIndex: -1
            }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {["N# Author","Robotics Dev","MSIL Expert"].map(tag => (
                <span key={tag} style={{
                  fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1px",
                  color: "var(--accent-primary)", background: "rgba(124,58,237,0.1)",
                  padding: "4px 12px", borderRadius: "100px", border: "1px solid rgba(124,58,237,0.3)"
                }}>{tag}</span>
              ))}
            </div>
          </div>
          <a
            href="https://github.com/FlorentinaSL"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
            style={{ textDecoration: "none", width: "100%", textAlign: "center", padding: "12px 20px" }}
          >
            github.com/FlorentinaSL
          </a>
        </div>

        {/* Right: Info */}
        <div>
          <p style={{ color: "var(--accent-primary)", fontWeight: "700", letterSpacing: "3px", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Architect & Founder
          </p>
          <h1 className="hero-title" style={{ fontSize: "4.5rem", marginBottom: "1rem", lineHeight: 1 }}>
            Luca<br />Cisternino
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", lineHeight: "1.8", maxWidth: "520px", marginBottom: "2rem" }}>
            Developer obsessed with performance and low-level optimization.
            I founded <strong style={{ color: "white" }}>Nexo (NPL)</strong> to bridge the gap between
            high-level dynamic scripting and the raw power of the .NET Core Runtime.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="https://github.com/FlorentinaSL/NPL-N-NexoSharp"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-btn"
              style={{ textDecoration: "none" }}
            >
              View Nexo Source
            </a>
            <a href="/download" className="primary-btn" style={{ textDecoration: "none" }}>
              Download Nexo
            </a>
          </div>
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
        {[
          { icon: "⚙️", title: "MSIL / IL Emission", desc: "Hand-crafted bytecode emission using Reflection.Emit for maximum runtime performance without compiler overhead." },
          { icon: "🤖", title: "Robotics Primitives", desc: "Authored nexocore.cozmo — a native N# library bridging Anki hardware via direct socket handshakes." },
          { icon: "⚡", title: "JIT Interpreter", desc: "Custom two-pass interpreter with ahead-of-time type inference and zero-overhead variable binding." },
          { icon: "☁️", title: "Cloud Infrastructure", desc: "Built the NexoCloud NPM-style registry for global package distribution via Vercel Edge Functions." },
        ].map(item => (
          <div key={item.title} className="glass-panel animate-scale" style={{ padding: "2rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
            <h3 style={{ color: "white", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.75rem" }}>{item.title}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.7" }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── GITHUB CTA ── */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.05))",
        padding: "4rem 2rem",
        borderRadius: "24px",
        border: "1px solid rgba(124,58,237,0.2)",
        marginBottom: "5rem"
      }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>Follow the Repository</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "500px", textAlign: "center", lineHeight: "1.7", marginBottom: "2.5rem" }}>
          Explore the source of NPL, the standard library, and the robotics bridge directly on GitHub.
        </p>
        <a
          href="https://github.com/FlorentinaSL/NPL-N-NexoSharp"
          target="_blank"
          rel="noopener noreferrer"
          className="primary-btn"
          style={{ textDecoration: "none", fontSize: "1.1rem", padding: "16px 40px" }}
        >
          Open on GitHub →
        </a>
      </section>

    </div>
  );
}
