import React, { useState, useEffect } from "react";
import { STATUS_META } from "../constants";
import { NC1_IP_TABLE } from "../data";
import { CO2E, fmt, fmt1 } from "../lib/format";

export function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12.5,
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: meta.color,
      }}
    >
      <Icon size={13} strokeWidth={2.2} />
      {status}
    </span>
  );
}

export function KpiStrip({ sites }) {
  // PCK langsung (penanaman) dan PPCK deforestasi dipisah: keduanya beda
  // metode dan beda lapis akuntansi, sehingga tidak boleh dijumlahkan.
  const totalLuas = sites.reduce((a, s) => a + s.luas, 0);
  const pckLangsung = sites.filter((s) => s.jenisPck !== "Deforestasi").reduce((a, s) => a + (s.pck || 0), 0);
  const ppckDefor = sites.filter((s) => s.jenisPck === "Deforestasi").reduce((a, s) => a + (s.pck || 0), 0);
  const verified = sites.filter((s) => s.status === "Terverifikasi").length;
  const flagged = sites.filter((s) => s.status !== "Terverifikasi").length;

  const items = [
    { label: "Lokasi kegiatan", value: sites.length, unit: "lokasi" },
    { label: "Luas total", value: fmt(totalLuas), unit: "hektare" },
    { label: "PCK langsung (penanaman)", value: fmt(pckLangsung), unit: CO2E },
    { label: "PPCK deforestasi", value: fmt(ppckDefor), unit: CO2E },
    { label: "Terverifikasi", value: verified, unit: `dari ${sites.length}` },
    { label: "Perlu tindak lanjut", value: flagged, unit: "lokasi", warn: flagged > 0 },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid #D6D2C4", borderBottom: "1px solid #D6D2C4" }}>
      {items.map((it, i) => (
        <div key={it.label} style={{ flex: "1 1 150px", padding: "14px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 24, color: it.warn ? "#A23B3B" : "#1B2A22", lineHeight: 1.1 }}>
            {it.value}
            <span style={{ fontSize: 13, fontWeight: 400, color: "#5C5A4E", marginLeft: 6 }}>{it.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Nc1PetaKpiStrip({ ipFilter }) {
  const rows = ipFilter && ipFilter !== "Semua" ? NC1_IP_TABLE.filter((r) => r.ip === ipFilter) : NC1_IP_TABLE;
  const totalReal = rows.reduce((a, r) => a + (r.real2025 || 0), 0);
  const totalKarbon = rows.reduce((a, r) => a + (r.baru2025 || 0), 0);
  const ipCount = new Set(rows.map((r) => r.ip)).size;

  const items = [
    { label: "Entri Tabel 6.9", value: fmt(rows.length), unit: "baris" },
    { label: "Implementing Partner", value: fmt(ipCount), unit: "IP" },
    { label: "Realisasi tanam 2025", value: fmt1(totalReal), unit: "ha" },
    { label: "Potensi karbon 2025", value: fmt1(totalKarbon), unit: CO2E },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid #D6D2C4", borderBottom: "1px solid #D6D2C4" }}>
      {items.map((it, i) => (
        <div key={it.label} style={{ flex: "1 1 160px", padding: "16px 22px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 26, color: "#1B2A22", lineHeight: 1.1 }}>
            {it.value}
            <span style={{ fontSize: 13, fontWeight: 400, color: "#5C5A4E", marginLeft: 6 }}>{it.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677", marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#1B2A22", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export function Note({ children, tone }) {
  const colors = { danger: "#A23B3B", warn: "#B9791F", neutral: "#5C5A4E" };
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #D6D2C4", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, lineHeight: 1.55, color: colors[tone] }}>
      {children}
    </div>
  );
}

export function useIsNarrow(breakpoint = 780) {
  const [narrow, setNarrow] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return narrow;
}

export function titleCase(s) {
  return String(s)
    .toLowerCase()
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// --- Pengukuran (Measurement) ------------------------------------------------
export function ToggleGroup({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid #D6D2C4" }}>
      {options.map((o, i) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "7px 14px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 12.5,
            border: "none",
            borderLeft: i === 0 ? "none" : "1px solid #D6D2C4",
            background: value === o.value ? "#1B2A22" : "#fff",
            color: value === o.value ? "#EEF0E7" : "#5C5A4E",
            cursor: "pointer",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, color: "#1B2A22", marginBottom: 12 }}>{children}</div>;
}

export function Select({ label, value, onChange, options, renderLabel }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#5C5A4E" }}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, padding: "5px 8px", border: "1px solid #D6D2C4", background: "#F5F3EA", color: "#1B2A22" }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {renderLabel ? renderLabel(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}
