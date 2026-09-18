"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import * as yaml from "js-yaml";

export default function YamlJsonConverter() {
  const [input, setInput] = useState(`name: my-app
version: "1.0"
services:
  web:
    image: nginx
    ports:
      - "80:80"`);
  const [mode, setMode] = useState<"yamlToJson" | "jsonToYaml">("yamlToJson");
  const { output, error } = (() => {
    try {
      if (mode === "yamlToJson") {
        const obj = yaml.load(input);
        return { output: JSON.stringify(obj, null, 2), error: "" };
      } else {
        const obj = JSON.parse(input);
        return { output: yaml.dump(obj, { indent: 2, lineWidth: -1 }), error: "" };
      }
    } catch (e: unknown) {
      return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
    }
  })();

  return (
    <ToolLayout title="YAML ↔ JSON Converter" description="Convert between YAML and JSON formats with syntax validation. Supports nested structures and arrays." icon="📄">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button className={mode === "yamlToJson" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("yamlToJson")}>YAML → JSON</button>
        <button className={mode === "jsonToYaml" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("jsonToYaml")}>JSON → YAML</button>
      </div>
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{mode === "yamlToJson" ? "YAML Input" : "JSON Input"}</h3>
          <textarea className="textarea-field" value={input} onChange={e => setInput(e.target.value)} style={{ minHeight: 300 }} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{mode === "yamlToJson" ? "JSON Output" : "YAML Output"}</h3>
          {error ? (
            <div style={{ padding: "1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", color: "#f87171" }}>
              ❌ {error}
            </div>
          ) : (
            <div className="code-output" style={{ position: "relative", minHeight: 300 }}>
              <CopyButton text={output} />
              {output}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
