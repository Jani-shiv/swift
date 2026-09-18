"use client";
import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testText, setTestText] = useState("Contact us at hello@example.com or support@infraforge.io for help. Invalid: @bad");

  const { matches, error } = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const found: { match: string; index: number; groups?: string[] }[] = [];
      let m;
      if (flags.includes("g")) {
        while ((m = regex.exec(testText)) !== null) {
          found.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) break;
        }
      } else {
        m = regex.exec(testText);
        if (m) found.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches: found, error: "" };
    } catch (e: unknown) {
      return { matches: [], error: e instanceof Error ? e.message : "Invalid regex" };
    }
  }, [pattern, flags, testText]);

  const highlightText = () => {
    if (!matches.length || error) return testText;
    let result = "";
    let lastIdx = 0;
    matches.forEach((m) => {
      result += testText.slice(lastIdx, m.index);
      result += `【${m.match}】`;
      lastIdx = m.index + m.match.length;
    });
    result += testText.slice(lastIdx);
    return result;
  };

  return (
    <ToolLayout title="Regex Tester" description="Test regular expressions against text input with real-time match highlighting. Supports all JavaScript regex flags." icon="🎯">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Pattern</h3>
          <label className="field-label">Regular Expression</label>
          <input className="input-field" value={pattern} onChange={e => setPattern(e.target.value)} style={{ fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }} />
          <label className="field-label">Flags</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {["g", "i", "m", "s"].map(f => (
              <button key={f} className={flags.includes(f) ? "btn-primary" : "btn-secondary"} style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                onClick={() => setFlags(flags.includes(f) ? flags.replace(f, "") : flags + f)}>
                {f}
              </button>
            ))}
          </div>
          {error && (
            <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", color: "#f87171", marginBottom: "1rem", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}
          <label className="field-label">Test String</label>
          <textarea className="textarea-field" value={testText} onChange={e => setTestText(e.target.value)} style={{ minHeight: 200 }} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Results</h3>
          <div style={{ padding: "0.75rem", background: matches.length ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${matches.length ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: "var(--radius-md)", marginBottom: "1rem", color: matches.length ? "#34d399" : "#fbbf24", fontWeight: 600 }}>
            {matches.length} match{matches.length !== 1 ? "es" : ""} found
          </div>
          <label className="field-label">Highlighted Output</label>
          <div className="code-output" style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
            {highlightText()}
          </div>
          {matches.length > 0 && (
            <>
              <label className="field-label">Match Details</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {matches.map((m, i) => (
                  <div key={i} style={{ padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                    <span style={{ color: "#34d399", fontWeight: 600 }}>#{i + 1}</span>
                    <span style={{ marginLeft: "0.5rem", fontFamily: "var(--font-mono)" }}>{`"${m.match}"`}</span>
                    <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>at index {m.index}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
