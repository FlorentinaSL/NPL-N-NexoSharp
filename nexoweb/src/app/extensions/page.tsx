import React from "react";
import Logo from "../../components/Logo";

export default function ExtensionsPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>
      
      {/* ── HERO ── */}
      <section className="animate-fade-in" style={{
        textAlign: "center",
        padding: "6rem 0 5rem",
        background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.1), transparent 70%)",
        marginBottom: "4rem"
      }}>
        <div style={{ marginBottom: "2rem", display: "inline-block" }}>
          <Logo size={120} />
        </div>
        <h1 className="hero-title" style={{ fontSize: "4.5rem", marginBottom: "1.5rem" }}>
          IDE EXTENSIONS
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto 3rem", lineHeight: "1.8" }}>
          Elevate your development workflow with professional-grade language support. Engineered strictly for the JetBrains ecosystem.
        </p>
        
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <a 
            href="https://plugins.jetbrains.com/plugin/30912-nexo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="primary-btn"
            style={{ textDecoration: "none", background: "#7c3aed", padding: "16px 32px", fontSize: "1.1rem" }}
          >
            Install from Marketplace →
          </a>
        </div>
      </section>

      {/* ── JETBRAINS LOGO / RECOGNITION ── */}
      <div style={{ textAlign: "center", marginBottom: "6rem", opacity: 0.7 }}>
        <p style={{ fontSize: "0.8rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent-secondary)", marginBottom: "1.5rem" }}>
          Official Support For
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", filter: "grayscale(1) brightness(2)" }}>
          <img src="https://resources.jetbrains.com/storage/products/intellij-idea/img/meta/intellij-idea_logo_300x300.png" alt="IntelliJ" style={{ height: "40px" }} />
          <img src="https://resources.jetbrains.com/storage/products/rider/img/meta/rider_logo_300x300.png" alt="Rider" style={{ height: "40px" }} />
          <img src="https://resources.jetbrains.com/storage/products/clion/img/meta/clion_logo_300x300.png" alt="CLion" style={{ height: "40px" }} />
        </div>
      </div>

      {/* ── FEATURE GRID ── */}
      <section style={{ marginBottom: "8rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
          
          <div className="glass-panel animate-scale" style={{ padding: "2.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>✨</div>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>Syntax Highlighting</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7", fontSize: "0.95rem" }}>
              A hand-crafted lexer that provides deep, semantic highlighting for Nexo keywords, literals, and standard library modules.
            </p>
          </div>

          <div className="glass-panel animate-scale" style={{ padding: "2.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>🧠</div>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>Intelligent Completion</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Context-aware auto-completion for variables, custom functions, and the entire `nexocore` cloud registry.
            </p>
          </div>

          <div className="glass-panel animate-scale" style={{ padding: "2.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>⚡</div>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>Run Configurations</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Execute N# scripts directly from your IDE with zero configuration. Supports JIT (Open) and Native (Build) workflows.
            </p>
          </div>

          <div className="glass-panel animate-scale" style={{ padding: "2.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>📁</div>
            <h3 style={{ color: "white", marginBottom: "1rem" }}>File Templates</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7", fontSize: "0.95rem" }}>
              Instantly scaffold new .nexo projects and library modules with professional boilerplate.
            </p>
          </div>

        </div>
      </section>

      {/* ── PREVIEW SECTION ── */}
      <section style={{ 
        marginBottom: "8rem", 
        background: "rgba(124, 58, 237, 0.05)", 
        borderRadius: "32px", 
        padding: "4rem", 
        border: "1px solid var(--glass-border)",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Designed for Clarity.</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 4rem", lineHeight: "1.8" }}>
          NPL support for JetBrains IDEs is built on the same architecture as the compiler itself, ensuring that what you see in the IDE is what executes on the native MSIL bridge.
        </p>
        <div className="glass-panel" style={{ padding: "1rem", overflow: "hidden", borderRadius: "16px" }}>
           <pre style={{ textAlign: "left", fontSize: "0.9rem", color: "#d1d5db", fontFamily: "monospace", margin: 0 }}>
             <span style={{ color: "#c678dd" }}>using</span> <span style={{ color: "#61afef" }}>nexocore.math</span><br/><br/>
             <span style={{ color: "#22c55e" }}>// IDE provides completion for Math subroutines</span><br/>
             result = math.pow(2, 8)<br/>
             <span style={{ color: "#e5c07b" }}>write</span> <span style={{ color: "#98c379" }}>"Calculated: "</span> + result
           </pre>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ textAlign: "center", marginBottom: "8rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Ready to build?</h2>
        <a 
          href="https://plugins.jetbrains.com/plugin/30912-nexo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="secondary-btn"
          style={{ textDecoration: "none", fontSize: "1rem" }}
        >
          View on Marketplace
        </a>
      </section>

    </div>
  );
}
