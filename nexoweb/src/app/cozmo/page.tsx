import React from "react";
import ClientImage from "../../components/ClientImage";

export default function CozmoPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>

      {/* ── HERO: Full-bleed, no box, image bleeds into title ── */}
      <section className="animate-fade-in" style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "5rem",
        alignItems: "center",
        padding: "6rem 0 5rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "5rem",
        background: "radial-gradient(ellipse at top, rgba(124, 58, 237, 0.12), transparent 80%)",
        position: "relative"
      }}>
        {/* Left: Robot - floating freely, NO box */}
        <div className="animate-float" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ClientImage
            src="/cozmo.png"
            alt="Anki Cozmo Robot"
            style={{
              width: "100%",
              maxWidth: "420px",
              filter: "drop-shadow(0 20px 60px rgba(124, 58, 237, 0.7)) drop-shadow(0 0 30px rgba(251,191,36,0.15))",
              userSelect: "none",
              mixBlendMode: "screen"
            }}
            fallbackSrc="/cozmo.png"
          />
        </div>

        {/* Right: Copy */}
        <div>
          <p style={{ color: "#fbbf24", fontWeight: "700", letterSpacing: "3px", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "1rem" }}>
            nexocore.cozmo
          </p>
          <h1 className="hero-title" style={{ fontSize: "4.5rem", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            COZMO<br />LAB ®
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "2rem" }}>
            The Anki Cozmo isn't just a toy anymore. With <code style={{ color: "#fbbf24", background: "rgba(251,191,36,0.1)", padding: "2px 8px", borderRadius: "6px" }}>nexocore.cozmo</code>, you control hardware natively via MSIL. Direct handshakes, zero latency, pure N# logic.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="/download" className="primary-btn" style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#000",
              fontWeight: "800",
              boxShadow: "0 10px 30px rgba(251,191,36,0.3)"
            }}>
              Get Cozmo SDK for N# →
            </a>
            <a href="/docs" className="secondary-btn" style={{ textDecoration: "none" }}>
              Read Docs
            </a>
          </div>
        </div>
      </section>

      {/* ── N# vs Python Comparison ── */}
      <section className="animate-fade-in delay-1" style={{ marginBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.8rem", color: "#fff", marginBottom: "1rem" }}>N# vs The Old World</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Why developers are ditching Python SDKs for the power of Nexo.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>
          <div className="glass-panel" style={{ padding: "2.5rem", borderLeft: "4px solid #ef4444" }}>
            <h3 style={{ color: "#ef4444", marginBottom: "1.5rem" }}>Python SDK (Legacy)</h3>
            <pre style={{ fontSize: "0.9rem", color: "#9ca3af", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" }}>
              {`import cozmo
# Heavy boilerplate
def cozmo_program(robot):
  robot.say_text("Hello").wait()
cozmo.run_program(cozmo_program)`}
            </pre>
            <ul style={{ marginTop: "1.5rem", color: "#9ca3af", paddingLeft: "1.2rem", fontSize: "0.95rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Slow interpreted execution</li>
              <li style={{ marginBottom: "0.5rem" }}>Dependency hell (Pip, Py3)</li>
              <li>Heavy memory overhead</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: "2.5rem", borderLeft: "4px solid #22c55e" }}>
            <h3 style={{ color: "#22c55e", marginBottom: "1.5rem" }}>Nexo nexocore.cozmo (Titan)</h3>
            <pre style={{ fontSize: "0.9rem", color: "#61afef", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(34,197,94,0.1)", overflowX: "auto" }}>
              {`using nexocore.cozmo

<3 Direct MSIL execution
cozmo.connect()
cozmo.say("System Online")
cozmo.move(100, 50)`}
            </pre>
            <ul style={{ marginTop: "1.5rem", color: "#9ca3af", paddingLeft: "1.2rem", fontSize: "0.95rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Near-zero latency native logic</li>
              <li style={{ marginBottom: "0.5rem" }}>Compiled .exe distribution</li>
              <li>Native .NET socket management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
        <div className="glass-panel animate-scale delay-3" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
          <h4 style={{ color: "white", marginBottom: "0.5rem" }}>Instant Bridge</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>No more device-side scripts. N# talks directly to the robot hardware registry.</p>
        </div>
        <div className="glass-panel animate-scale delay-4" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🧠</div>
          <h4 style={{ color: "white", marginBottom: "0.5rem" }}>AI Integration</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Link <code style={{ color: "#a5b4fc" }}>nexocore.ai</code> to give Cozmo advanced vision and speech logic.</p>
        </div>
        <div className="glass-panel animate-scale delay-5" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
          <h4 style={{ color: "white", marginBottom: "0.5rem" }}>Thread Safety</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Natively managed memory ensures robot commands never crash in production.</p>
        </div>
      </div>
    </div>
  );
}
