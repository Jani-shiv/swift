"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";


function ipToLong(ip: string): number {
  return ip.split(".").reduce((a, o) => (a << 8) + parseInt(o), 0) >>> 0;
}

function longToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export default function CidrCalculator() {
  const [ip, setIp] = useState("10.0.0.0");
  const [prefix, setPrefix] = useState(24);

  const calc = () => {
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const ipLong = ipToLong(ip);
    const network = (ipLong & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;
    const firstHost = network + 1;
    const lastHost = broadcast - 1;
    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = Math.max(totalHosts - 2, 0);
    const awsUsableHosts = Math.max(totalHosts - 5, 0);

    return {
      network: longToIp(network),
      broadcast: longToIp(broadcast),
      firstHost: longToIp(firstHost),
      lastHost: longToIp(lastHost),
      mask: longToIp(mask),
      totalHosts,
      usableHosts,
      awsUsableHosts,
      awsRouter: longToIp(network + 1),
      awsDns: longToIp(network + 2),
      awsReserved: longToIp(network + 3),
      cidr: `${longToIp(network)}/${prefix}`,
      wildcardMask: longToIp(~mask >>> 0),
    };
  };

  const result = calc();
  const rows = [
    ["CIDR Block", result.cidr],
    ["Network Address", result.network],
    ["Broadcast Address", result.broadcast],
    ["Subnet Mask", result.mask],
    ["Wildcard Mask", result.wildcardMask],
    ["First Usable Host (Standard)", result.firstHost],
    ["Last Usable Host (Standard)", result.lastHost],
    ["Total IPv4 Addresses", result.totalHosts.toLocaleString()],
    ["Standard Usable Hosts (-2)", result.usableHosts.toLocaleString()],
    ["AWS/GCP VPC Usable Hosts (-5)", result.awsUsableHosts.toLocaleString()],
  ];

  const cloudReserved = [
    [`${result.network}`, "Network Address (Reserved)"],
    [`${result.awsRouter}`, "AWS/VPC Default Router / Gateway"],
    [`${result.awsDns}`, "AWS VPC DNS Server"],
    [`${result.awsReserved}`, "AWS Reserved for future use"],
    [`${result.broadcast}`, "Network Broadcast Address"],
  ];

  return (
    <ToolLayout title="Cloud VPC CIDR & IP Architect" description="Dual IPv4/v6 subnetting, cloud provider reserved IP breakdown (AWS/GCP/Azure), and CIDR ranges." icon="🌐">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>VPC CIDR Configuration</h3>
          <label className="field-label">IPv4 Network Address</label>
          <input className="input-field" value={ip} onChange={e => setIp(e.target.value)} placeholder="10.0.0.0" style={{ marginBottom: "1rem" }} />
          <label className="field-label">Subnet Mask Length: /{prefix}</label>
          <input type="range" min={0} max={32} value={prefix} onChange={e => setPrefix(Number(e.target.value))} style={{ width: "100%", accentColor: "#000000", marginBottom: "0.5rem" }} />
          <div style={{ display: "flex", justifyContent: "space-between", color: "#000000", fontSize: "0.8rem", fontWeight: 700 }}>
            <span>/0</span><span>/8 (Class A)</span><span>/16 (Class B)</span><span>/24 (Class C)</span><span>/32</span>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <label className="field-label">Cloud VPC Quick Specs</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[16, 20, 22, 24, 26, 28, 30].map(p => (
                <button key={p} className={`btn-secondary ${prefix === p ? "btn-primary" : ""}`} onClick={() => setPrefix(p)} style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}>
                  /{p} ({Math.pow(2, 32 - p) - 5} AWS IPs)
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Subnet Architecture Specs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {rows.map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "#f4f4f5", border: "2px solid #000000", borderRadius: "4px", alignItems: "center" }}>
                <span style={{ color: "#000000", fontSize: "0.85rem", fontWeight: 700 }}>{label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#000000" }}>{value}</span>
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: "0.5rem", fontWeight: 800 }}>AWS / Cloud Infrastructure Reserved IPs</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {cloudReserved.map(([ipAddr, desc]) => (
              <div key={ipAddr} style={{ padding: "0.4rem 0.75rem", background: "#ffffff", border: "2px solid #000000", borderRadius: "4px", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800 }}>{ipAddr}</span>
                <span style={{ color: "#52525b", fontWeight: 600 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
