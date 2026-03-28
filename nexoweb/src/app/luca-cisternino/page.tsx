import React from "react";
import { Metadata } from "next";
import Logo from "../../components/Logo";

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
    <div style={{ maxWidth: "900px", margin: "4rem auto", padding: "0 1rem" }}>
      {/* Professional Identity Header */}
      <section className="animate-fade-in" style={{ textAlign: "center", marginBottom: "6rem" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: "2.5rem" }}>
          <div className="animate-float" style={{ padding: "8px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", position: "relative", zIndex: 2 }}>
            <img 
              src="https://github.com/FlorentinaSL.png" 
              alt="Luca Cisternino" 
              style={{ width: "220px", height: "220px", borderRadius: "50%", border: "4px solid var(--bg-dark)", objectFit: "cover" }}
            />
          </div>
          <div className="animate-glow" style={{ position: "absolute", top: "10%", left: "10%", right: "10%", bottom: "10%", zIndex: 1, filter: "blur(40px)", borderRadius: "50%", background: "var(--accent-primary)", opacity: 0.3 }}></div>
        </div>
        
        <h1 className="hero-title" style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>Luca Cisternino</h1>
        <p className="animate-fade-in delay-1" style={{ fontSize: "1.4rem", color: "var(--text-muted)", fontWeight: "300", letterSpacing: "1px" }}>
          Architect of the <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>Nexo Programming Language</span>
        </p>
      </section>

      {/* Career & GitHub Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem", marginBottom: "5rem" }}>
        <div className="glass-panel animate-scale delay-2" style={{ padding: "2.5rem" }}>
          <h2 style={{ color: "white", fontSize: "1.8rem", marginBottom: "1.5rem" }}>The Vision</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.8", fontSize: "1.05rem" }}>
            As a developer obsessed with performance and low-level optimization, I founded Nexo (NPL) to bridge the gap between high-level dynamic scripting and the raw power of the .NET Core Runtime.
          </p>
        </div>

        <div className="glass-panel animate-scale delay-3" style={{ padding: "2.5rem" }}>
          <h2 style={{ color: "white", fontSize: "1.8rem", marginBottom: "1.5rem" }}>Core Expertise</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-muted)" }}>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "var(--accent-primary)" }}>●</span> MSIL / IL Emission Architecture</li>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "var(--accent-primary)" }}>●</span> Native Robotics Primitives</li>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "var(--accent-primary)" }}>●</span> JIT Interpreter Optimization</li>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ color: "var(--accent-primary)" }}>●</span> Cloud-Native Infrastructure</li>
          </ul>
        </div>
      </div>

      {/* GitHub Call to Action */}
      <section className="animate-fade-in delay-4" style={{ textAlign: "center", background: "rgba(255,255,255,0.02)", padding: "4rem 2rem", borderRadius: "32px", border: "1px solid var(--glass-border)" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem" }}>Follow the Repository</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.1rem" }}>
          Explore the source of NPL, the standard library, and the robotics bridge directly on GitHub.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <a href="https://github.com/FlorentinaSL" target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: "none", padding: "16px 40px", fontSize: "1.2rem" }}>
            github.com/FlorentinaSL
          </a>
          <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp" target="_blank" rel="noopener noreferrer" className="secondary-btn" style={{ textDecoration: "none", padding: "16px 40px", fontSize: "1.2rem" }}>
            View Nexo Source
          </a>
        </div>
      </section>

      {/* Footer Logo */}
      <div style={{ marginTop: "6rem", textAlign: "center", opacity: 0.3 }}>
        <Logo size={120} />
      </div>
    </div>
  );
}
