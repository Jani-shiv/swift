"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function CssGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#8b5cf6");
  const [color3, setColor3] = useState("");

  const gradient = type === "linear"
    ? `linear-gradient(${angle}deg, ${color1}${color3 ? `, ${color3}` : ""}, ${color2})`
    : `radial-gradient(circle, ${color1}${color3 ? `, ${color3}` : ""}, ${color2})`;

  const css = `background: ${gradient};`;

  return (
    <ToolLayout title="CSS Gradient Generator" description="Create beautiful CSS gradients with a visual color picker and live preview. Supports linear and radial gradients." icon="🎨">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Settings</h3>
          <label className="field-label">Type</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button className={type === "linear" ? "btn-primary" : "btn-secondary"} onClick={() => setType("linear")}>Linear</button>
            <button className={type === "radial" ? "btn-primary" : "btn-secondary"} onClick={() => setType("radial")}>Radial</button>
          </div>
          {type === "linear" && (
            <>
              <label className="field-label">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-purple)", marginBottom: "1rem" }} />
            </>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label className="field-label">Color 1</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="color" value={color1} onChange={e => setColor1(e.target.value)} style={{ width: 40, height: 40, border: "none", cursor: "pointer" }} />
                <input className="input-field" value={color1} onChange={e => setColor1(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div>
              <label className="field-label">Color 2</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="color" value={color2} onChange={e => setColor2(e.target.value)} style={{ width: 40, height: 40, border: "none", cursor: "pointer" }} />
                <input className="input-field" value={color2} onChange={e => setColor2(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
          </div>
          <label className="field-label">Middle Color (optional)</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="color" value={color3 || "#10b981"} onChange={e => setColor3(e.target.value)} style={{ width: 40, height: 40, border: "none", cursor: "pointer" }} />
            <input className="input-field" value={color3} onChange={e => setColor3(e.target.value)} placeholder="Leave empty for 2-color" style={{ flex: 1 }} />
            {color3 && <button className="btn-icon" onClick={() => setColor3("")}>✕</button>}
          </div>
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Preview</h3>
          <div style={{ background: gradient, borderRadius: "var(--radius-lg)", height: 250, marginBottom: "1.5rem", border: "1px solid var(--border-glass)" }} />
          <label className="field-label">CSS Code</label>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={css} />
            {css}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
