import React from "react";
import Logo from "../../components/Logo";
import ClientImage from "../../components/ClientImage";

export default function CozmoPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "4rem auto", padding: "0 1rem" }}>
      {/* Hero Section */}
      <section className="animate-fade-in" style={{ textAlign: "center", marginBottom: "6rem", position: "relative" }}>
        <div className="animate-float" style={{ marginBottom: "-1rem", display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <ClientImage 
            src="/cozmo.png" 
            alt="Anki Cozmo Robot" 
            style={{ width: "360px", filter: "drop-shadow(0 30px 60px rgba(124, 58, 237, 0.4))", userSelect: "none" }}
            fallbackSrc="/cozmo.png"
          />
        </div>
        <div className="glass-panel" style={{ padding: "6rem 2rem 4rem", marginTop: "-4rem", position: "relative", zIndex: 1, border: "1px solid rgba(255,255,255,0.05)" }}>
          <h1 className="hero-title" style={{ fontSize: "6.5rem", marginBottom: "0.5rem", filter: "drop-shadow(0 0 30px rgba(124,58,237,0.3))" }}>COZMO LAB &reg;</h1>
          <p className="animate-fade-in delay-1" style={{ color: "var(--accent-secondary)", fontSize: "1.6rem", fontWeight: "800", letterSpacing: "4px", textTransform: "uppercase", opacity: 0.8 }}>
            Direct Robotics Control via N# Native 2.1
          </p>
        </div>
      </section>

      {/* Contrast Section */}
      <section className="animate-fade-in delay-2" style={{ marginBottom: "6rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.8rem", color: "#fff", marginBottom: "1rem" }}>N# vs The Old World</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Why developers are ditching Python SDKs for the power of Nexo.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>
          <div className="glass-panel" style={{ padding: "2.5rem", borderLeft: "4px solid #ef4444", background: "rgba(239, 68, 68, 0.02)" }}>
            <h3 style={{ color: "#ef4444", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Python SDK (Legacy)
            </h3>
            <pre style={{ fontSize: "0.9rem", color: "#9ca3af", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              import cozmo<br/>
              <span style={{ color: "#6b7280" }}># Heavy boilerplate</span><br/>
              def cozmo_program(robot):<br/>
              {"  "}robot.say_text(&quot;Hello&quot;).wait()<br/>
              cozmo.run_program(cozmo_program)
            </pre>
            <ul style={{ marginTop: "1.5rem", color: "#9ca3af", paddingLeft: "1.2rem", fontSize: "0.95rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Slow interpreted execution</li>
              <li style={{ marginBottom: "0.5rem" }}>Dependency hell (Pip, Py3)</li>
              <li>Heavy memory overhead</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: "2.5rem", borderLeft: "4px solid #22c55e", background: "rgba(34, 197, 94, 0.02)" }}>
            <h3 style={{ color: "#22c55e", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Nexo nexocore.cozmo (Titan)
            </h3>
            <pre style={{ fontSize: "0.9rem", color: "#61afef", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(34, 197, 94, 0.1)" }}>
              using nexocore.cozmo<br/><br/>
              <span style={{ color: "#22c55e" }}>// Direct MSIL execution</span><br/>
              cozmo.connect()<br/>
              cozmo.say(&quot;System Online&quot;)<br/>
              cozmo.move(100, 50)
            </pre>
            <ul style={{ marginTop: "1.5rem", color: "#9ca3af", paddingLeft: "1.2rem", fontSize: "0.95rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Near-zero latency native logic</li>
              <li style={{ marginBottom: "0.5rem" }}>Compiled .exe distribution</li>
              <li>Native .NET socket management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
        <div className="glass-panel animate-scale delay-3" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
          <h4 style={{ color: "white", marginBottom: "0.5rem" }}>Instant Bridge</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>No more device-side scripts. N# talks directly to the robot hardware registry.</p>
        </div>
        <div className="glass-panel animate-scale delay-4" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🧠</div>
          <h4 style={{ color: "white", marginBottom: "0.5rem" }}>AI Integration</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Link <code style={{color: "#a5b4fc"}}>nexocore.ai</code> to give Cozmo advanced vision and speech logic.</p>
        </div>
        <div className="glass-panel animate-scale delay-5" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
          <h4 style={{ color: "white", marginBottom: "0.5rem" }}>Thread Safety</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Natively managed memory ensures robot commands never crash in production.</p>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button className="primary-btn" style={{ padding: "1.5rem 4rem", fontSize: "1.2rem" }}>
          Get Cozmo SDK for N#
        </button>
      </div>
    </div>
  );
}
