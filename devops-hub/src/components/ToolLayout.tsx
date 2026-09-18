"use client";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, icon, children }: Props) {
  return (
    <div className="tool-page fade-in">
      <div className="tool-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "2rem" }}>{icon}</span>
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
