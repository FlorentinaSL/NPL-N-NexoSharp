import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexo Programming Language",
  description: "Enterprise-grade typed-free dynamic scripting ecosystem globally connected via NPM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
        <div className="ambient-glow"></div>
        
        {/* Global Navigation */}
        <nav className="animate-fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <a href="/" style={{ fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "-1px", textDecoration: "none", color: "var(--text-primary)" }}>NEXO</a>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "500" }}>
            <a href="/docs" className="nav-link">Docs</a>
            <a href="/registry" className="nav-link">NPM Registry</a>
            <a href="https://github.com/FlorentinaSL/NPL-N-NexoSharp" target="_blank" rel="noopener noreferrer" style={{ color: "#a5b4fc", textDecoration: "none" }}>GitHub</a>
          </div>
        </nav>

        <main style={{ flex: 1, padding: "0 2rem", paddingBottom: "5rem" }}>
          {children}
        </main>

        {/* Global Massive Footer */}
        <footer style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", padding: "4rem 2rem", textAlign: "center", background: "rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginBottom: "3rem", color: "var(--text-muted)", fontWeight: "500", flexWrap: "wrap" }}>
             <a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a>
             <a href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Documentation</a>
             <a href="/registry" style={{ color: "inherit", textDecoration: "none" }}>Global Registry</a>
             <a href="/NexoSetup.exe" download style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: "600" }}>Download V1.0.0</a>
          </div>
          <h1 style={{ fontSize: "clamp(100px, 18vw, 250px)", fontWeight: "900", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.02)", margin: 0, lineHeight: 0.8, userSelect: "none" }}>NEXO</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>© 2026 Luca Cisternino & FlorentinaSL. All rights reserved globally.</p>
        </footer>
      </body>
    </html>
  );
}
