import React from "react";
import Logo from "../../components/Logo";

export default function Docs() {
  return (
    <div style={{ maxWidth: "800px", margin: "4rem auto", lineHeight: "1.7", paddingBottom: "4rem" }}>
      <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: "4rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginBottom: "1.5rem" }}><Logo size={100} /></div>
        <h1 className="hero-title" style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>NEXO DOCS</h1>
        <p style={{ color: "var(--accent-secondary)", fontSize: "1.3rem", fontWeight: "600" }}>The Official Blueprint of the N# Ecosystem</p>
      </div>

      {/* 1. Philosophy */}
      <section className="animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>1. Architectural Core</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1rem" }}>
          Nexo (N#) executes a dynamic, untyped C-style architecture mapping directly to MSIL instructions via .NET. There are no static types. Everything is inferred, isolated, and highly optimized for enterprise networking and speed.
        </p>
      </section>

      {/* 2. Variables */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>2. Memory Allocation & Variables</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Drop the <code style={{color: "#eab308"}}>var</code> or <code style={{color: "#eab308"}}>int</code> keywords. Simply assign a value to a label, and the native memory allocator will handle the mapping instantly.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          <span style={{ color: "#22c55e" }}>{"<3"} Integers, Floats, and Strings</span><br/>
          health = 100<br/>
          damage = 25.5<br/>
          playerName = "Florentina"<br/><br/>
          <span style={{ color: "#22c55e" }}>{"<3"} Booleans (1 = True, 0 = False)</span><br/>
          isActive = 1<br/><br/>
          <span style={{ color: "#22c55e" }}>{"<3"} Re-assignment changes types dynamically</span><br/>
          health = "God Mode"<br/>
        </pre>
      </section>

      {/* 3. Terminal Output */}
      <section className="animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>3. I/O Broadcasts</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Sending data to the terminal buffer natively is universally governed strictly by the <code style={{color: "#c678dd"}}>write</code> keyword.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          <span style={{ color: "#e5c07b" }}>write</span> "Initiating Nexo Sequence..." <span style={{ color: "#22c55e" }}>{"<3"} Prints the literal string buffer</span><br/><br/>
          
          <span style={{ color: "#22c55e" }}>{"<3"} Seamless string and dynamic concatenation is natively supported</span><br/>
          score = 999<br/>
          <span style={{ color: "#e5c07b" }}>write</span> "Final Score: " + score<br/>
        </pre>
      </section>

      {/* 4. Logic & Control Flow */}
      <section className="animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>4. Control Flow (If / Else)</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Nexo evaluates standard logical comparisons (<code style={{color: "#a5b4fc"}}>==</code>, <code style={{color: "#a5b4fc"}}>&gt;</code>, <code style={{color: "#a5b4fc"}}>&lt;=</code>, <code style={{color: "#a5b4fc"}}>!=</code>) inside structural blocks.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          power = 50<br/><br/>
          <span style={{ color: "#c678dd" }}>if</span> power {">"} 100 {"{"}<br/>
          {"    "}<span style={{ color: "#e5c07b" }}>write</span> "Overcharged!"<br/>
          {"}"} <span style={{ color: "#c678dd" }}>else if</span> power {"=="} 50 {"{"}<br/>
          {"    "}<span style={{ color: "#e5c07b" }}>write</span> "Optimal capacity."<br/>
          {"}"} <span style={{ color: "#c678dd" }}>else</span> {"{"}<br/>
          {"    "}<span style={{ color: "#e5c07b" }}>write</span> "Warning: Low Power."<br/>
          {"}"}<br/>
        </pre>
      </section>

      {/* 5. Functions */}
      <section className="animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>5. Action Subroutines (Functions)</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Define reusable logic blocks using the exact semantic <code style={{color: "#c678dd"}}>do</code> keyword. Functions natively support recursion and isolated scoping limits.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          <span style={{ color: "#c678dd" }}>do</span> calculateDamage(base, multiplier) {"{"}<br/>
          {"    "}total = base * multiplier<br/>
          {"    "}<span style={{ color: "#c678dd" }}>return</span> total<br/>
          {"}"}<br/><br/>
          
          hit = calculateDamage(50, 2.5)<br/>
          <span style={{ color: "#e5c07b" }}>write</span> "Crit! Damage done: " + hit<br/>
        </pre>
      </section>

      {/* 6. Loops */}
      <section className="animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>6. Arrays & Iteration Sequences</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Map multiple states into single structures using Arrays. Nexo provides <code style={{color: "#c678dd"}}>foreach</code> and <code style={{color: "#c678dd"}}>while</code> to shred through list bounds efficiently.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          servers = ["Auth", "Database", "Matchmaking"]<br/><br/>
          
          <span style={{ color: "#22c55e" }}>{"<3"} The Foreach Array Iterator</span><br/>
          <span style={{ color: "#c678dd" }}>foreach</span> target <span style={{ color: "#c678dd" }}>in</span> servers {"{"}<br/>
          {"    "}<span style={{ color: "#e5c07b" }}>write</span> "Pinging " + target + "..."<br/>
          {"}"}<br/><br/>

          <span style={{ color: "#22c55e" }}>{"<3"} The Traditional While Loop</span><br/>
          hp = 3<br/>
          <span style={{ color: "#c678dd" }}>while</span> hp {">"} 0 {"{"}<br/>
          {"    "}<span style={{ color: "#e5c07b" }}>write</span> "Taking Damage..."<br/>
          {"    "}hp = hp - 1<br/>
          {"}"}<br/>
        </pre>
      </section>

      {/* 7. NPM Cloud */}
      <section className="animate-fade-in" style={{ animationDelay: "700ms", animationFillMode: "both", marginBottom: "5rem" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>7. NPM Ecosystem (Cloud Registry)</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Nexo intentionally limits native runtime libraries inside the core engine. To access advanced logic, you must actively <code style={{color: "#eab308"}}>using</code> external modules. If they are not present, acquire them globally from the Vercel Edge.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto", borderLeft: "4px solid #7c3aed" }}>
          <span style={{ color: "#22c55e" }}>{"<3"} --- EXECUTED ON THE TERMINAL ---</span><br/>
          <span style={{ color: "#a5b4fc" }}>$</span> nexo install nexocore.math<br/>
          <span style={{ color: "#a5b4fc" }}>$</span> nexo install custom.networking<br/><br/>

          <span style={{ color: "#22c55e" }}>{"<3"} --- INSIDE YOUR SCRIPT ---</span><br/>
          <span style={{ color: "#c678dd" }}>using</span> <span style={{ color: "#61afef" }}>nexocore.math</span><br/>
          <span style={{ color: "#c678dd" }}>using</span> <span style={{ color: "#61afef" }}>custom.networking</span><br/><br/>
          
          <span style={{ color: "#e5c07b" }}>write</span> "All modules loaded perfectly."<br/>
        </pre>
      </section>

      {/* 8. Compiler Commands */}
      <section className="animate-fade-in" style={{ animationDelay: "800ms", animationFillMode: "both" }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>8. CLI Compilation Toolkit</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          The <code style={{color: "#eab308"}}>nexo</code> Native CLI is an incredibly powerful architectural weapon. It manages JIT execution, native byte-building, and cloud synchronizations.
        </p>
        <div className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          <div style={{ marginBottom: "1rem" }}><strong style={{ color: "#eab308" }}>nexo open script.nexo</strong><br/>Executes the N# script directly in fast-memory via the built-in Interpreter (JIT).</div>
          <div style={{ marginBottom: "1rem" }}><strong style={{ color: "#eab308" }}>nexo build script.nexo</strong><br/>Transpiles and compiles your N# file natively into an impenetrable MSIL <code style={{color: "#61afef"}}>.dll</code> executable (AOT).</div>
          <div style={{ marginBottom: "1rem" }}><strong style={{ color: "#eab308" }}>nexo run script.dll</strong><br/>Forces the CLR to immediately load and execute a compiled <code style={{color: "#61afef"}}>.dll</code> bytepack.</div>
          <div style={{ marginBottom: "1rem" }}><strong style={{ color: "#eab308" }}>nexo install [package]</strong><br/>Pulls raw N# source codes from the global API Registry into <code style={{color: "#61afef"}}>C:\Programs\Nexo\libs</code>.</div>
          <div><strong style={{ color: "#eab308" }}>nexo publish [pkg] [file] [key]</strong><br/>Authenticates and uploads your N# file straight to the Global Cloud Registry via Cryptographic Bearer keys.</div>
        </div>
      </section>
      
    </div>
  );
}
