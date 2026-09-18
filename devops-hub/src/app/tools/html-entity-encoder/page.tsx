"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "©": "&copy;", "®": "&reg;", "™": "&trade;", "€": "&euro;", "£": "&pound;",
  "¥": "&yen;", "¢": "&cent;", "°": "&deg;", "±": "&plusmn;", "×": "&times;",
  "÷": "&divide;", "¶": "&para;", "§": "&sect;", "†": "&dagger;", "‡": "&Dagger;",
  "•": "&bull;", "…": "&hellip;", "—": "&mdash;", "–": "&ndash;", " ": "&nbsp;",
};

const REVERSE_ENTITIES: Record<string, string> = {};
Object.entries(ENTITIES).forEach(([k, v]) => { REVERSE_ENTITIES[v] = k; });

function encodeHtml(text: string): string {
  return text.replace(/[&<>"'©®™€£¥¢°±×÷¶§†‡•…—–]/g, (ch) => ENTITIES[ch] || ch);
}

function decodeHtml(text: string): string {
  return text.replace(/&[a-zA-Z]+;|&#\d+;/g, (entity) => {
    if (REVERSE_ENTITIES[entity]) return REVERSE_ENTITIES[entity];
    if (entity.startsWith("&#")) {
      const code = parseInt(entity.slice(2, -1));
      return String.fromCharCode(code);
    }
    return entity;
  });
}

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('<div class="hello">Hello & Welcome™ — "DevOps" © 2026</div>');
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = mode === "encode" ? encodeHtml(input) : decodeHtml(input);

  return (
    <ToolLayout title="HTML Entity Encoder" description="Encode special characters to HTML entities or decode entities back to readable text. Supports named and numeric entities." icon="🏷️">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button className={mode === "encode" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("encode")}>Encode</button>
        <button className={mode === "decode" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{mode === "encode" ? "Text Input" : "Encoded Input"}</h3>
          <textarea className="textarea-field" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{mode === "encode" ? "HTML Entities" : "Decoded Text"}</h3>
          <div className="code-output" style={{ position: "relative", minHeight: 200 }}>
            <CopyButton text={output} />
            {output}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
