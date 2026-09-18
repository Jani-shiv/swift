# ⚡ InfraForge — Enterprise DevOps & Cloud Utility Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-black?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Design System](https://img.shields.io/badge/UI-Neo--Brutalist-black.svg?style=for-the-badge)](#design-system)

> **InfraForge** is an open-source, privacy-first web portal of 20+ enterprise-grade automated tools, calculators, and architecture generators built for DevOps Engineers, Site Reliability Engineers (SREs), and Cloud Architects.

---

## 🌟 Key Highlights

- 🔒 **100% Client-Side & Private**: All calculations, conversions, and manifest generators run entirely in your browser. No data ever leaves your local machine.
- 🎨 **Black & White Neo-Brutalist Design**: High-contrast, stark brutalist aesthetic engineered for clarity, speed, and developer focus.
- ⚡ **Instant Execution**: Zero API latency or backend wait times — interactive tools process configs in milliseconds.
- 🛡️ **Enterprise & CIS Benchmark Standards**: Hardened Dockerfiles, K8s SecurityContexts (`runAsNonRoot`, `readOnlyRootFilesystem`), S3 KMS remote state locking, HPA v2, and PromQL Alertmanager rules.
- 🆓 **100% Free & Open Source**: No paywalls, no tracking scripts, no signups required.

---

## 🛠️ Tool Suite & Architecture Matrix

### 🐳 Container & Orchestration
| Tool | Description |
| :--- | :--- |
| **Enterprise Dockerfile Architect** | CIS compliant multi-stage Dockerfiles with distroless runtimes, non-root users (`UID 10001`), OCI labels, and healthchecks. |
| **Production Docker Compose V2 Builder** | Compose v2 specs with CPU/Memory resource limits, Loki/JSON logging drivers, and service healthcheck dependencies. |
| **Kubernetes Manifest Architect** | K8s Deployments, StatefulSets, DaemonSets, ALB/NGINX Ingress, HPA v2, SecurityContexts, PDB, and probes. |

### 🏛️ Cloud Infrastructure & Observability
| Tool | Description |
| :--- | :--- |
| **Terraform Enterprise HCL Architect** | AWS VPC, EKS, EC2 ASG, S3 with KMS encryption, Security Groups, and S3 Remote Backend state locking with DynamoDB. |
| **Cloud VPC CIDR & IP Architect** | Dual IPv4/v6 subnetting, AWS/GCP/Azure internal reserved IP breakdown (`.0`, `.1`, `.2`, `.3`, `.255`), and subnet planning. |
| **Senior PromQL & SRE Alerting Architect** | Histogram 99th percentiles (`histogram_quantile`), rate vectors, PromQL aggregations, and Alertmanager rules. |

### 🔐 Security & System Permissions
| Tool | Description |
| :--- | :--- |
| **Linux Permissions & ACL Security Suite** | 4-digit Octal permissions (SUID `4000`, SGID `2000`, Sticky bit `1000`), POSIX ACLs (`setfacl`), SELinux contexts, and `umask`. |
| **JWT Security Audit & Inspector** | Decode headers, payloads, signatures, claims audit (`exp`, `nbf`, `iat`, `iss`, `aud`), algorithm vulnerability checks, and OIDC scopes. |
| **High-Entropy Secret & API Key Generator** | Cryptographically secure API keys, 256-bit entropy passphrases, custom exclusions, and security strength meter. |
| **Security Payload & Entity Encoder** | HTML entity encoding/decoding, OWASP XSS payload sanitizer preview, and URI component encoding. |
| **Cryptographic Hash & HMAC Suite** | MD5, SHA-1, SHA-256, SHA-384, SHA-512, SHA3, Keyed HMAC generation, and Base64/Hex encoding. |

