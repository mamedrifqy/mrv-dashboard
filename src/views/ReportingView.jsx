import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Note, SectionTitle } from "../components/ui";
import { SourceBadge } from "../components/SourceBadge";
import { NATIONAL, REPORT_DATA, DATA_SOURCES } from "../data";
import { fmt1 } from "../lib/format";

const td = { padding: "10px 16px", color: "#5C5A4E" };
const th = { textAlign: "left", padding: "10px 16px", color: "#5C5A4E", fontWeight: 500, fontSize: 12 };

// Lapis A — kinerja pengurangan emisi tingkat nasional (konteks RBC).
// Sengaja dipisah dari PCK tingkat tapak (Lapis B, tab Karbon): skala
// keduanya berbeda sekitar empat orde besaran dan tidak boleh dijumlahkan.
export function ReportingView() {
  const { baseline, kontribusi, endc, netSink2030 } = NATIONAL;
  const latest = kontribusi[kontribusi.length - 1];
  const nc1 = REPORT_DATA["NC-1"].total.estimasi;
  const shareNc1 = (nc1 / (latest.erJutaTco2e * 1e6)) * 100;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
        <SectionTitle>Lapis A &mdash; Kinerja pengurangan emisi nasional (konteks RBC)</SectionTitle>
        <SourceBadge source={DATA_SOURCES.national} compact />
      </div>
      <Note tone="neutral">
        Pengurangan emisi (ER) dihitung di tingkat nasional sebagai <strong>baseline &minus; emisi aktual</strong> dari deforestasi dan
        degradasi hutan, memakai data tutupan lahan SIMONTANA dan faktor emisi FREL (NFI). Nilai ini adalah dasar kontribusi
        berbasis hasil (RBC) Norwegia, bukan hasil penjumlahan kegiatan PMU/IP.
      </Note>

      <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginTop: 16 }}>
        {[
          { label: `Baseline (${baseline.periode})`, value: fmt1(baseline.nilai), unit: "juta tCO₂e/tahun" },
          { label: `Kontribusi RBC terbaru (${latest.periode})`, value: fmt1(latest.erJutaTco2e), unit: "juta tCO₂e", accent: true },
          { label: "Target emisi kehutanan 2030 (ENDC CM1)", value: fmt1(endc.targetEmisi2030CM1), unit: "juta tCO₂e" },
          { label: "Target net sink FOLU 2030", value: fmt1(netSink2030.nilai), unit: "juta tCO₂e" },
        ].map((it, i) => (
          <div key={it.label} style={{ flex: "1 1 200px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
            <div style={{ fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
            <div style={{ fontWeight: 600, fontSize: 22, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
              {it.value}
              <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #D6D2C4", borderTop: "none", padding: "20px 22px 10px" }}>
        <SectionTitle>Pengurangan emisi terverifikasi per periode RBC (juta tCO&#8322;e)</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={kontribusi} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
            <XAxis dataKey="periode" tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
            <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} juta tCO₂e`} />
            <Bar dataKey="erJutaTco2e" name="Pengurangan emisi" fill="#2C4A3A">
              <LabelList dataKey="erJutaTco2e" position="top" formatter={(v) => fmt1(v)} style={{ fontFamily: "IBM Plex Sans", fontSize: 11.5, fill: "#1B2A22" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ border: "1px solid #D6D2C4", marginTop: 18 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #D6D2C4" }}>
              {["Periode", "Pengurangan emisi (juta tCO₂e)", "Nilai kontribusi", "Keterangan", "Sumber"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kontribusi.map((r) => (
              <tr key={r.periode} style={{ borderBottom: "1px solid #E5E2D6" }}>
                <td style={{ ...td, color: "#1B2A22", fontWeight: 500 }}>{r.periode}</td>
                <td style={{ ...td, color: "#2C4A3A", fontWeight: 500 }}>{fmt1(r.erJutaTco2e)}</td>
                <td style={td}>{r.usdJuta != null ? `USD ${fmt1(r.usdJuta)} juta` : "–"}</td>
                <td style={td}>{r.keterangan}</td>
                <td style={{ ...td, fontSize: 11.5, color: "#8A8677" }}>{r.sumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionTitle>Target sektor kehutanan dalam Enhanced NDC</SectionTitle>
        <div style={{ border: "1px solid #D6D2C4" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #D6D2C4" }}>
                {["Skenario", "Emisi 2030 (juta tCO₂e)", "Target pengurangan terhadap BAU (juta tCO₂e)"].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #E5E2D6" }}>
                <td style={td}>BAU</td>
                <td style={td}>{fmt1(endc.bauEmisi2030)} (dari {fmt1(endc.bauEmisi2021)} pada 2021)</td>
                <td style={td}>&ndash;</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #E5E2D6" }}>
                <td style={td}>CM1 (unconditional)</td>
                <td style={td}>{fmt1(endc.targetEmisi2030CM1)}</td>
                <td style={{ ...td, color: "#2C4A3A", fontWeight: 500 }}>{fmt1(endc.targetPenurunanCM1)}</td>
              </tr>
              <tr>
                <td style={td}>CM2 (conditional)</td>
                <td style={td}>{fmt1(endc.targetEmisi2030CM2)}</td>
                <td style={{ ...td, color: "#2C4A3A", fontWeight: 500 }}>{fmt1(endc.targetPenurunanCM2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11.5, color: "#8A8677", marginTop: 8, lineHeight: 1.6 }}>
          Sumber: {endc.sumber}. Baseline RBC: {baseline.keterangan}. Target net sink: {netSink2030.sumber}.
        </div>
      </div>

      <Note tone="neutral">
        <strong>Perbandingan skala.</strong> Potensi PCK NC-1 TA 2025 ({fmt1(nc1)} tCO&#8322;e, tab Karbon) setara{" "}
        {shareNc1.toFixed(3).replace(".", ",")}% dari pengurangan emisi nasional periode {latest.periode}. Karena itu kedua angka
        ditampilkan pada halaman terpisah dan tidak dijumlahkan.
      </Note>
    </div>
  );
}
