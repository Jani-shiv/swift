"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Service {
  name: string;
  image: string;
  ports: string;
  environment: string;
  volumes: string;
  dependsOn: string;
  restart: string;
}

const defaultService: Service = {
  name: "web",
  image: "nginx:alpine",
  ports: "80:80",
  environment: "",
  volumes: "",
  dependsOn: "",
  restart: "unless-stopped",
};

export default function DockerComposeBuilder() {
  const [services, setServices] = useState<Service[]>([{ ...defaultService }]);
  const [version, setVersion] = useState("3.8");
  const [networkName, setNetworkName] = useState("");

  const updateService = (idx: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[idx] = { ...updated[idx], [field]: value };
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, { ...defaultService, name: `service${services.length + 1}` }]);
  };

  const removeService = (idx: number) => {
    if (services.length > 1) setServices(services.filter((_, i) => i !== idx));
  };

  const generate = () => {
    let yml = `version: "${version}"\n\nservices:\n`;
    services.forEach((s) => {
      yml += `  ${s.name}:\n`;
      yml += `    image: ${s.image}\n`;
      if (s.ports) {
        yml += `    ports:\n`;
        s.ports.split(",").map(p => p.trim()).filter(Boolean).forEach(p => {
          yml += `      - "${p}"\n`;
        });
      }
      if (s.environment) {
        yml += `    environment:\n`;
        s.environment.split(",").map(e => e.trim()).filter(Boolean).forEach(e => {
          yml += `      - ${e}\n`;
        });
      }
      if (s.volumes) {
        yml += `    volumes:\n`;
        s.volumes.split(",").map(v => v.trim()).filter(Boolean).forEach(v => {
          yml += `      - ${v}\n`;
        });
      }
      if (s.dependsOn) {
        yml += `    depends_on:\n`;
        s.dependsOn.split(",").map(d => d.trim()).filter(Boolean).forEach(d => {
          yml += `      - ${d}\n`;
        });
      }
      yml += `    restart: ${s.restart}\n`;
      yml += `\n`;
    });
    if (networkName) {
      yml += `networks:\n  ${networkName}:\n    driver: bridge\n`;
    }
    return yml;
  };

  const output = generate();

  return (
    <ToolLayout title="Docker Compose Builder" description="Build multi-service docker-compose.yml files with an interactive form. Add services, ports, volumes and environment variables." icon="🏗️">
      <div className="tool-grid">
        <div className="glass-card tool-panel" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Services</h3>

          <label className="field-label">Compose Version</label>
          <select className="select-field" value={version} onChange={e => setVersion(e.target.value)} style={{ marginBottom: "1rem" }}>
            <option value="3.8">3.8</option>
            <option value="3.9">3.9</option>
            <option value="3">3</option>
            <option value="2.4">2.4</option>
          </select>

          <label className="field-label">Custom Network Name (optional)</label>
          <input className="input-field" value={networkName} onChange={e => setNetworkName(e.target.value)} placeholder="e.g. app-network" style={{ marginBottom: "1.5rem" }} />

          {services.map((s, i) => (
            <div key={i} style={{ padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)", marginBottom: "1rem", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 700 }}>Service #{i + 1}</span>
                {services.length > 1 && (
                  <button className="btn-icon" onClick={() => removeService(i)} title="Remove">✕</button>
                )}
              </div>
              <label className="field-label">Name</label>
              <input className="input-field" value={s.name} onChange={e => updateService(i, "name", e.target.value)} style={{ marginBottom: "0.5rem" }} />
              <label className="field-label">Image</label>
              <input className="input-field" value={s.image} onChange={e => updateService(i, "image", e.target.value)} style={{ marginBottom: "0.5rem" }} />
              <label className="field-label">Ports (comma-separated)</label>
              <input className="input-field" value={s.ports} onChange={e => updateService(i, "ports", e.target.value)} placeholder="8080:80, 443:443" style={{ marginBottom: "0.5rem" }} />
              <label className="field-label">Environment (comma-separated KEY=val)</label>
              <input className="input-field" value={s.environment} onChange={e => updateService(i, "environment", e.target.value)} placeholder="NODE_ENV=production, PORT=3000" style={{ marginBottom: "0.5rem" }} />
              <label className="field-label">Volumes (comma-separated)</label>
              <input className="input-field" value={s.volumes} onChange={e => updateService(i, "volumes", e.target.value)} placeholder="./data:/data" style={{ marginBottom: "0.5rem" }} />
              <label className="field-label">Depends On (comma-separated)</label>
              <input className="input-field" value={s.dependsOn} onChange={e => updateService(i, "dependsOn", e.target.value)} placeholder="db, redis" style={{ marginBottom: "0.5rem" }} />
              <label className="field-label">Restart Policy</label>
              <select className="select-field" value={s.restart} onChange={e => updateService(i, "restart", e.target.value)}>
                <option value="unless-stopped">unless-stopped</option>
                <option value="always">always</option>
                <option value="on-failure">on-failure</option>
                <option value="no">no</option>
              </select>
            </div>
          ))}
          <button className="btn-primary" onClick={addService} style={{ width: "100%" }}>+ Add Service</button>
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>docker-compose.yml</h3>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={output} />
            {output}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
