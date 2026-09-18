"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function Base64Encoder() {
  const [input, setInput] = useState("Hello, DevOps World!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const getOutput = () => {
    try {
      if (mode === "encode") return btoa(unescape(encodeURIComponent(input)));
      else return decodeURIComponent(escape(atob(input)));
    } catch {
      return "Error: Invalid input for " + mode + " operation";
    }
  };

  const output = getOutput();

  return (
    <ToolLayout title="Base64 Encode / Decode" description="Encode text to Base64 or decode Base64 strings. Supports UTF-8 characters. All processing happens in your browser." icon="🔄">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button className={mode === "encode" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("encode")}>Encode</button>
        <button className={mode === "decode" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{mode === "encode" ? "Plain Text" : "Base64 Input"}</h3>
          <textarea className="textarea-field" value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{mode === "encode" ? "Base64 Output" : "Decoded Text"}</h3>
          <div className="code-output" style={{ position: "relative", minHeight: 200 }}>
            <CopyButton text={output} />
            {output}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
