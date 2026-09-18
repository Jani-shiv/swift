export interface ToolInfo {
  slug: string;
  name: string;
  description: string;
  category: "generator" | "calculator" | "converter" | "utility";
  icon: string;
  color: string;
  keywords: string[];
}

export const tools: ToolInfo[] = [
  {
    slug: "dockerfile-generator",
    name: "Enterprise Dockerfile Generator",
    description: "Multi-stage builds, CIS security benchmark compliance, non-root users, distroless runtimes, and healthchecks.",
    category: "generator",
    icon: "🐳",
    color: "#000000",
    keywords: ["dockerfile generator online", "multi-stage dockerfile builder", "secure dockerfile generator"],
  },
  {
    slug: "docker-compose-builder",
    name: "Production Docker Compose V2 Builder",
    description: "Compose v2 specification, resource limits (CPU/Memory), Loki/JSON logging drivers, and healthcheck dependencies.",
    category: "generator",
    icon: "🏗️",
    color: "#000000",
    keywords: ["docker compose generator", "docker-compose v2 builder", "enterprise compose generator"],
  },
  {
    slug: "kubernetes-yaml-builder",
    name: "Kubernetes Manifest Architect",
    description: "Deployments, StatefulSets, DaemonSets, ALB/NGINX Ingress, HPA v2, SecurityContext, PDB, and probes.",
    category: "generator",
    icon: "☸️",
    color: "#000000",
    keywords: ["kubernetes yaml generator", "k8s deployment builder", "hpa v2 manifest builder"],
  },
  {
    slug: "cron-expression-builder",
    name: "Enterprise Cron & Systemd Schedule Architect",
    description: "5/6-field Quartz syntax, Systemd Timer unit generator, Kubernetes CronJob spec, and next 10 run times.",
    category: "utility",
    icon: "⏰",
    color: "#000000",
    keywords: ["cron expression builder", "systemd timer generator", "k8s cronjob builder"],
  },
  {
    slug: "chmod-calculator",
    name: "Linux Permissions & ACL Security Suite",
    description: "Octal permissions (SUID/SGID/Sticky bit), POSIX ACLs (setfacl), SELinux security contexts, and umask calculator.",
    category: "calculator",
    icon: "🔐",
    color: "#000000",
    keywords: ["chmod calculator", "suid sgid sticky bit", "posix acl generator", "selinux context"],
  },
  {
    slug: "cidr-calculator",
    name: "Cloud VPC CIDR & IP Architect",
    description: "Dual IPv4/v6 subnetting, AWS/Azure/GCP internal reserved IP planner, VLSM breakdown, and BGP route masks.",
    category: "calculator",
    icon: "🌐",
    color: "#000000",
    keywords: ["cidr calculator", "cloud vpc subnet calculator", "aws vpc ip planner", "vlsm calculator"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Security Audit & Inspector",
    description: "Decode headers, payloads, signatures, claims audit (exp/nbf/iat/iss/aud), algorithm vulnerability checks, and OIDC scopes.",
    category: "utility",
    icon: "🔑",
    color: "#000000",
    keywords: ["jwt decoder online", "jwt security audit", "oidc token inspector"],
  },
  {
    slug: "base64-encoder",
    name: "Base64, Data URI & K8s Secret Encoder",
    description: "RFC 4648 Base64, Base64URL, Data URI schemes, and Kubernetes Secret manifest payload generator.",
    category: "converter",
    icon: "🔄",
    color: "#000000",
    keywords: ["base64 encode online", "base64url encoder", "kubernetes secret base64"],
  },
  {
    slug: "yaml-json-converter",
    name: "Multi-Format Config Converter (YAML/JSON/TOML)",
    description: "Convert between YAML, JSON, and TOML formats with schema validation, key collision checks, and formatting.",
    category: "converter",
    icon: "📄",
    color: "#000000",
    keywords: ["yaml to json converter", "toml to yaml", "json to toml"],
  },
  {
    slug: "regex-tester",
    name: "Log Regex & Capture Group Engine",
    description: "Regex evaluator with named capture groups, ECMAScript/Go syntax, and Nginx/Syslog/K8s JSON log presets.",
    category: "utility",
    icon: "🎯",
    color: "#000000",
    keywords: ["regex tester online", "log parser regex generator", "named capture groups regex"],
  },
  {
    slug: "password-generator",
    name: "High-Entropy Secret & API Key Generator",
    description: "Cryptographically secure API keys, 256-bit entropy passphrases, custom exclusions, and security strength meter.",
    category: "utility",
    icon: "🔒",
    color: "#000000",
    keywords: ["high entropy password generator", "api key generator", "secure secret generator"],
  },
  {
    slug: "uuid-generator",
    name: "UUID, ULID & KSUID Generator",
    description: "RFC 4122 UUID v4, Lexicographically sortable ULID, KSUID generator with bulk export (JSON/CSV).",
    category: "utility",
    icon: "🆔",
    color: "#000000",
    keywords: ["uuid generator online", "ulid generator", "ksuid generator"],
  },
  {
    slug: "diff-viewer",
    name: "Enterprise Patch & Code Diff Inspector",
    description: "Unified and split diff comparison, whitespace ignoring, line & character level diff analysis, Git patch exporter.",
    category: "utility",
    icon: "📊",
    color: "#000000",
    keywords: ["online diff tool", "git patch generator", "text compare tool"],
  },
  {
    slug: "css-gradient-generator",
    name: "Design Token & CSS Gradient Studio",
    description: "Linear and radial CSS gradients with CSS variables generator and Tailwind CSS configuration output.",
    category: "generator",
    icon: "🎨",
    color: "#000000",
    keywords: ["css gradient generator", "tailwind theme generator", "design tokens generator"],
  },
  {
    slug: "markdown-preview",
    name: "Technical Specification & Markdown Editor",
    description: "GitHub Flavored Markdown (GFM) editor with Mermaid.js diagram snippets and OpenAPI block support.",
    category: "utility",
    icon: "📝",
    color: "#000000",
    keywords: ["markdown preview online", "gfm editor", "mermaid diagram markdown editor"],
  },
  {
    slug: "terraform-builder",
    name: "Terraform Enterprise HCL Architect",
    description: "AWS VPC, EKS, EC2 ASG, S3 with KMS encryption, Security Groups, and S3 Remote Backend state locking.",
    category: "generator",
    icon: "🏛️",
    color: "#000000",
    keywords: ["terraform generator", "terraform aws builder", "terraform hcl architect"],
  },
  {
    slug: "promql-builder",
    name: "Senior PromQL & SRE Alerting Architect",
    description: "Histogram 99th percentiles, rate vector functions, subqueries, vector aggregations, and Alertmanager rules.",
    category: "utility",
    icon: "📈",
    color: "#000000",
    keywords: ["promql query builder", "histogram quantile promql", "alertmanager rule builder"],
  },
  {
    slug: "html-entity-encoder",
    name: "Security Payload & Entity Encoder",
    description: "HTML entity encoding/decoding, OWASP XSS payload sanitizer preview, and URI component encoding.",
    category: "converter",
    icon: "🏷️",
    color: "#000000",
    keywords: ["html entity encoder", "xss payload sanitizer", "uri component encoder"],
  },
  {
    slug: "json-formatter",
    name: "Enterprise JSON & JSONPath Evaluator",
    description: "Format, minify, JSONPath query evaluation (RFC 9535), schema validation, and key metrics.",
    category: "utility",
    icon: "📋",
    color: "#000000",
    keywords: ["json formatter", "jsonpath evaluator", "json schema validator"],
  },
  {
    slug: "hash-generator",
    name: "Cryptographic Hash & HMAC Suite",
    description: "MD5, SHA-1, SHA-256, SHA-384, SHA-512, SHA3, Keyed HMAC generation, and Base64/Hex encoding.",
    category: "utility",
    icon: "🛡️",
    color: "#000000",
    keywords: ["hash generator online", "sha256 hmac generator", "cryptographic hash suite"],
  },
];

export function getToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolInfo[] {
  if (category === "all") return tools;
  return tools.filter((t) => t.category === category);
}
