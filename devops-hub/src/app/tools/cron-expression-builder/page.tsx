"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FIELDS = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"] as const;
const LABELS = ["Minute (0-59)", "Hour (0-23)", "Day of Month (1-31)", "Month (1-12)", "Day of Week (0-6)"];

function describeCron(parts: string[]): string {
  const [min, hr, dom, mon, dow] = parts;
  const pieces: string[] = [];
  if (min === "*" && hr === "*") pieces.push("Every minute");
  else if (min === "0" && hr === "*") pieces.push("Every hour at minute 0");
  else if (hr === "*") pieces.push(`Every hour at minute ${min}`);
  else if (min === "*") pieces.push(`Every minute during hour ${hr}`);
  else pieces.push(`At ${hr.padStart(2, "0")}:${min.padStart(2, "0")}`);
  if (dom !== "*") pieces.push(`on day ${dom} of the month`);
  if (mon !== "*") pieces.push(`in month ${mon}`);
  if (dow !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = parseInt(dow);
    pieces.push(`on ${isNaN(d) ? dow : (days[d] || dow)}`);
  }
  return pieces.join(" ");
}

function getNextRuns(expr: string, count = 5): string[] {
  const parts = expr.split(/\s+/);
  if (parts.length !== 5) return ["Invalid expression"];
  const results: string[] = [];
  const now = new Date();
  const check = new Date(now);

  for (let i = 0; i < 525600 && results.length < count; i++) {
    check.setMinutes(check.getMinutes() + 1);
    const m = check.getMinutes().toString();
    const h = check.getHours().toString();
    const d = check.getDate().toString();
    const mo = (check.getMonth() + 1).toString();
    const dw = check.getDay().toString();
    if (matchField(parts[0], m) && matchField(parts[1], h) && matchField(parts[2], d) && matchField(parts[3], mo) && matchField(parts[4], dw)) {
      results.push(check.toLocaleString());
    }
  }
  return results.length ? results : ["No upcoming runs found"];
}

function matchField(pattern: string, value: string): boolean {
  if (pattern === "*") return true;
  const num = parseInt(value);
  if (pattern.includes("/")) {
    const [, step] = pattern.split("/");
    return num % parseInt(step) === 0;
  }
  if (pattern.includes(",")) {
    return pattern.split(",").map(Number).includes(num);
  }
  if (pattern.includes("-")) {
    const [lo, hi] = pattern.split("-").map(Number);
    return num >= lo && num <= hi;
  }
  return parseInt(pattern) === num;
}

export default function CronExpressionBuilder() {
  const [values, setValues] = useState<Record<string, string>>({
    minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*",
  });
  const [expression, setExpression] = useState("0 0 * * *");
  const [jobName, setJobName] = useState("db-backup");
  const nextRuns = getNextRuns(expression);

  const updateField = (field: string, val: string) => {
    const nv = { ...values, [field]: val };
    setValues(nv);
    setExpression(`${nv.minute} ${nv.hour} ${nv.dayOfMonth} ${nv.month} ${nv.dayOfWeek}`);
  };

  const presets = [
    { label: "Every 5 min", value: "*/5 * * * *" },
    { label: "Top of the hour", value: "0 * * * *" },
    { label: "Daily Midnight", value: "0 0 * * *" },
    { label: "Mon 9:00 AM", value: "0 9 * * 1" },
    { label: "First of Month", value: "0 0 1 * *" },
    { label: "Weekdays 8 AM", value: "0 8 * * 1-5" },
  ];

  const applyPreset = (val: string) => {
    const p = val.split(/\s+/);
    const nv = { minute: p[0], hour: p[1], dayOfMonth: p[2], month: p[3], dayOfWeek: p[4] };
    setValues(nv);
    setExpression(val);
  };

  const systemdTimer = `[Unit]
Description=Run ${jobName} timer schedule
Requires=${jobName}.service

[Timer]
OnCalendar=*-*-* ${values.hour.padStart(2, "0")}:${values.minute.padStart(2, "0")}:00
Persistent=true

[Install]
WantedBy=timers.target`;

  const k8sCronJob = `apiVersion: batch/v1
kind: CronJob
metadata:
  name: ${jobName}
  namespace: production
spec:
  schedule: "${expression}"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: ${jobName}
              image: ghcr.io/org/${jobName}:latest
              resources:
                limits:
                  cpu: "500m"
                  memory: "256Mi"`;

  return (
    <ToolLayout title="Enterprise Cron & Systemd Schedule Architect" description="Design cron schedules, generate Systemd Timer units, Kubernetes CronJob specs, and calculate upcoming run times." icon="⏰">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Schedule Builder</h3>
          <label className="field-label">Cron Job Identifier</label>
          <input className="input-field" value={jobName} onChange={e => setJobName(e.target.value)} style={{ marginBottom: "1rem" }} />

          <label className="field-label">Production Presets</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {presets.map(p => (
              <button key={p.label} className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }} onClick={() => applyPreset(p.value)}>
                {p.label}
              </button>
            ))}
          </div>

          {FIELDS.map((f, i) => (
            <div key={f} style={{ marginBottom: "0.75rem" }}>
              <label className="field-label">{LABELS[i]}</label>
              <input className="input-field" value={values[f]} onChange={e => updateField(f, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Generated Production Schedules</h3>
          <label className="field-label">Cron Expression</label>
          <div className="code-output" style={{ marginBottom: "1.25rem", position: "relative", fontSize: "1.25rem", fontWeight: 900 }}>
            <CopyButton text={expression} />
            {expression}
          </div>

          <label className="field-label">Human Description</label>
          <div style={{ padding: "0.75rem", background: "#f4f4f5", border: "2px solid #000000", borderRadius: "4px", marginBottom: "1.25rem", color: "#000000", fontWeight: 800 }}>
            {describeCron(expression.split(/\s+/))}
          </div>

          <label className="field-label">Kubernetes CronJob Manifest</label>
          <div className="code-output" style={{ marginBottom: "1.25rem", position: "relative" }}>
            <CopyButton text={k8sCronJob} />
            {k8sCronJob}
          </div>

          <label className="field-label">Systemd Timer Unit (/etc/systemd/system/{jobName}.timer)</label>
          <div className="code-output" style={{ marginBottom: "1.25rem", position: "relative" }}>
            <CopyButton text={systemdTimer} />
            {systemdTimer}
          </div>

          <label className="field-label">Next Scheduled Execution Timestamps</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {nextRuns.map((r, i) => (
              <div key={i} style={{ padding: "0.4rem 0.75rem", background: "#ffffff", border: "2px solid #000000", borderRadius: "4px", fontSize: "0.85rem", color: "#000000", fontWeight: 700 }}>
                {i + 1}. {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
