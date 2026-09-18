"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const PERMS = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];

function numToSymbolic(n: string): string {
  const digits = n.padStart(3, "0").slice(-3).split("").map(Number);
  if (digits.some(d => d < 0 || d > 7 || isNaN(d))) return "Invalid";
  return digits.map(d => PERMS[d]).join("");
}

export default function ChmodCalculator() {
  const [mode, setMode] = useState("755");
  const [specialMode, setSpecialMode] = useState("0");
  const [perms, setPerms] = useState([
    [true, true, true],
    [true, false, true],
    [true, false, true],
  ]);
  const [suid, setSuid] = useState(false);
  const [sgid, setSgid] = useState(false);
  const [sticky, setSticky] = useState(false);

  const updatePerms = (row: number, col: number) => {
    const np = perms.map(r => [...r]);
    np[row][col] = !np[row][col];
    setPerms(np);
    const num = np.map(r => (r[0] ? 4 : 0) + (r[1] ? 2 : 0) + (r[2] ? 1 : 0)).join("");
    setMode(num);
  };

  const handleModeChange = (val: string) => {
    setMode(val);
    if (/^[0-7]{3,4}$/.test(val)) {
      const cleanVal = val.length === 4 ? val.slice(1) : val;
      const digits = cleanVal.split("").map(Number);
      setPerms(digits.map(d => [(d & 4) > 0, (d & 2) > 0, (d & 1) > 0]));
      if (val.length === 4) {
        const spec = parseInt(val[0]);
        setSuid((spec & 4) > 0);
        setSgid((spec & 2) > 0);
        setSticky((spec & 1) > 0);
        setSpecialMode(val[0]);
      }
    }
  };

  const calcSpecialDigit = (u: boolean, g: boolean, s: boolean) => {
    return (u ? 4 : 0) + (g ? 2 : 0) + (s ? 1 : 0);
  };

  const handleSpecialChange = (u: boolean, g: boolean, s: boolean) => {
    setSuid(u); setSgid(g); setSticky(s);
    const spec = calcSpecialDigit(u, g, s);
    setSpecialMode(spec.toString());
  };

  const fullOctal = specialMode !== "0" ? `${specialMode}${mode}` : mode;
  const symbolic = numToSymbolic(mode);
  const owners = ["User (Owner)", "Group", "Others"];
  const permLabels = ["Read (4)", "Write (2)", "Execute (1)"];

  const aclCmd = `setfacl -m u:appuser:r-x /path/to/target\nsetfacl -m g:devops:rwx /path/to/target\ngetfacl /path/to/target`;
  const selinuxCmd = `chcon -t httpd_sys_content_t /path/to/target\nls -Z /path/to/target`;
  const umaskVal = (777 - parseInt(mode, 8)).toString(8).padStart(3, "0");

  return (
    <ToolLayout title="Linux Permissions & ACL Security Suite" description="Calculate 4-digit Octal permissions (SUID/SGID/Sticky bit), POSIX ACLs, SELinux contexts, and umask values." icon="🔐">
      <div className="tool-grid">
        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Permission Matrix</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem", border: "2px solid #000000" }}>
            <thead>
              <tr style={{ background: "#000000", color: "#ffffff" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.85rem", fontWeight: 800 }}>Entity</th>
                {permLabels.map(l => (
                  <th key={l} style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 800 }}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {owners.map((o, ri) => (
                <tr key={o} style={{ borderBottom: "1px solid #000000" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>{o}</td>
                  {[0, 1, 2].map(ci => (
                    <td key={ci} style={{ textAlign: "center", padding: "0.75rem" }}>
                      <input type="checkbox" checked={perms[ri][ci]} onChange={() => updatePerms(ri, ci)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{ marginBottom: "0.5rem", fontWeight: 800 }}>Special Security Flags (4-Digit Octal)</h4>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={suid} onChange={e => handleSpecialChange(e.target.checked, sgid, sticky)} id="suid" />
            <label htmlFor="suid" className="toggle-label">SUID (Set User ID - Octal 4000)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={sgid} onChange={e => handleSpecialChange(suid, e.target.checked, sticky)} id="sgid" />
            <label htmlFor="sgid" className="toggle-label">SGID (Set Group ID - Octal 2000)</label>
          </div>
          <div className="toggle-wrapper">
            <input type="checkbox" checked={sticky} onChange={e => handleSpecialChange(suid, sgid, e.target.checked)} id="sticky" />
            <label htmlFor="sticky" className="toggle-label">Sticky Bit (Restricted Delete - Octal 1000)</label>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label className="field-label">Octal Mode (3 or 4 Digits)</label>
            <input className="input-field" value={fullOctal} onChange={e => handleModeChange(e.target.value)} maxLength={4} style={{ fontSize: "1.5rem", textAlign: "center", fontWeight: 900, letterSpacing: "0.2em" }} />
          </div>
        </div>

        <div className="glass-card tool-panel">
          <h3 style={{ marginBottom: "1rem", fontWeight: 800 }}>Security & Permission Specs</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ padding: "0.75rem", background: "#f4f4f5", border: "2px solid #000000", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>Symbolic Notation</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>{symbolic}</div>
            </div>
            <div style={{ padding: "0.75rem", background: "#f4f4f5", border: "2px solid #000000", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase" }}>Umask Value</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>0{umaskVal}</div>
            </div>
          </div>

          <label className="field-label">Primary Chmod Command</label>
          <div className="code-output" style={{ position: "relative", marginBottom: "1rem" }}>
            <CopyButton text={`chmod ${fullOctal} /path/to/target`} />
            chmod {fullOctal} /path/to/target
          </div>

          <label className="field-label">POSIX Extended ACL Snippet</label>
          <div className="code-output" style={{ position: "relative", marginBottom: "1rem" }}>
            <CopyButton text={aclCmd} />
            {aclCmd}
          </div>

          <label className="field-label">SELinux Security Context Snippet</label>
          <div className="code-output" style={{ position: "relative" }}>
            <CopyButton text={selinuxCmd} />
            {selinuxCmd}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
