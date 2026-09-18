import Link from "next/link";
import { tools } from "@/data/tools";

const categoryColors: Record<string, string> = {
  generator: "badge-black",
  calculator: "badge-white",
  converter: "badge-black",
  utility: "badge-white",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title" style={{ position: "relative" }}>
          <span className="brutalist-title">Free DevOps Tools</span>
          <br />
          <span style={{ color: "#000000", fontSize: "0.75em", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            &amp; Cloud Calculators
          </span>
        </h1>
        <p className="hero-subtitle">
          20+ interactive utilities for DevOps engineers. Dockerfile generator,
          Kubernetes YAML builder, CIDR calculator, JWT decoder, and more.
          <strong> No signup. No tracking. Runs 100% in your browser.</strong>
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", position: "relative", flexWrap: "wrap" }}>
          <Link href="/tools" className="btn-primary" style={{ textDecoration: "none" }}>
            🚀 Explore All Tools
          </Link>
          <a
            href="#tools-grid"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            ↓ Browse Below
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1000, margin: "-1rem auto 3rem", padding: "0 1.5rem" }}>
        <div
          className="glass-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            textAlign: "center",
            padding: "1.5rem 1rem",
            background: "#ffffff",
          }}
        >
          {[
            { label: "Free Tools", value: "20+" },
            { label: "Categories", value: "4" },
            { label: "Signup Required", value: "None" },
            { label: "Data Stored", value: "Zero" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{ fontSize: "2rem", fontWeight: 900, color: "#000000" }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#000000", fontWeight: 700, textTransform: "uppercase", marginTop: "0.25rem" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools-grid" style={{ paddingBottom: "4rem" }}>
        <div className="section-header">
          <h2>
            <span className="brutalist-heading">All Tools</span>
          </h2>
          <p style={{ marginTop: "0.75rem", fontWeight: 600 }}>
            Click any tool to use it instantly. Every tool runs entirely in your
            browser.
          </p>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="glass-card tool-card"
              style={{ textDecoration: "none" }}
            >
              <div
                className="tool-card-icon"
                style={{ background: "#ffffff", color: "#000000", border: "2px solid #000000", boxShadow: "2px 2px 0px #000000" }}
              >
                {tool.icon}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <h3>{tool.name}</h3>
                <span className={`badge ${categoryColors[tool.category] || "badge-white"}`}>
                  {tool.category}
                </span>
              </div>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div className="section-header">
          <h2>
            <span className="brutalist-heading">Why InfraForge?</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              icon: "🔒",
              title: "100% Private",
              desc: "All tools run client-side in your browser. Your data never touches our servers.",
            },
            {
              icon: "⚡",
              title: "Instant Results",
              desc: "No waiting, no API calls. Generate configs and convert data in milliseconds.",
            },
            {
              icon: "🆓",
              title: "Completely Free",
              desc: "No hidden paywalls, no freemium tricks. Every tool is free forever, no signup needed.",
            },
          ].map((f) => (
            <div key={f.title} className="glass-card" style={{ padding: "1.5rem" }}>
              <span style={{ fontSize: "2.25rem", display: "block", marginBottom: "0.75rem" }}>
                {f.icon}
              </span>
              <h3 style={{ marginBottom: "0.5rem", fontWeight: 800, fontSize: "1.2rem" }}>{f.title}</h3>
              <p style={{ color: "#000000", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 500 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
