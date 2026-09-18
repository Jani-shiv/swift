"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function uuidv4(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  arr[6] = (arr[6] & 0x0f) | 0x40;
  arr[8] = (arr[8] & 0x3f) | 0x80;
  const hex = Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(5);
  const [upperCase, setUpperCase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      let u = uuidv4();
      if (upperCase) u = u.toUpperCase();
      if (noDashes) u = u.replace(/-/g, "");
      result.push(u);
    }
    setUuids(result);
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate RFC 4122 compliant UUIDs (v4) using cryptographic randomness. Generate multiple at once." icon="🆔">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Options</h3>
          <label className="field-label">Count: {count}</label>
          <input type="range" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-pink)", marginBottom: "1rem" }} />
          <div className="toggle-wrapper">
            <input type="checkbox" checked={upperCase} onChange={e => setUpperCase(e.target.checked)} id="uc" />
            <label htmlFor="uc" className="toggle-label">Uppercase</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={noDashes} onChange={e => setNoDashes(e.target.checked)} id="nd" />
            <label htmlFor="nd" className="toggle-label">Remove dashes</label>
          </div>
          <button className="btn-primary" onClick={generate} style={{ width: "100%", marginTop: "1rem" }}>🎲 Generate UUIDs</button>
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Generated UUIDs</h3>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={uuids.join("\n")} />
            {uuids.join("\n")}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
