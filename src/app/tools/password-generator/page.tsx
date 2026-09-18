"use client";
import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [exclude, setExclude] = useState("");
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    let charset = "";
    if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (digits) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (exclude) charset = charset.split("").filter(c => !exclude.includes(c)).join("");
    if (!charset) { setPasswords(["No character set selected"]); return; }

    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      results.push(Array.from(arr, v => charset[v % charset.length]).join(""));
    }
    setPasswords(results);
  }, [length, upper, lower, digits, symbols, exclude, count]);

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 12) score++;
    if (pw.length >= 16) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    if (score <= 2) return { label: "Weak", color: "#ef4444" };
    if (score <= 4) return { label: "Good", color: "#f59e0b" };
    return { label: "Strong", color: "#10b981" };
  };

  return (
    <ToolLayout title="Password Generator" description="Generate cryptographically secure passwords using crypto.getRandomValues(). Customize length, character sets, and exclusions." icon="🔒">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Settings</h3>
          <label className="field-label">Length: {length}</label>
          <input type="range" min={4} max={128} value={length} onChange={e => setLength(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-orange)", marginBottom: "1rem" }} />
          <label className="field-label">Count: {count}</label>
          <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-orange)", marginBottom: "1rem" }} />
          <div className="toggle-wrapper"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} id="up" /><label htmlFor="up" className="toggle-label">Uppercase (A-Z)</label></div>
          <div className="toggle-wrapper"><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} id="lo" /><label htmlFor="lo" className="toggle-label">Lowercase (a-z)</label></div>
          <div className="toggle-wrapper"><input type="checkbox" checked={digits} onChange={e => setDigits(e.target.checked)} id="di" /><label htmlFor="di" className="toggle-label">Digits (0-9)</label></div>
          <div className="toggle-wrapper"><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} id="sy" /><label htmlFor="sy" className="toggle-label">Symbols (!@#$...)</label></div>
          <label className="field-label" style={{ marginTop: "0.5rem" }}>Exclude Characters</label>
          <input className="input-field" value={exclude} onChange={e => setExclude(e.target.value)} placeholder="e.g. 0Ol1I" style={{ marginBottom: "1rem" }} />
          <button className="btn-primary" onClick={generate} style={{ width: "100%" }}>🎲 Generate Passwords</button>
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Generated Passwords</h3>
          {passwords.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>Click generate to create passwords</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {passwords.map((pw, i) => {
                const s = getStrength(pw);
                return (
                  <div key={i} style={{ position: "relative" }}>
                    <div className="code-output" style={{ paddingRight: "5rem", position: "relative" }}>
                      <CopyButton text={pw} />
                      {pw}
                    </div>
                    <span style={{ position: "absolute", bottom: "0.5rem", left: "0.75rem", fontSize: "0.7rem", color: s.color, fontWeight: 600 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
