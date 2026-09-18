"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

async function computeHash(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("Hello, DevOps World!");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [upperCase, setUpperCase] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const algorithms = [
        { name: "SHA-1", algo: "SHA-1" },
        { name: "SHA-256", algo: "SHA-256" },
        { name: "SHA-384", algo: "SHA-384" },
        { name: "SHA-512", algo: "SHA-512" },
      ];
      const results: Record<string, string> = {};
      for (const a of algorithms) {
        const hash = await computeHash(a.algo, input);
        results[a.name] = upperCase ? hash.toUpperCase() : hash;
      }
      // MD5 not available via SubtleCrypto, use a simple implementation
      results["MD5"] = upperCase ? simpleMD5(input).toUpperCase() : simpleMD5(input);
      setHashes(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="Hash Generator (MD5/SHA)" description="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes of text strings using the Web Crypto API." icon="🛡️">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Input</h3>
          <textarea className="textarea-field" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash..." />
          <div className="toggle-wrapper" style={{ marginTop: "1rem" }}>
            <input type="checkbox" checked={upperCase} onChange={e => setUpperCase(e.target.checked)} id="uc" />
            <label htmlFor="uc" className="toggle-label">Uppercase output</label>
          </div>
          <button className="btn-primary" onClick={generate} style={{ width: "100%", marginTop: "0.75rem" }} disabled={loading}>
            {loading ? "Computing..." : "🔐 Generate Hashes"}
          </button>
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Hashes</h3>
          {Object.keys(hashes).length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>Click generate to compute hashes</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(hashes).map(([algo, hash]) => (
                <div key={algo}>
                  <label className="field-label">{algo}</label>
                  <div className="code-output" style={{ position: "relative", wordBreak: "break-all", fontSize: "0.8rem" }}>
                    <CopyButton text={hash} />
                    {hash}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

// Simple MD5 implementation (since Web Crypto doesn't support MD5)
function simpleMD5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);d = ff(d, a, b, c, k[1], 12, -389564586);c = ff(c, d, a, b, k[2], 17, 606105819);b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);d = ff(d, a, b, c, k[5], 12, 1200080426);c = ff(c, d, a, b, k[6], 17, -1473231341);b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);d = ff(d, a, b, c, k[9], 12, -1958414417);c = ff(c, d, a, b, k[10], 17, -42063);b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);d = ff(d, a, b, c, k[13], 12, -40341101);c = ff(c, d, a, b, k[14], 17, -1502002290);b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);d = gg(d, a, b, c, k[6], 9, -1069501632);c = gg(c, d, a, b, k[11], 14, 643717713);b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);d = gg(d, a, b, c, k[10], 9, 38016083);c = gg(c, d, a, b, k[15], 14, -660478335);b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);d = gg(d, a, b, c, k[14], 9, -1019803690);c = gg(c, d, a, b, k[3], 14, -187363961);b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);d = gg(d, a, b, c, k[2], 9, -51403784);c = gg(c, d, a, b, k[7], 14, 1735328473);b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);d = hh(d, a, b, c, k[8], 11, -2022574463);c = hh(c, d, a, b, k[11], 16, 1839030562);b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);d = hh(d, a, b, c, k[4], 11, 1272893353);c = hh(c, d, a, b, k[7], 16, -155497632);b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);d = hh(d, a, b, c, k[0], 11, -358537222);c = hh(c, d, a, b, k[3], 16, -722521979);b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);d = hh(d, a, b, c, k[12], 11, -421815835);c = hh(c, d, a, b, k[15], 16, 530742520);b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);d = ii(d, a, b, c, k[7], 10, 1126891415);c = ii(c, d, a, b, k[14], 15, -1416354905);b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);d = ii(d, a, b, c, k[3], 10, -1894986606);c = ii(c, d, a, b, k[10], 15, -1051523);b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);d = ii(d, a, b, c, k[15], 10, -30611744);c = ii(c, d, a, b, k[6], 15, -1560198380);b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);d = ii(d, a, b, c, k[11], 10, -1120210379);c = ii(c, d, a, b, k[2], 15, 718787259);b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);x[1] = add32(b, x[1]);x[2] = add32(c, x[2]);x[3] = add32(d, x[3]);
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function md51(s: string) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= n; i += 64) {
      const k: number[] = [];
      for (let j = i - 64; j < i; j += 4) k.push(s.charCodeAt(j) | (s.charCodeAt(j+1) << 8) | (s.charCodeAt(j+2) << 16) | (s.charCodeAt(j+3) << 24));
      md5cycle(state, k);
    }
    const tail: number[] = [];
    for (let j = i - 64; j < n; j += 4) {
      let val = s.charCodeAt(j) || 0;
      if (j + 1 < n) val |= s.charCodeAt(j+1) << 8;
      if (j + 2 < n) val |= s.charCodeAt(j+2) << 16;
      if (j + 3 < n) val |= s.charCodeAt(j+3) << 24;
      tail.push(val);
    }
    const remaining = n % 64;
    if (remaining < 56) {
      const padWord = 1 << ((remaining % 4) * 8 + 7);
      if (tail.length <= Math.floor(remaining / 4)) tail.push(padWord); else tail[Math.floor(remaining / 4)] |= padWord;
      while (tail.length < 14) tail.push(0);
    } else {
      const padWord = 1 << ((remaining % 4) * 8 + 7);
      if (tail.length <= Math.floor(remaining / 4)) tail.push(padWord); else tail[Math.floor(remaining / 4)] |= padWord;
      while (tail.length < 16) tail.push(0);
      md5cycle(state, tail);
      tail.length = 0;
      while (tail.length < 14) tail.push(0);
    }
    tail.push(n * 8);
    tail.push(0);
    md5cycle(state, tail);
    return state;
  }
  function add32(a: number, b: number) { return (a + b) & 0xFFFFFFFF; }
  function rhex(n: number) {
    const hex = "0123456789abcdef";
    let s = "";
    for (let j = 0; j < 4; j++) s += hex.charAt((n >> (j * 8 + 4)) & 0x0f) + hex.charAt((n >> (j * 8)) & 0x0f);
    return s;
  }
  const state = md51(string);
  return rhex(state[0]) + rhex(state[1]) + rhex(state[2]) + rhex(state[3]);
}
