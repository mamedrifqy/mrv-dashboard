import React, { useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from "recharts";
import { FileText } from "lucide-react";
import { Note, SectionTitle, ToggleGroup } from "../components/ui";
import { KARBON_CATEGORIES, PMU_META, tipeLahanToCategory } from "../constants";
import { ALL_IP_ROWS, REPORT_DATA, TREND } from "../data/legacy";
import { CO2E, fmt1 } from "../lib/format";

export function UncertaintyRow({ item }) {
  const Icon = item.icon;
  const scaleMax = item.upper * 1.15;
  const lowerPct = (item.lower / scaleMax) * 100;
  const upperPct = (item.upper / scaleMax) * 100;
  const estPct = (item.estimasi / scaleMax) * 100;
  return (
    <div style={{ padding: "14px 18px", borderTop: "1px solid #E5E2D6" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={15} color={item.color} strokeWidth={2} />
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1B2A22" }}>{item.label}</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#2C4A3A", fontWeight: 600 }}>
          {fmt1(item.estimasi)} {CO2E}
          {item.uncertaintyPct != null && <span style={{ color: "#8A8677", fontWeight: 400 }}> ({"\u00b1"}{item.uncertaintyPct}%)</span>}
        </span>
      </div>
      <div style={{ position: "relative", height: 10, background: "#EDEAD9" }}>
        <div style={{ position: "absolute", left: `${lowerPct}%`, width: `${Math.max(upperPct - lowerPct, 0.5)}%`, top: 0, bottom: 0, background: item.color, opacity: 0.35 }} />
        <div style={{ position: "absolute", left: `${estPct}%`, width: 2, top: -3, bottom: -3, background: item.color }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginTop: 4 }}>
        <span>{fmt1(item.lower)} {CO2E}</span>
        <span>{fmt1(item.upper)} {CO2E}</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginTop: 6, lineHeight: 1.5 }}>{item.status}</div>
    </div>
  );
}

// Real (non-dummy) NC-1 carbon panel, sourced from Laporan Tahunan FOLU NC-1
// TA 2025 \u2014 shown whenever the Karbon tab is scoped to PMU NC-1.
export function IpTableRow({ row, isFirstOfGroup }) {
  return (
    <tr style={{ borderTop: "1px solid #E5E2D6" }}>
      <td style={{ padding: "9px 14px", color: "#1B2A22", fontWeight: isFirstOfGroup ? 600 : 400 }}>{isFirstOfGroup ? row.ip : ""}</td>
      <td style={{ padding: "9px 14px", color: "#8A8677", fontSize: 11.5 }}>{isFirstOfGroup ? row.provinsi : ""}</td>
      <td style={{ padding: "9px 14px", color: "#5C5A4E" }}>{row.tipeLahan}</td>
      <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{row.target != null ? fmt1(row.target) : "\u2013"}</td>
      <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{row.real2024 != null ? fmt1(row.real2024) : "\u2013"}</td>
      <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{row.real2025 != null ? fmt1(row.real2025) : "\u2013"}</td>
      <td style={{ padding: "9px 14px", color: "#2C4A3A", fontWeight: 500, textAlign: "right" }}>
        {row.baru2025 != null ? fmt1(row.baru2025) : "\u2013"}
        {row.note ? <span style={{ color: "#B9791F" }}>{row.note}</span> : null}
      </td>
    </tr>
  );
}

