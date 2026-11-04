import React from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { SectionTitle } from "../components/ui";
import { EMISSION_TREND, EMISSION_YEARS } from "../data/legacy";
import { fmt1 } from "../lib/format";

// --- Pelaporan (Reporting) ----------------------------------------------------
export function ReportingView() {
  return (
    <div>
      <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 10px" }}>
        <SectionTitle>
          Tren pengurangan emisi, {EMISSION_YEARS[0]}
          {"\u2013"}
          {EMISSION_YEARS[EMISSION_YEARS.length - 1]}
        </SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={EMISSION_TREND} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
            <XAxis dataKey="tahun" tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
            <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} juta tCO\u2082e`} />
            <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
            <Line type="monotone" dataKey="baseline" stroke="#8A8677" strokeDasharray="4 3" dot={false} name="Baseline" strokeWidth={1.6} />
            <Line type="monotone" dataKey="aktual" stroke="#A23B3B" dot={{ r: 3 }} name="Capaian aktual" strokeWidth={2} />
            <Line type="monotone" dataKey="reduksi" stroke="#2C4A3A" dot={{ r: 3 }} name="Pengurangan emisi" strokeWidth={2.2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionTitle>Laporan resmi per tahun</SectionTitle>
        <div style={{ border: "1px solid #D6D2C4" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #D6D2C4" }}>
                {["Tahun laporan", "Baseline (juta tCO\u2082e)", "Capaian aktual (juta tCO\u2082e)", "Pengurangan emisi (juta tCO\u2082e)", "% tereduksi"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#5C5A4E", fontWeight: 500, fontSize: 12 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMISSION_TREND.map((r) => (
                <tr key={r.tahun} style={{ borderBottom: "1px solid #E5E2D6" }}>
                  <td style={{ padding: "10px 16px", color: "#1B2A22", fontWeight: 500 }}>{r.tahun}</td>
                  <td style={{ padding: "10px 16px", color: "#5C5A4E" }}>{fmt1(r.baseline)}</td>
                  <td style={{ padding: "10px 16px", color: "#5C5A4E" }}>{fmt1(r.aktual)}</td>
                  <td style={{ padding: "10px 16px", color: "#2C4A3A", fontWeight: 500 }}>{fmt1(r.reduksi)}</td>
                  <td style={{ padding: "10px 16px", color: "#5C5A4E" }}>{Math.round((r.reduksi / r.baseline) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677", marginTop: 10, lineHeight: 1.6 }}>
          Baseline dihitung dari tingkat rujukan emisi (FREL) per kategori dan bersifat tetap antartahun. Capaian aktual dan
          pengurangan emisi bersifat dummy untuk keperluan demonstrasi antarmuka.
        </div>
      </div>
    </div>
  );
}
