import React from "react";

export default function Docs() {
  return (
    <div className="animate-fade-in delay-1" style={{ maxWidth: "800px", margin: "4rem auto", lineHeight: "1.7" }}>
      <h1 className="hero-title" style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>Documentation.</h1>
      <p style={{ color: "var(--accent-secondary)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "3rem" }}>Learning the Rules of Nexo Programming Language (N#)</p>

      {/* Philosophy Section */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>Core Philosophy</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1rem" }}>
          Nexo (N#) is a dynamically-typed, C-style syntax language designed for extreme simplicity and native Windows execution. There are no rigid variable types; the memory architecture infers everything dynamically at runtime before converting your logic to raw MSIL operations.
        </p>
      </section>

      {/* Syntax Guides */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>Memory Allocation</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Declaring variables drops the unnecessary type keywords. Just assign data directly to memory.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          x = 10<br/>
          y = "Hello World!"<br/>
          active = 1 <span style={{ color: "#22c55e" }}># 1 evaluating as true</span><br/>
        </pre>
      </section>

      {/* Loops */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>Arrays & Loops</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Dynamic lists are handled via raw array mappings. Iterate efficiently using <code style={{color: "#c678dd"}}>foreach</code>.
        </p>
        <pre className="glass-panel" style={{ padding: "1.5rem", color: "#d1d5db", fontFamily: "monospace", overflowX: "auto" }}>
          <span style={{ color: "#c678dd" }}>using</span> <span style={{ color: "#61afef" }}>nexocore.io</span><br/><br/>
          players = [100, 200, 300]<br/>
          players[1] = 999 <span style={{ color: "#22c55e" }}># Index manipulation</span><br/><br/>
          <span style={{ color: "#c678dd" }}>foreach</span> item <span style={{ color: "#c678dd" }}>in</span> players {"{"}<br/>
          {"    "}<span style={{ color: "#e5c07b" }}>write</span> item<br/>
          {"}"}
        </pre>
      </section>

      {/* Modular NPM Ecosystem */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#a5b4fc", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>Ecosystem & NPM</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Nexo explicitly prohibits bundled local standard libraries. To import modules, you must query the Global Vercel Network using the <code style={{color: "#eab308"}}>nexo install</code> command inside your computer's terminal.
        </p>
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "1.5rem", borderRadius: "8px", color: "var(--text-primary)" }}>
            <h4 style={{ color: "#ef4444", marginBottom: "0.5rem", fontSize: "1.1rem" }}>⚠️ Important Directive</h4>
            <p style={{ fontSize: "0.95rem" }}>If a library like <code style={{color: "#eab308"}}>nexocore.math</code> is NOT installed via NPM globally, compiling scripts referencing it will trigger a fatal Linker MSIL abort sequence.</p>
        </div>
      </section>
      
    </div>
  );
}