### 📄 Formatters, Converters & Utilities
| Tool | Description |
| :--- | :--- |
| **Multi-Format Config Converter** | Convert between YAML, JSON, and TOML formats with schema validation, key collision checks, and formatting. |
| **Enterprise JSON & JSONPath Evaluator** | Format, minify, JSONPath query evaluation (RFC 9535), schema validation, and key metrics. |
| **Base64, Data URI & K8s Secret Encoder** | RFC 4648 Base64, Base64URL, Data URI schemes, and Kubernetes Secret manifest payload generator. |
| **Log Regex & Capture Group Engine** | Regex evaluator with named capture groups, ECMAScript/Go syntax, and Nginx/Syslog/K8s JSON log presets. |
| **Enterprise Patch & Code Diff Inspector** | Unified and split diff comparison, whitespace ignoring, line & character level diff analysis, Git patch exporter. |
| **Enterprise Cron & Systemd Schedule Architect** | 5/6-field Quartz syntax, Systemd Timer unit generator (`.timer` + `.service`), Kubernetes CronJob specs, and next run times. |
| **UUID, ULID & KSUID Generator** | RFC 4122 UUID v4, Lexicographically sortable ULID, KSUID generator with bulk export (JSON/CSV). |
| **Design Token & CSS Gradient Studio** | Linear and radial CSS gradients with CSS variables generator and Tailwind CSS configuration output. |
| **Technical Specification & Markdown Editor** | GitHub Flavored Markdown (GFM) editor with Mermaid.js diagram snippets and OpenAPI block support. |

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Jani-shiv/swift.git
cd swift

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the portal.

### Production Build

```bash
# Build optimized static production bundle
npm run build

# Start production server
npm run start
```

---

## 🏗️ Repository Architecture

```
swift/
├── src/
│   ├── app/
│   │   ├── globals.css                # Black & White Neo-Brutalist Design System
│   │   ├── layout.tsx                 # Root Layout & Metadata
│   │   ├── page.tsx                   # Homepage & Tool Matrix
│   │   └── tools/                     # Interactive Tool Pages (20 Pages)
│   │       ├── dockerfile-generator/
│   │       ├── kubernetes-yaml-builder/
│   │       ├── terraform-builder/
│   │       ├── cidr-calculator/
│   │       ├── chmod-calculator/
│   │       ├── cron-expression-builder/
│   │       ├── promql-builder/
│   │       ├── jwt-decoder/
│   │       └── ...
│   ├── components/                    # Reusable Neo-Brutalist Components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CopyButton.tsx
│   │   └── ToolLayout.tsx
│   └── data/
│       └── tools.ts                   # Centralized Tool Metadata Registry
├── public/                            # Static Icons & Web Assets
├── next.config.ts                     # Next.js Configuration
├── tsconfig.json                      # TypeScript Configuration
├── package.json                       # Dependencies & Scripts
└── README.md                          # Open Source Documentation
```

---

## 🎨 Design System: Black & White Neo-Brutalism

InfraForge uses an exclusive **Black & White Neo-Brutalist (Neobrutalism)** aesthetic:
- **Borders**: Thick `3px solid #000000` boundaries on all containers, buttons, and inputs.
- **Shadows**: Sharp, non-blurred offset box-shadows (`4px 4px 0px #000000` & `6px 6px 0px #000000`).
- **Typography**: Heavy weight, high-contrast black typography (`font-weight: 900`).
- **Background**: Pure stark white (`#ffffff`) with subtle 24px geometric grid lines.

---

## 🤝 Contributing

Contributions are warmly welcome! If you'd like to add a new DevOps utility or improve an existing architect tool:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-tool`)
3. Commit your Changes (`git commit -m 'feat: add amazing tool'`)
4. Push to the Branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

---

## 👤 Author & Maintainer

Designed and built with ❤️ by **Shiv Jani**.

- **LinkedIn**: [Shiv Jani (shiv-jani)](https://www.linkedin.com/in/shiv-jani)
- **GitHub**: [@Jani-shiv](https://github.com/Jani-shiv)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Free to use for personal, educational, and commercial projects.
