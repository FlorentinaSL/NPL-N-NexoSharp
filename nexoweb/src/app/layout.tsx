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
  title: "Nexo Programming Language | Official Hub",
  description: "The future of dynamic scripting. Nexo (NPL) is an enterprise-grade typed-free language natively compiled to MSIL logic, interconnected globally via the NPM Cloud Registry.",
  keywords: ["Nexo", "NPL", "Nexo Programming Language", "N#", "FlorentinaSL", "Luca Cisternino", "Dynamic Scripting", "MSIL", "C# Compiler", "NPM Registry"],
  authors: [{ name: "Florentina Spicco D'aura" }],
  creator: "Florentina Spicco D'aura",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexosharp.vercel.app/",
    title: "Nexo Programming Language | N#",
    description: "The typed-free dynamic scripting ecosystem compiled to MSIL.",
    siteName: "Nexo Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexo Programming Language",
    description: "Future of Dynamic Scripting.",
  },
  verification: {
    google: "rOL8c0gUlu2cXLM5zUm4XEYnpBzPYp3PALhV_EvpDjs",
  },
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
        <footer style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", padding: "6rem 2rem", textAlign: "center", background: "rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginBottom: "4rem", color: "var(--text-muted)", fontWeight: "500", flexWrap: "wrap", zIndex: 10 }}>
             <a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a>
             <a href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Documentation</a>
             <a href="/registry" style={{ color: "inherit", textDecoration: "none" }}>Global Registry</a>
             <a href="/download" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: "600" }}>Download Native</a>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "500ms", position: "relative", marginBottom: "-40px", zIndex: 1 }}>
            {/* The Huge Official Nexo SVG Custom Logo */}
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 40px rgba(124, 58, 237, 0.4))" }}>
              <path d="M120 20L210 70V170L120 220L30 170V70L120 20Z" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <path d="M120 40L190 80V160L120 200L50 160V80L120 40Z" fill="url(#grad1)" />
              <path d="M80 140V100L160 140V100" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="120" cy="120" r="15" fill="#a5b4fc" style={{ filter: "drop-shadow(0 0 15px #a5b4fc)" }} />
              <defs>
                <linearGradient id="grad1" x1="50" y1="40" x2="190" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c026d3" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h1 className="animate-fade-in" style={{ animationDelay: "800ms", position: "relative", zIndex: 2, fontSize: "clamp(100px, 18vw, 250px)", fontWeight: "900", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.03)", margin: 0, lineHeight: 0.8, userSelect: "none", filter: "drop-shadow(0 -20px 80px rgba(124,58,237,0.15))" }}>NEXO</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "2rem", zIndex: 10 }}>© 2026 Florentina Spicco D'aura. All rights reserved globally.</p>
        </footer>
      </body>
    </html>
  );
}
