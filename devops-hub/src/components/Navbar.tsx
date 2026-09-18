"use client";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "All Tools", href: "/tools" },
  { name: "Calculators", href: "/tools#calculators" },
  { name: "Generators", href: "/tools#generators" },
  { name: "Converters", href: "/tools#converters" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav-main">
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "1.25rem",
              background: "#000000",
              color: "#ffffff",
              padding: "0.2rem 0.5rem",
              border: "2px solid #000000",
              fontWeight: 900,
              boxShadow: "2px 2px 0px #000000",
            }}
          >
            ⚡ IF
          </span>
          <span
            style={{
              fontWeight: 900,
              fontSize: "1.35rem",
              color: "#000000",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            InfraForge
          </span>
        </Link>

        <button
          className="mobile-nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          style={{
            border: "2px solid #000000",
            boxShadow: "2px 2px 0px #000000",
            background: "#ffffff",
            padding: "0.25rem 0.6rem",
            fontWeight: 800,
          }}
        >
          {open ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
