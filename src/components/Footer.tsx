export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ marginBottom: "0.5rem", fontWeight: 800, fontSize: "1.1rem" }}>
          InfraForge — Free DevOps Tools &amp; Calculators
        </p>
        <p style={{ fontWeight: 600, margin: "0.5rem 0" }}>
          Made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/shiv-jani"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#000000",
              fontWeight: 800,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Shiv Jani (shiv-jani)
          </a>{" "}
          for DevOps engineers. All tools run in your browser — no data leaves your machine.
        </p>
        <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", fontWeight: 700 }}>
          © {new Date().getFullYear()} InfraForge. Open Source.
        </p>
      </div>
    </footer>
  );
}
