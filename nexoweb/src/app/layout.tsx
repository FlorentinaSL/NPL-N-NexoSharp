import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Logo from "../components/Logo";

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
  description: "The future of dynamic scripting. Nexo (NPL) is an enterprise-grade language natively compiled to MSIL, interconnected globally via the NexoCloud Registry.",
  metadataBase: new URL("https://nexosharp.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg"
  },
  keywords: ["Nexo", "NPL", "Nexo Programming Language", "N#", "FlorentinaSL", "Luca Cisternino", "Dynamic Scripting", "MSIL", ".NET Standard", "NPM Registry"],
  authors: [{ name: "Luca Cisternino" }],
  creator: "Luca Cisternino",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexosharp.com/",
    title: "Nexo Programming Language | N#",
    description: "The dynamic scripting ecosystem compiled natively to MSIL.",
    siteName: "Nexo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexo Programming Language",
    description: "Future of Dynamic Scripting.",
  },
  verification: {
    google: "msi2qez_bNpCfCf6tCdJb400Lno4W6zElyMGrWiOdpA",
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
        <nav className="animate-fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "-1px", textDecoration: "none", color: "var(--text-primary)" }}>
            <Logo size={40} />
            NEXO
          </a>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "500" }}>
            <a href="/docs" className="nav-link">Docs</a>
            <a href="/cozmo" className="nav-link" style={{ color: "#fbbf24", fontWeight: "bold" }}>Cozmo Lab</a>
            <a href="/registry" className="nav-link">NPM Registry</a>
            <a href="/download" className="nav-link">Download's</a>
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
            <a href="/cozmo" style={{ color: "inherit", textDecoration: "none" }}>Cozmo Robotics</a>
            <a href="/registry" style={{ color: "inherit", textDecoration: "none" }}>Global Registry</a>
            <a href="/luca-cisternino" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: "600" }}>Meet the Architect</a>
            <a href="/download" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: "600" }}>Download Native</a>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "500ms", position: "relative", marginBottom: "-40px", zIndex: 1 }}>
            <Logo size={240} />
          </div>

          <h1 className="animate-fade-in" style={{ animationDelay: "800ms", position: "relative", zIndex: 2, fontSize: "clamp(100px, 18vw, 250px)", fontWeight: "900", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.03)", margin: 0, lineHeight: 0.8, userSelect: "none", filter: "drop-shadow(0 -20px 80px rgba(124,58,237,0.15))" }}>NEXO</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "2rem", zIndex: 10 }}>© 2026 <a href="/luca-cisternino" style={{ color: "inherit", textDecoration: "underline" }}>Luca Cisternino</a>. All rights reserved globally.</p>
        </footer>
      </body>
    </html>
  );
}
