"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"InfraForge","version":"1.0","tools":["dockerfile","k8s","cron"],"config":{"theme":"dark","lang":"en"}}');
  const [indent, setIndent] = useState(2);

  const { output, error, stats } = (() => {
    try {
      const obj = JSON.parse(input);
      const formatted = JSON.stringify(obj, null, indent);
      const keys = JSON.stringify(obj).match(/"[^"]+"\s*:/g);
      return {
        output: formatted,
        error: "",
        stats: { keys: keys?.length || 0, size: new Blob([input]).size }
      };
    } catch (e: unknown) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Invalid JSON",
        stats: null
      };
    }
  })();
  const minify = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj));
    } catch {
      // Input error is already caught and displayed by derived error state
    }
  };

  const formatAndSet = () => {
    if (output) setInput(output);
  };


  return (
    <ToolLayout title="JSON Formatter & Validator" description="Format, validate, and minify JSON with error detection. See key count and byte size at a glance." icon="📋">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button className="btn-primary" onClick={formatAndSet}>🎨 Format</button>
        <button className="btn-secondary" onClick={minify}>📦 Minify</button>
        <select className="select-field" value={indent} onChange={e => setIndent(Number(e.target.value))} style={{ width: 120 }}>
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 space</option>
        </select>
      </div>
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>JSON Input</h3>
          <textarea className="textarea-field" value={input} onChange={e => setInput(e.target.value)} style={{ minHeight: 400 }} />
          {error && (
            <div style={{ padding: "0.75rem", marginTop: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", color: "#f87171", fontSize: "0.85rem" }}>
              ❌ {error}
            </div>
          )}
        </div>
        <div className="glass-card tool-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: 700 }}>Formatted Output</h3>
            {stats && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <span className="badge badge-blue">{stats.keys} keys</span>
                <span className="badge badge-green">{stats.size} bytes</span>
              </div>
            )}
          </div>
          {output ? (
            <div className="code-output" style={{ position: "relative", minHeight: 400 }}>
              <CopyButton text={output} />
              {output}
            </div>
          ) : (
            <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              Fix JSON errors to see output
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
