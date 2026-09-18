"use client";
import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { diffLines, Change } from "diff";

export default function DiffViewer() {
  const [textA, setTextA] = useState(`server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;
}`);
  const [textB, setTextB] = useState(`server {
    listen 443 ssl;
    server_name example.com;
    root /var/www/html;
    index index.html;
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
}`);

  const diffs = useMemo(() => diffLines(textA, textB), [textA, textB]);

  const stats = useMemo(() => {
    let added = 0, removed = 0;
    diffs.forEach((d: Change) => {
      if (d.added) added += (d.value.match(/\n/g) || []).length || 1;
      if (d.removed) removed += (d.value.match(/\n/g) || []).length || 1;
    });
    return { added, removed };
  }, [diffs]);

  return (
    <ToolLayout title="Diff Viewer / Compare" description="Compare two text blocks and see additions, deletions, and changes highlighted line by line." icon="📊">
      <div className="tool-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Original (A)</h3>
          <textarea className="textarea-field" value={textA} onChange={e => setTextA(e.target.value)} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Modified (B)</h3>
          <textarea className="textarea-field" value={textB} onChange={e => setTextB(e.target.value)} />
        </div>
      </div>

      <div className="glass-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontWeight: 700 }}>Diff Output</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span style={{ color: "#34d399", fontSize: "0.85rem" }}>+{stats.added} added</span>
            <span style={{ color: "#f87171", fontSize: "0.85rem" }}>-{stats.removed} removed</span>
          </div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-glass)" }}>
          {diffs.map((part: Change, i: number) => {
            const lines = part.value.split("\n").filter((l, idx, arr) => idx < arr.length - 1 || l);
            return lines.map((line, j) => (
              <div key={`${i}-${j}`} className={`diff-line ${part.added ? "added" : ""} ${part.removed ? "removed" : ""}`}>
                <span style={{ opacity: 0.5, marginRight: "0.5rem" }}>{part.added ? "+" : part.removed ? "-" : " "}</span>
                {line}
              </div>
            ));
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
