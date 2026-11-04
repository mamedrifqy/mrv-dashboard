import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { DATA_SOURCES } from "../data";

const STYLE = {
  riil: { bg: "#E3ECE5", fg: "#2C4A3A", label: "Data riil" },
  dummy: { bg: "#F6E7C8", fg: "#7A5212", label: "Data contoh" },
};

// Label kecil yang menyertai setiap angka/panel: status + dokumen sumber.
export function SourceBadge({ source, compact = false }) {
  if (!source) return null;
  const st = STYLE[source.status] || STYLE.dummy;
  const Icon = source.status === "riil" ? CheckCircle2 : AlertTriangle;
  return (
    <span
      title={`${source.dokumen}${source.asOf && source.asOf !== "—" ? ` (per ${source.asOf})` : ""}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, background: st.bg, color: st.fg, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, padding: "2px 7px", lineHeight: 1.5, verticalAlign: "middle" }}
    >
      <Icon size={11} strokeWidth={2.2} />
      {st.label}
      {!compact && source.status === "riil" && <span style={{ color: "#5C5A4E" }}>&middot; {source.dokumen}{source.asOf ? `, ${source.asOf}` : ""}</span>}
    </span>
  );
}

// Banner global: muncul bila tab yang sedang dibuka memakai data contoh.
export function DemoBanner({ sourceKeys }) {
  const dummies = sourceKeys.map((k) => [k, DATA_SOURCES[k]]).filter(([, s]) => s && s.status !== "riil");
  if (!dummies.length) return null;
  return (
    <div style={{ background: "#F6E7C8", color: "#5E3F0C", borderBottom: "1px solid #E2C88F", padding: "9px 26px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
      <AlertTriangle size={14} style={{ flex: "none", marginTop: 2 }} />
      <span>
        <strong>Mode demo.</strong> Halaman ini memuat data contoh (bukan capaian program):{" "}
        {dummies.map(([, s]) => s.dokumen).join("; ")}. Angka contoh tidak ikut dijumlahkan ke total resmi.
      </span>
    </div>
  );
}

// Badge kode QC pada baris tabel.
export function QcBadge({ codes, rules }) {
  if (!codes || !codes.length) return null;
  return (
    <span title={codes.map((c) => `${c}: ${rules[c]}`).join("\n")} style={{ marginLeft: 6, background: "#F3DCDC", color: "#8A2E2E", fontSize: 10.5, padding: "1px 5px", fontFamily: "'IBM Plex Sans', sans-serif", whiteSpace: "nowrap" }}>
      {"⚠"} {codes.join(", ")}
    </span>
  );
}
