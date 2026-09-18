"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FUNCTIONS = ["histogram_quantile", "rate", "irate", "increase", "sum", "avg", "max", "min", "count", "topk", "bottomk"];
const AGGREGATIONS = ["by", "without"];

export default function PromqlBuilder() {
  const [metric, setMetric] = useState("http_request_duration_seconds_bucket");
  const [func, setFunc] = useState("histogram_quantile");
  const [range, setRange] = useState("5m");
  const [labelKey, setLabelKey] = useState("job");
  const [labelValue, setLabelValue] = useState("api-server");
  const [aggType, setAggType] = useState("by");
  const [aggLabel, setAggLabel] = useState("le, service");
  const [useAgg, setUseAgg] = useState(true);
  const [quantile, setQuantile] = useState("0.99");
  const [topN, setTopN] = useState("10");
  const [genAlertRule, setGenAlertRule] = useState(true);
  const [alertName, setAlertName] = useState("HighRequestLatencyP99");

  const generate = () => {
    let base = metric;
    if (labelKey && labelValue) base += `{${labelKey}="${labelValue}"}`;

    let query = "";
    if (func === "rate" || func === "increase" || func === "irate") {
      query = `${func}(${base}[${range}])`;
    } else if (func === "histogram_quantile") {
      query = `histogram_quantile(${quantile}, sum by (${aggLabel}) (rate(${base}[${range}])))`;
    } else if (func === "topk" || func === "bottomk") {
      query = `${func}(${topN}, ${base})`;
    } else {
      query = `${func}(${base})`;
    }

    if (useAgg && aggLabel && func !== "histogram_quantile") {
      query = `sum ${aggType} (${aggLabel}) (${query})`;
    }

    return query;
  };

  const query = generate();

  const alertRuleYaml = `groups:
  - name: SREAlertRules
    rules:
      - alert: ${alertName}
        expr: ${query} > 0.5
        for: 5m
        labels:
          severity: critical
          tier: platform
        annotations:
          summary: "High P99 latency detected on {{ $labels.service }}"
          description: "Service {{ $labels.service }} P99 latency exceeded 500ms over 5m window. Current value: {{ $value }}s"`;

  return (
    <ToolLayout title="Senior PromQL & SRE Alerting Architect" description="Construct histogram 99th percentiles, rate vectors, Prometheus PromQL expressions, and Alertmanager rules." icon="📈">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>PromQL Expression Builder</h3>
          <label className="field-label">Target Metric</label>
          <input className="input-field" value={metric} onChange={e => setMetric(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <label className="field-label">PromQL Function</label>
          <select className="select-field" value={func} onChange={e => setFunc(e.target.value)} style={{ marginBottom: "0.75rem" }}>
            {FUNCTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {(func === "rate" || func === "increase" || func === "irate" || func === "histogram_quantile") && (
            <>
              <label className="field-label">Time Vector Window</label>
              <select className="select-field" value={range} onChange={e => setRange(e.target.value)} style={{ marginBottom: "0.75rem" }}>
                {["1m", "2m", "5m", "15m", "30m", "1h"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </>
          )}

          {func === "histogram_quantile" && (
            <>
              <label className="field-label">Histogram Percentile Quantile</label>
              <select className="select-field" value={quantile} onChange={e => setQuantile(e.target.value)} style={{ marginBottom: "0.75rem" }}>
                {["0.50", "0.90", "0.95", "0.99", "0.999"].map(q => <option key={q} value={q}>{q} ({(parseFloat(q)*100).toFixed(1)}th Percentile)</option>)}
              </select>
            </>
          )}

          {(func === "topk" || func === "bottomk") && (
            <>
              <label className="field-label">Top/Bottom N Limit</label>
              <input className="input-field" type="number" value={topN} onChange={e => setTopN(e.target.value)} min={1} style={{ marginBottom: "0.75rem" }} />
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div><label className="field-label">Label Key</label><input className="input-field" value={labelKey} onChange={e => setLabelKey(e.target.value)} /></div>
            <div><label className="field-label">Label Value</label><input className="input-field" value={labelValue} onChange={e => setLabelValue(e.target.value)} /></div>
          </div>

          <div className="toggle-wrapper">
            <input type="checkbox" checked={useAgg} onChange={e => setUseAgg(e.target.checked)} id="agg" />
            <label htmlFor="agg" className="toggle-label">Include Vector Aggregation Clause</label>
          </div>

          {useAgg && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
              <div>
                <label className="field-label">Clause</label>
                <select className="select-field" value={aggType} onChange={e => setAggType(e.target.value)}>
                  {AGGREGATIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Group By Labels</label>
                <input className="input-field" value={aggLabel} onChange={e => setAggLabel(e.target.value)} />
              </div>
            </div>
          )}

          <div className="toggle-wrapper" style={{ marginTop: "1rem" }}>
            <input type="checkbox" checked={genAlertRule} onChange={e => setGenAlertRule(e.target.checked)} id="alt" />
            <label htmlFor="alt" className="toggle-label">Generate Alertmanager Rule Specification</label>
          </div>

          {genAlertRule && (
            <div style={{ marginTop: "0.5rem" }}>
              <label className="field-label">Alert Name</label>
              <input className="input-field" value={alertName} onChange={e => setAlertName(e.target.value)} />
            </div>
          )}
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>PromQL Expression</h3>
          <div className="code-output" style={{ position: "relative", fontSize: "1.05rem", fontWeight: 800, marginBottom: "1.5rem" }}>
            <CopyButton text={query} />
            {query}
          </div>

          {genAlertRule && (
            <>
              <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Prometheus Alertmanager Rule Spec</h3>
              <div className="code-output" style={{ position: "relative" }}>
                <CopyButton text={alertRuleYaml} />
                {alertRuleYaml}
              </div>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
