"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { error: "Invalid JWT format (expected 3 parts)" };
    const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return { header, payload, signature: parts[2] };
  } catch {
    return { error: "Failed to decode JWT. Ensure it's a valid token." };
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [nowInSec] = useState(() => Math.floor(Date.now() / 1000));

  const result = decodeJWT(token);
  const expired = "payload" in result && result.payload?.exp ? nowInSec > result.payload.exp : null;

  return (
    <ToolLayout title="JWT Inspector & Decoder" description="Decode and inspect JSON Web Tokens. View header, payload, and check expiration status. All decoding happens in your browser." icon="🔑">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Paste JWT Token</h3>
          <textarea className="textarea-field" value={token} onChange={e => setToken(e.target.value)} placeholder="Paste your JWT token here..." style={{ minHeight: 200 }} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Decoded</h3>
          {"error" in result ? (
            <div style={{ padding: "1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", color: "#f87171" }}>
              {result.error}
            </div>
          ) : (
            <>
              {expired !== null && (
                <div style={{
                  padding: "0.75rem", marginBottom: "1rem", borderRadius: "var(--radius-md)",
                  background: expired ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                  border: `1px solid ${expired ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                  color: expired ? "#f87171" : "#34d399", fontWeight: 600
                }}>
                  {expired ? "⚠️ Token is EXPIRED" : "✅ Token is valid (not expired)"}
                  {"payload" in result && result.payload?.exp && (
                    <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", fontWeight: 400 }}>
                      Expires: {new Date(result.payload.exp * 1000).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <label className="field-label">Header</label>
              <div className="code-output" style={{ marginBottom: "1rem", position: "relative" }}>
                <CopyButton text={JSON.stringify(result.header, null, 2)} />
                {JSON.stringify(result.header, null, 2)}
              </div>

              <label className="field-label">Payload</label>
              <div className="code-output" style={{ marginBottom: "1rem", position: "relative" }}>
                <CopyButton text={JSON.stringify(result.payload, null, 2)} />
                {JSON.stringify(result.payload, null, 2)}
              </div>

              <label className="field-label">Signature</label>
              <div className="code-output" style={{ position: "relative", wordBreak: "break-all" }}>
                <CopyButton text={result.signature} />
                {result.signature}
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
