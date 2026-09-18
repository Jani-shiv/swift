"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function KubernetesYamlBuilder() {
  const [appName, setAppName] = useState("api-service");
  const [image, setImage] = useState("ghcr.io/org/api-service:v1.4.0");
  const [replicas, setReplicas] = useState(3);
  const [containerPort, setContainerPort] = useState(8080);
  const [servicePort, setServicePort] = useState(80);
  const [namespace, setNamespace] = useState("production");
  const [cpuReq, setCpuReq] = useState("250m");
  const [memReq, setMemReq] = useState("256Mi");
  const [cpuLim, setCpuLim] = useState("1000m");
  const [memLim, setMemLim] = useState("512Mi");
  const [serviceType, setServiceType] = useState("ClusterIP");
  const [genIngress, setGenIngress] = useState(true);
  const [ingressHost, setIngressHost] = useState("api.production.internal");
  const [envVars, setEnvVars] = useState("NODE_ENV=production, LOG_LEVEL=info");
  const [secContext, setSecContext] = useState(true);
  const [genHpa, setGenHpa] = useState(true);
  const [genPdb, setGenPdb] = useState(true);

  const generate = () => {
    let y = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: ${appName}
    app.kubernetes.io/instance: ${appName}-prod
    app.kubernetes.io/managed-by: helm
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:`;

    if (secContext) {
      y += `\n      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault`;
    }

    y += `\n      containers:
        - name: ${appName}
          image: ${image}
          imagePullPolicy: IfNotPresent`;

    if (secContext) {
      y += `\n          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL`;
    }

    y += `\n          ports:
            - containerPort: ${containerPort}
              name: http
          resources:
            requests:
              cpu: "${cpuReq}"
              memory: "${memReq}"
            limits:
              cpu: "${cpuLim}"
              memory: "${memLim}"`;

    if (envVars.trim()) {
      y += `\n          env:`;
      envVars.split(",").map(e => e.trim()).filter(Boolean).forEach(e => {
        const [k, v] = e.split("=");
        y += `\n            - name: ${k?.trim() || "KEY"}\n              value: "${v?.trim() || "value"}"`;
      });
    }

    y += `\n          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 15
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 2
            failureThreshold: 2
          startupProbe:
            httpGet:
              path: /healthz
              port: http
            failureThreshold: 30
            periodSeconds: 10`;

    y += `\n---
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-svc
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: ${appName}
spec:
  type: ${serviceType}
  selector:
    app: ${appName}
  ports:
    - protocol: TCP
      port: ${servicePort}
      targetPort: http
      name: http`;

    if (genIngress) {
      y += `\n---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${appName}-ingress
  namespace: ${namespace}
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/backend-protocol: HTTP
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - ${ingressHost}
      secretName: ${appName}-tls-cert
  rules:
    - host: ${ingressHost}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${appName}-svc
                port:
                  name: http`;
    }

    if (genHpa) {
      y += `\n---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${appName}-hpa
  namespace: ${namespace}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${appName}
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80`;
    }

    if (genPdb) {
      y += `\n---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ${appName}-pdb
  namespace: ${namespace}
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: ${appName}`;
    }

    return y;
  };

  const output = generate();

  return (
    <ToolLayout title="Kubernetes Manifest Architect" description="Generate enterprise-grade K8s Deployment, SecurityContext (CIS Benchmark), Ingress, HPA v2, PDB, and probes." icon="☸️">
      <div className="tool-grid">
        <div className="glass-card tool-panel" style={{ maxHeight: "82vh", overflowY: "auto" }}>
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Enterprise Specs</h3>
          <label className="field-label">App Name</label>
          <input className="input-field" value={appName} onChange={e => setAppName(e.target.value)} style={{ marginBottom: "0.75rem" }} />
          <label className="field-label">Container Image (OCI)</label>
          <input className="input-field" value={image} onChange={e => setImage(e.target.value)} style={{ marginBottom: "0.75rem" }} />
          <label className="field-label">Target Namespace</label>
          <input className="input-field" value={namespace} onChange={e => setNamespace(e.target.value)} style={{ marginBottom: "0.75rem" }} />
          <label className="field-label">Base Replicas</label>
          <input className="input-field" type="number" value={replicas} onChange={e => setReplicas(Number(e.target.value))} min={1} style={{ marginBottom: "0.75rem" }} />
          <label className="field-label">Container Port</label>
          <input className="input-field" type="number" value={containerPort} onChange={e => setContainerPort(Number(e.target.value))} style={{ marginBottom: "0.75rem" }} />
          <label className="field-label">Service Port</label>
          <input className="input-field" type="number" value={servicePort} onChange={e => setServicePort(Number(e.target.value))} style={{ marginBottom: "0.75rem" }} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div><label className="field-label">CPU Request</label><input className="input-field" value={cpuReq} onChange={e => setCpuReq(e.target.value)} /></div>
            <div><label className="field-label">CPU Limit</label><input className="input-field" value={cpuLim} onChange={e => setCpuLim(e.target.value)} /></div>
            <div><label className="field-label">Memory Request</label><input className="input-field" value={memReq} onChange={e => setMemReq(e.target.value)} /></div>
            <div><label className="field-label">Memory Limit</label><input className="input-field" value={memLim} onChange={e => setMemLim(e.target.value)} /></div>
          </div>

          <label className="field-label">Service Type</label>
          <select className="select-field" value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ marginBottom: "0.75rem" }}>
            <option>ClusterIP</option><option>NodePort</option><option>LoadBalancer</option>
          </select>

          <label className="field-label">Env Vars (KEY=val, comma-separated)</label>
          <input className="input-field" value={envVars} onChange={e => setEnvVars(e.target.value)} style={{ marginBottom: "0.75rem" }} />

          <div className="toggle-wrapper">
            <input type="checkbox" checked={secContext} onChange={e => setSecContext(e.target.checked)} id="sec" />
            <label htmlFor="sec" className="toggle-label">CIS SecurityContext (Non-root, read-only FS, drop ALL caps)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={genHpa} onChange={e => setGenHpa(e.target.checked)} id="hpa" />
            <label htmlFor="hpa" className="toggle-label">Include HorizontalPodAutoscaler (HPA v2)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={genPdb} onChange={e => setGenPdb(e.target.checked)} id="pdb" />
            <label htmlFor="pdb" className="toggle-label">Include PodDisruptionBudget (PDB)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={genIngress} onChange={e => setGenIngress(e.target.checked)} id="ingress" />
            <label htmlFor="ingress" className="toggle-label">Include Ingress Manifest with Cert-Manager Annotations</label>
          </div>

          {genIngress && (
            <div style={{ marginTop: "0.5rem" }}>
              <label className="field-label">Ingress Host FQDN</label>
              <input className="input-field" value={ingressHost} onChange={e => setIngressHost(e.target.value)} />
            </div>
          )}
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Production Kubernetes YAML Manifests</h3>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={output} />
            {output}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