export function IpTablePanel({ ipTable, ipTotal, hasNote }) {
  return (
    <div style={{ marginTop: 18 }}>
      <SectionTitle>Rincian per implementing partner (Tabel 6.9)</SectionTitle>
      <div style={{ border: "1px solid #D6D2C4", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, minWidth: 640 }}>
          <thead>
            <tr>
              {["Implementing Partner", "Provinsi", "Tipe Lahan", "Target (ha)", "Realisasi 2024 (ha)", "Realisasi 2025 (ha)", `Adjustment 2025 (${CO2E})`].map((h) => (
                <th key={h} style={{ textAlign: h.includes("Partner") || h.includes("Provinsi") || h.includes("Tipe") ? "left" : "right", padding: "9px 14px", color: "#5C5A4E", fontWeight: 500, fontSize: 11.5, borderBottom: "1px solid #D6D2C4" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ipTable.map((row, i) => (
              <IpTableRow key={`${row.no}-${row.tipeLahan}-${i}`} row={row} isFirstOfGroup={i === 0 || ipTable[i - 1].ip !== row.ip} />
            ))}
            <tr style={{ borderTop: "1px solid #D6D2C4", background: "#EDEAD9" }}>
              <td colSpan={3} style={{ padding: "9px 14px", color: "#1B2A22", fontWeight: 600 }}>Total</td>
              <td style={{ padding: "9px 14px", color: "#1B2A22", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.target)}</td>
              <td style={{ padding: "9px 14px", color: "#1B2A22", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.real2024)}</td>
              <td style={{ padding: "9px 14px", color: "#1B2A22", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.real2025)}</td>
              <td style={{ padding: "9px 14px", color: "#2C4A3A", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.baru2025)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {hasNote && (
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginTop: 6, lineHeight: 1.6 }}>
          * Sel Mangrove Ditjen PDASRH pada tabel sumber menampilkan nilai Alometrik Lama dan Adjustment Baru tahun 2024 yang sama
          (13.465); ditampilkan apa adanya mengikuti dokumen sumber.
          <br />
          {"\u2020"} Nilai Alometrik Lama 2025 sebesar 580,39 muncul identik pada dua baris berbeda (YBLL &ndash; Terestrial MPTS,
          dan Dishut Prov. Kalsel) pada tabel sumber; kemungkinan duplikasi pada dokumen asli. Nilai Adjustment Baru (kolom yang
          digunakan sebagai acuan utama dashboard ini) tidak terpengaruh dan telah diverifikasi cocok dengan Tabel 6.11.
        </div>
      )}
    </div>
  );
}

// Prop-driven carbon report panel. Used for NC-1 (real data from the annual
// report) and, with dummy data in the same shape, for NC-2&3 and NC-4.
export function CategoryAccumulationChart({ data, title, unitLabel }) {
  const sorted = [...data].sort((a, b) => b.total - a.total);
  const height = Math.max(160, sorted.length * 46);
  return (
    <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 14px" }}>
      <SectionTitle>{title}</SectionTitle>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 30, left: 10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" horizontal={false} />
          <XAxis type="number" tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
          <YAxis type="category" dataKey="key" width={140} tick={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, fill: "#1B2A22" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} ${unitLabel}`} />
          <Bar dataKey="total" radius={[0, 3, 3, 0]} label={{ position: "right", fontFamily: "IBM Plex Sans", fontSize: 11.5, fill: "#5C5A4E", formatter: (v) => fmt1(v) }}>
            {sorted.map((d) => (
              <Cell key={d.key} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportCarbonPanel({ data, ipFilter }) {
  const { meta, interventions, survival, methodNote, ipTable, isDummy } = data;
  const hasIpFilter = ipFilter && ipFilter !== "Semua";
  const rows = hasIpFilter ? ipTable.filter((r) => r.ip === ipFilter) : ipTable;
  const hasNote = rows.some((r) => r.note);
  const [alometrikView, setAlometrikView] = useState("total");

  const sum = (field) => rows.reduce((a, r) => a + (r[field] || 0), 0);
  const planting = {
    targetHa: sum("target"),
    realisasi2024Ha: sum("real2024"),
    realisasi2025Ha: sum("real2025"),
    pctOfTarget: sum("target") ? ((sum("real2025") / sum("target")) * 100).toFixed(1) : "0.0",
  };
  const methodComparison = [
    { tahun: 2024, alometrikLama: sum("lama2024"), adjustmentBaru: sum("baru2024") },
    { tahun: 2025, alometrikLama: sum("lama2025"), adjustmentBaru: sum("baru2025") },
  ];
  const before = methodComparison[0];
  const after = methodComparison[methodComparison.length - 1];
  const kenaikanPct = before.adjustmentBaru ? ((after.adjustmentBaru - before.adjustmentBaru) / before.adjustmentBaru) * 100 : 0;

  const perJenisComparison = KARBON_CATEGORIES.map((c) => ({
    key: c.key,
    color: c.color,
    lama2024: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.lama2024 || 0), 0),
    adjustmentBaru2024: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.baru2024 || 0), 0),
    lama2025: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.lama2025 || 0), 0),
    adjustmentBaru2025: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.baru2025 || 0), 0),
  })).filter((c) => c.lama2025 > 0 || c.adjustmentBaru2025 > 0 || c.lama2024 > 0 || c.adjustmentBaru2024 > 0);

  // With no IP filter, use the authoritative per-category uncertainty ranges
  // from Tabel 6.11. When filtered to one IP, uncertainty ranges aren't
  // available at that granularity, so show a simple computed total instead.
  const categoryTotals = KARBON_CATEGORIES.map((c) => ({
    ...c,
    total: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.baru2025 || 0), 0),
  })).filter((c) => c.total > 0);

  return (
    <div>
      <Note tone={isDummy ? "warn" : "neutral"}>
        {isDummy ? (
          <>
            Data pada panel ini adalah <strong>data dummy</strong> ({meta.asOf}), disusun dalam format yang sama dengan panel NC-1
            untuk keperluan demonstrasi antarmuka.
          </>
        ) : (
          <>
            Data pada panel ini bersumber dari <strong>{meta.title}</strong> (per {meta.asOf}), bukan data dummy.
          </>
        )}
        {hasIpFilter && (
          <>
            {" "}Ditampilkan hanya untuk <strong>{ipFilter}</strong>. Pilih "Semua IP" untuk melihat ringkasan penuh.
          </>
        )}
      </Note>

      <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginTop: 16 }}>
        {[
          { label: "Realisasi tanam 2025", value: fmt1(planting.realisasi2025Ha), unit: "ha" },
          { label: "% dari target", value: `${planting.pctOfTarget}%`, unit: `dari ${fmt1(planting.targetHa)} ha` },
          { label: "Potensi karbon 2025 (adjustment)", value: fmt1(after.adjustmentBaru), unit: CO2E, accent: true },
          { label: "Kenaikan vs. 2024", value: `${kenaikanPct >= 0 ? "+" : ""}${kenaikanPct.toFixed(1)}%`, unit: "adjustment baru" },
        ].map((it, i) => (
          <div key={it.label} style={{ flex: "1 1 190px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 22, color: it.accent ? "#2C4A3A" : "#1B2A22", lineHeight: 1.15 }}>
              {it.value}
              <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {before.alometrikLama === 0 && after.alometrikLama === 0 ? (
        <div style={{ border: "1px solid #D6D2C4", borderTop: "none", padding: "16px 22px" }}>
          <Note tone="neutral">
            Perbandingan alometrik lama vs. adjustment tidak tersedia untuk PMU ini: dokumen sumber hanya melaporkan PCK hasil
            alometrik yang memakai diameter pangkal dan tinggi semai.
          </Note>
        </div>
      ) : (
      <div style={{ border: "1px solid #D6D2C4", borderTop: "none", padding: "20px 22px 10px", marginTop: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <SectionTitle>Alometrik lama vs. adjustment alometrik baru</SectionTitle>
          <ToggleGroup
            value={alometrikView}
            onChange={setAlometrikView}
            options={[
              { value: "total", label: "Total" },
              { value: "perjenis", label: "Per jenis lahan" },
            ]}
          />
        </div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#8A8677", marginTop: -8, marginBottom: 8 }}>
          Adjustment menggunakan persamaan untuk tanaman muda (Adinugroho et al., 2023), mengoreksi estimasi {after.tahun} dari{" "}
          {fmt1(after.alometrikLama)} menjadi {fmt1(after.adjustmentBaru)} {CO2E} agar tidak overclaim biomassa tanaman muda.
        </div>
        {alometrikView === "total" ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={methodComparison} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
              <XAxis dataKey="tahun" tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
              <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} ${CO2E}`} />
              <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
              <Bar dataKey="alometrikLama" name="Alometrik lama" fill="#8A8677" />
              <Bar dataKey="adjustmentBaru" name="Adjustment baru" fill="#2C4A3A" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={perJenisComparison} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
              <XAxis dataKey="key" tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} interval={0} angle={-10} textAnchor="end" height={55} />
              <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} ${CO2E}`} />
              <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
              <Bar dataKey="lama2025" name={`Alometrik lama ${after.tahun}`} fill="#8A8677" />
              <Bar dataKey="adjustmentBaru2025" name={`Adjustment baru ${after.tahun}`} fill="#2C4A3A" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      )}

      <div style={{ marginTop: 18 }}>
        <CategoryAccumulationChart
          data={categoryTotals}
          title={`Akumulasi potensi karbon per jenis intervensi (${after.tahun})`}
          unitLabel={CO2E}
        />
      </div>

      {!hasIpFilter ? (
        <div style={{ marginTop: 18 }}>
          <SectionTitle>Estimasi & rentang uncertainty per jenis intervensi ({after.tahun})</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {interventions.map((item) => (
              <UncertaintyRow key={item.key} item={item} />
            ))}
            <div style={{ padding: "14px 18px", borderTop: "1px solid #D6D2C4", background: "#EDEAD9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1B2A22" }}>Total</span>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#2C4A3A", fontWeight: 600 }}>
                  {fmt1(data.total.estimasi)} {CO2E} <span style={{ color: "#8A8677", fontWeight: 400 }}>({"\u00b1"}{data.total.uncertaintyPct}% indikatif)</span>
                </span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginTop: 4 }}>
                Rentang {fmt1(data.total.lower)}{"\u2013"}{fmt1(data.total.upper)} {CO2E}. Estimasi awal; belum menjadi klaim karbon final.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677" }}>
          Rentang uncertainty (Tabel 6.11) hanya tersedia pada level agregat seluruh IP, sehingga tidak ditampilkan saat difilter
          per-IP.
        </div>
      )}

      <IpTablePanel ipTable={rows} ipTotal={{ target: sum("target"), real2024: sum("real2024"), real2025: sum("real2025"), baru2025: sum("baru2025") }} hasNote={hasNote} />

      {!hasIpFilter && (
        <div style={{ marginTop: 18 }}>
          <SectionTitle>Survival rate yang dilaporkan</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {survival.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6" }}>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#1B2A22" }}>{s.label}</span>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: s.value < 70 ? "#B9791F" : "#2C4A3A" }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start", border: "1px solid #D6D2C4", padding: "14px 18px" }}>
        <FileText size={16} color="#5C5A4E" style={{ flex: "none", marginTop: 2 }} />
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", lineHeight: 1.6 }}>{methodNote}</div>
      </div>
    </div>
  );
}

export function CarbonView({ sites, pmuFilter, ipFilter }) {
  if (REPORT_DATA[pmuFilter]) {
    return <ReportCarbonPanel data={REPORT_DATA[pmuFilter]} ipFilter={ipFilter} />;
  }

  const rows = !ipFilter || ipFilter === "Semua" ? ALL_IP_ROWS : ALL_IP_ROWS.filter((r) => r.ip === ipFilter);

  const byPmuCategory = Object.keys(PMU_META).map((pmu) => {
    const row = { pmu: PMU_META[pmu].label };
    KARBON_CATEGORIES.forEach((c) => {
      row[c.key] = rows.filter((r) => r.pmu === pmu && tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.baru2025 || 0), 0);
    });
    return row;
  });

  const categoryTotals = KARBON_CATEGORIES.map((c) => ({
    ...c,
    total: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.baru2025 || 0), 0),
  }));
  const grandTotal = categoryTotals.reduce((a, r) => a + r.total, 0);
  const nonZeroCategories = categoryTotals.filter((c) => c.total > 0);

  return (
    <div>
      <Note tone="neutral">
        Ringkasan ini disusun dari data per implementing partner (IP) dan dikelompokkan ke 5 jenis intervensi yang sama seperti
        laporan resmi NC-1. Untuk NC-1, angka di sini konsisten dengan panel per-PMU (adjustment 2025); untuk NC-2&3 dan NC-4,
        angkanya masih <strong>data dummy</strong>. Gunakan filter IP di atas untuk melihat satu implementing partner saja.
      </Note>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, border: "1px solid #D6D2C4", borderBottom: "none", marginTop: 16 }}>
        {categoryTotals.map((r, i) => {
          const pct = grandTotal ? Math.round((r.total / grandTotal) * 100) : 0;
          return (
            <div key={r.key} style={{ flex: "1 1 150px", padding: "16px 18px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <span style={{ width: 9, height: 9, background: r.color, display: "inline-block" }} />
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E" }}>{r.key}</span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 20, color: "#1B2A22" }}>
                {fmt1(r.total)}
                <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{CO2E}</span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677", marginTop: 2 }}>{pct}% dari total</div>
            </div>
          );
        })}
      </div>

      <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 10px" }}>
        <SectionTitle>Potensi karbon 2025 per PMU, menurut jenis intervensi</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byPmuCategory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
            <XAxis dataKey="pmu" tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
            <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={55} />
            <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} ${CO2E}`} />
            <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
            {KARBON_CATEGORIES.map((c) => (
              <Bar key={c.key} dataKey={c.key} stackId="a" fill={c.color} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 18 }}>
        <CategoryAccumulationChart data={nonZeroCategories} title="Akumulasi potensi karbon per jenis intervensi (2025)" unitLabel={CO2E} />
      </div>

      <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 10px", marginTop: 18 }}>
        <SectionTitle>Proyeksi menuju net sink 2030</SectionTitle>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#8A8677", marginTop: -8, marginBottom: 8 }}>
          Nilai negatif menunjukkan penyerapan bersih (juta {CO2E}). Target program: net sink {"\u2212"}140 juta {CO2E} pada 2030.
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={TREND} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
            <XAxis dataKey="tahun" tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
            <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} />
            <ReferenceLine y={0} stroke="#8A8677" />
            <Line type="monotone" dataKey="target" stroke="#8A8677" strokeDasharray="4 3" dot={false} name="Target program" strokeWidth={1.6} />
            <Line type="monotone" dataKey="capaian" stroke="#2C4A3A" dot={{ r: 3 }} name="Capaian terverifikasi" strokeWidth={2.2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionTitle>Rincian per implementing partner</SectionTitle>
        <IpTablePanel
          ipTable={rows}
          ipTotal={{
            target: rows.reduce((a, r) => a + (r.target || 0), 0),
            real2024: rows.reduce((a, r) => a + (r.real2024 || 0), 0),
            real2025: rows.reduce((a, r) => a + (r.real2025 || 0), 0),
            baru2025: rows.reduce((a, r) => a + (r.baru2025 || 0), 0),
          }}
          hasNote={false}
        />
      </div>
    </div>
  );
}
