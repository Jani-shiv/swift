"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function DockerfileGenerator() {
  const [baseImage, setBaseImage] = useState("node:20-alpine");
  const [runtimeImage, setRuntimeImage] = useState("gcr.io/distroless/nodejs20-debian12");
  const [workdir, setWorkdir] = useState("/app");
  const [installCmd, setInstallCmd] = useState("npm ci --only=production");
  const [buildCmd, setBuildCmd] = useState("npm run build");
  const [exposePort, setExposePort] = useState("3000");
  const [startCmd, setStartCmd] = useState("server.js");
  const [multiStage, setMultiStage] = useState(true);
  const [distroless, setDistroless] = useState(true);
  const [nonRoot, setNonRoot] = useState(true);
  const [healthcheck, setHealthcheck] = useState(true);
  const [ociLabels, setOciLabels] = useState(true);

  const generateDockerfile = () => {
    const lines: string[] = [];

    if (ociLabels) {
      lines.push(`# Syntax & Meta Standards`);
      lines.push(`# syntax=docker/dockerfile:1.6`);
      lines.push(``);
    }

    if (multiStage) {
      lines.push(`# ===============================================`);
      lines.push(`# Stage 1: Build & Dependency Resolution`);
      lines.push(`# ===============================================`);
      lines.push(`FROM ${baseImage} AS builder`);
      lines.push(`WORKDIR ${workdir}`);
      lines.push(`ENV NODE_ENV=production`);
      lines.push(`COPY package*.json ./`);
      lines.push(`RUN ${installCmd}`);
      lines.push(`COPY . .`);
      if (buildCmd) lines.push(`RUN ${buildCmd}`);
      lines.push(``);

      lines.push(`# ===============================================`);
      lines.push(`# Stage 2: Production Minimal Runtime`);
      lines.push(`# ===============================================`);
      const targetBase = distroless ? runtimeImage : baseImage;
      lines.push(`FROM ${targetBase} AS runner`);
      lines.push(`WORKDIR ${workdir}`);
      lines.push(`ENV NODE_ENV=production`);
      
      if (ociLabels) {
        lines.push(`LABEL org.opencontainers.image.title="Enterprise Microservice" \\`);
        lines.push(`      org.opencontainers.image.vendor="InfraForge" \\`);
        lines.push(`      org.opencontainers.image.authors="DevOps Team <devops@company.com>" \\`);
        lines.push(`      org.opencontainers.image.licenses="MIT"`);
      }

      lines.push(`COPY --from=builder ${workdir}/node_modules ./node_modules`);
      lines.push(`COPY --from=builder ${workdir}/dist ./dist`);
      lines.push(`COPY --from=builder ${workdir}/${startCmd} ./${startCmd}`);
    } else {
      lines.push(`FROM ${baseImage}`);
      lines.push(`WORKDIR ${workdir}`);
      lines.push(`ENV NODE_ENV=production`);
      lines.push(`COPY package*.json ./`);
      lines.push(`RUN ${installCmd}`);
      lines.push(`COPY . .`);
      if (buildCmd) lines.push(`RUN ${buildCmd}`);
    }

    if (nonRoot && !distroless) {
      lines.push(``);
      lines.push(`# Security Hardening: Run as non-root user (UID 10001)`);
      lines.push(`RUN addgroup -g 10001 -S appgroup && adduser -S appuser -u 10001 -G appgroup`);
      lines.push(`USER appuser:appgroup`);
    } else if (distroless) {
      lines.push(``);
      lines.push(`# Distroless non-root security context`);
      lines.push(`USER nonroot:nonroot`);
    }

    if (exposePort) lines.push(`EXPOSE ${exposePort}`);

    if (healthcheck) {
      lines.push(`HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\`);
      lines.push(`  CMD ["/nodejs/bin/node", "-e", "require('http').get('http://localhost:${exposePort}/healthz', (r) => {if (r.statusCode !== 200) process.exit(1);})"]`);
    }

    lines.push(`CMD ["${startCmd}"]`);
    return lines.join("\n");
  };

  const output = generateDockerfile();

  return (
    <ToolLayout
      title="Enterprise Dockerfile Architect"
      description="Build CIS compliant multi-stage Dockerfiles with distroless runtimes, non-root execution, OCI metadata, and healthchecks."
      icon="🐳"
    >
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Hardening & Runtime Controls</h3>

          <label className="field-label">Build Stage Image</label>
          <input className="input-field" value={baseImage} onChange={(e) => setBaseImage(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">Distroless Production Image</label>
          <input className="input-field" value={runtimeImage} onChange={(e) => setRuntimeImage(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">Working Directory</label>
          <input className="input-field" value={workdir} onChange={(e) => setWorkdir(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">Install Command</label>
          <input className="input-field" value={installCmd} onChange={(e) => setInstallCmd(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">Build Command</label>
          <input className="input-field" value={buildCmd} onChange={(e) => setBuildCmd(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">Main Entry Script / File</label>
          <input className="input-field" value={startCmd} onChange={(e) => setStartCmd(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">Exposed Port</label>
          <input className="input-field" value={exposePort} onChange={(e) => setExposePort(e.target.value)} style={{ marginBottom: "1rem" }} />

          <div className="toggle-wrapper">
            <input type="checkbox" checked={multiStage} onChange={(e) => setMultiStage(e.target.checked)} id="multi" />
            <label htmlFor="multi" className="toggle-label">Multi-Stage Build (Build &amp; Runner separation)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={distroless} onChange={(e) => setDistroless(e.target.checked)} id="distroless" />
            <label htmlFor="distroless" className="toggle-label">Distroless Minimal Base (Zero shell/vulnerabilities)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={nonRoot} onChange={(e) => setNonRoot(e.target.checked)} id="nonroot" />
            <label htmlFor="nonroot" className="toggle-label">Enforce Non-Root Execution (UID 10001)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={healthcheck} onChange={(e) => setHealthcheck(e.target.checked)} id="health" />
            <label htmlFor="health" className="toggle-label">Add Container HEALTHCHECK Instruction</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={ociLabels} onChange={(e) => setOciLabels(e.target.checked)} id="oci" />
            <label htmlFor="oci" className="toggle-label">Include OCI Image Metadata Labels</label>
          </div>
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Production Dockerfile Output</h3>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={output} />
            {output}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
