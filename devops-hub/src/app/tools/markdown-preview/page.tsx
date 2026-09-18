"use client";
import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { marked } from "marked";

export default function MarkdownPreview() {
  const [md, setMd] = useState(`# Welcome to Markdown Preview

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- Inline \`code\` blocks

### Code Block
\`\`\`javascript
function hello() {
  console.log("Hello, DevOps!");
}
\`\`\`

### Table
| Tool | Category |
|------|----------|
| Docker | Container |
| K8s | Orchestration |

> "The best way to predict the future is to create it." – Abraham Lincoln

### List
1. First item
2. Second item
3. Third item
`);

  const html = useMemo(() => {
    try {
      return marked(md) as string;
    } catch {
      return "<p>Error rendering markdown</p>";
    }
  }, [md]);

  return (
    <ToolLayout title="Markdown Preview" description="Write Markdown and see the rendered HTML output in real-time, side by side. Supports GFM tables, code blocks, and more." icon="📝">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Markdown Input</h3>
          <textarea className="textarea-field" value={md} onChange={e => setMd(e.target.value)} style={{ minHeight: 500 }} />
        </div>
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Preview</h3>
          <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: html }} style={{ minHeight: 500 }} />
        </div>
      </div>
    </ToolLayout>
  );
}
