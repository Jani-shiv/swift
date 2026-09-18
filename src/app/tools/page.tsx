import Link from "next/link";
import { tools } from "@/data/tools";

const categoryColors: Record<string, string> = {
  generator: "badge-black",
  calculator: "badge-white",
  converter: "badge-black",
  utility: "badge-white",
};

export default function ToolsIndex() {
  return (
    <div className="tool-page fade-in">
      <div className="tool-header">
        <h1 className="brutalist-title">All DevOps Tools</h1>
        <p style={{ marginTop: "0.5rem", fontWeight: 700, color: "#000000" }}>
          Browse all {tools.length} free tools. Click to use instantly.
        </p>
      </div>
      <div className="tools-grid" style={{ padding: 0 }}>
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
    </div>
  );
}
