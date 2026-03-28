import Image from "next/image";
import Logo from "../components/Logo";
import ClientImage from "../components/ClientImage";

export default function Home() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", overflow: "hidden" }}>
      
      {/* 1. Massive Hero Block (Similar to Python.org Header) */}
      <section className="animate-fade-in" style={{ padding: "5rem 0", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid var(--glass-border)", marginBottom: "3rem", background: "radial-gradient(ellipse at top, rgba(124, 58, 237, 0.15), transparent 70%)" }}>
        <div style={{ marginBottom: "1.5rem", filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.3))" }}>
          <Logo size={140} />
        </div>
        <h1 className="hero-title" style={{ fontSize: "5rem", marginBottom: "1rem", textAlign: "center", letterSpacing: "-0.03em" }}>NEXO</h1>
        <p style={{ fontSize: "1.4rem", color: "var(--accent-secondary)", textAlign: "center", maxWidth: "700px", marginBottom: "2.5rem", fontWeight: "300", lineHeight: "1.6" }}>
          A natively compiled, purely dynamic scripting architecture built on raw .NET MSIL. Designed for uncompromising speed and global cloud ecosystem integration.
        </p>
        
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/download" className="primary-btn" style={{ textDecoration: "none", fontSize: "1.1rem", padding: "14px 28px", boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" }}>Download Nexo v2.0</a>
          <a href="/docs" className="secondary-btn" style={{ textDecoration: "none", fontSize: "1.1rem", padding: "14px 28px" }}>Get Started (Docs)</a>
        </div>
      </section>

      {/* NEW: Cozmo Robotics Highlight */}
      <section className="animate-fade-in delay-2" style={{ marginTop: "4rem", marginBottom: "6rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "4rem", alignItems: "center", padding: "0 1rem" }}>
        <div className="animate-float" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ClientImage 
            src="/cozmo.png" 
            alt="Cozmo Robot" 
            style={{ width: "380px", filter: "drop-shadow(0 10px 40px rgba(124, 58, 237, 0.4))", mixBlendMode: "lighten" }}
            fallbackSrc="/cozmo.png"
          />
        </div>
        <div>
          <h2 style={{ fontSize: "2.8rem", fontWeight: "900", marginBottom: "1.5rem", background: "linear-gradient(to right, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Robotics Frontier.</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", lineHeight: "1.8", marginBottom: "2.5rem" }}>
            The Anki Cozmo isn't just a toy anymore. With <code style={{color: "#fbbf24", background: "rgba(251, 191, 36, 0.1)", padding: "4px 8px", borderRadius: "6px"}}>nexocore.cozmo</code>, you control hardware natively via MSIL. Direct handshakes, zero latency, pure N# logic.
          </p>
          <a href="/cozmo" className="cozmoBtn">
            Enter the Cozmo Lab
          </a>
        </div>
      </section>

      {/* 2. Interactive Terminal / Quick Start Code (Left: Code, Right: Text) */}
      <section className="animate-fade-in delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "4rem", marginBottom: "5rem", padding: "0 1rem" }}>
        
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ position: "absolute", top: "15px", left: "20px", display: "flex", gap: "8px" }}>
            <div style={{width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444"}}></div>
            <div style={{width: "12px", height: "12px", borderRadius: "50%", background: "#eab308"}}></div>
            <div style={{width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e"}}></div>
          </div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "#a5b4fc", marginTop: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px" }}>hello_world.nexo</h3>
          <pre style={{ color: "#d1d5db", fontFamily: "monospace", fontSize: "1.1rem", lineHeight: "1.6", overflowX: "auto" }}>
            <span style={{ color: "#7c3aed", fontWeight: "bold" }}>using</span> <span style={{ color: "#3b82f6" }}>nexocore.math</span><br/><br/>
            
            <span style={{ color: "#22c55e" }}>{"<3"} Compute native algorithmic damage</span><br/>
            <span style={{ color: "#c678dd" }}>do</span> hit(base, factor) {"{"}<br/>
            {"    "}<span style={{ color: "#c678dd" }}>return</span> base * factor<br/>
            {"}"}<br/><br/>

            result = hit(<span style={{ color: "#ef4444" }}>150</span>, <span style={{ color: "#ef4444" }}>2.5</span>)<br/>
            <span style={{ color: "#eab308" }}>write</span> "Target obliterated. Damage: " + result<br/>
          </pre>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Functions that Flow.</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem", lineHeight: "1.7" }}>
            The Nexo infrastructure strips away restrictive architectural paradigms. Forget specifying 'int', 'string', or 'void'. The JIT Interpreter infers all memory structures instantly, letting you architect code effortlessly. 
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-primary)", fontSize: "1.1rem" }}>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{color: "#a5b4fc", fontSize: "1.2rem"}}>✓</span> Typed-Free Variable Assignments</li>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{color: "#a5b4fc", fontSize: "1.2rem"}}>✓</span> Universal 'do' Logic Subroutines</li>
            <li style={{ marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "10px" }}><span style={{color: "#a5b4fc", fontSize: "1.2rem"}}>✓</span> .NET CLR Hardware Acceleration</li>
          </ul>
        </div>
      </section>

      {/* 3. Four Feature Highlights Grid */}
      <section className="animate-fade-in delay-2" style={{ marginBottom: "6rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", padding: "0 1rem" }}>
        
        <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid #7c3aed" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Raw MSIL Speeds</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Compiling natively invokes the Reflection.Emit .NET engine. Nexo translates your scripts directly into machine `.dll` execution boundaries, outperforming interpreted runtimes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid #3b82f6" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌍</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Cloud NPM Modules</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Nexo has no heavy standard library. Use the `<code style={{color: "#a5b4fc"}}>nexo install</code>` command to pull extensions natively from the Global Vercel Network.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid #eab308" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛡️</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Isolated Threading</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Completely disconnected environment boundaries ensure memory is never cross-contaminated. Subroutines exist securely within their own mapped runtime allocations.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid #ef4444" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💻</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Cross-Platform Native</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Whether you operate on an Intel Windows rig, an Apple Silicon Mac, or a Debian server, the pre-compiled native Nexo binaries bridge immediately via .NET 9.
          </p>
        </div>

      </section>

      {/* 4. Use Nexo Now (NPM Command Line Demo) */}
      <section className="animate-fade-in delay-3" style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "4rem 2rem", border: "1px solid var(--glass-border)", marginBottom: "3rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Deploy the Global Network.</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", marginBottom: "2rem" }}>
          The native .NET CLI manages everything. Compile AOT `.dll` files, execute local JIT scripts via Interpreter, or synchronize extensions from the Cloud effortlessly.
        </p>
        
        <div style={{ background: "#000", padding: "1.5rem 3rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "left", width: "100%", maxWidth: "600px", fontFamily: "monospace", fontSize: "1.1rem" }}>
          <span style={{ color: "#22c55e" }}>$</span> <span style={{ color: "#d1d5db" }}>nexo install custom.network</span><br/>
          <span style={{ color: "#a5b4fc", fontSize: "0.9rem" }}>  [SUCCESS] Module mapped natively to C:\Programs\Nexo\libs</span><br/><br/>
          <span style={{ color: "#22c55e" }}>$</span> <span style={{ color: "#d1d5db" }}>nexo build server.nexo</span><br/>
          <span style={{ color: "#a5b4fc", fontSize: "0.9rem" }}>  [SUCCESS] MSIL Emission completed: server.dll</span>
        </div>
        
        <a href="/registry" className="secondary-btn" style={{ marginTop: "3rem", textDecoration: "none" }}>Explore the NPM Cloud Registry</a>
      </section>

    </div>
  );
}
