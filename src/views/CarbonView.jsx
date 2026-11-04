import React, { useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileText } from "lucide-react";
import { Note, SectionTitle, ToggleGroup } from "../components/ui";
import { SourceBadge, QcBadge } from "../components/SourceBadge";
import { KARBON_CATEGORIES, PMU_META, tipeLahanToCategory } from "../constants";
import { ALL_IP_ROWS, REAL_IP_ROWS, REPORT_DATA, DUMMY_PMUS } from "../data";
import { CO2E, fmt1 } from "../lib/format";
import { claimable, QC_RULES, intensity, BUFFER_TABLE } from "../lib/carbon";
import { qcFor } from "../data/qc";

// QC-02: jumlah baris vs total resmi dokumen (saat ini hanya NC-2&3 yang
// melaporkan total resmi terpisah per tipe lahan).
function panelLevelQc(data) {
  const out = [];
  const off = data.officialTotal;
  if (!off) return out;
  const sumCat = (cat) => data.ipTable.filter((r) => tipeLahanToCategory(r.tipeLahan) === cat).reduce((a, r) => a + (r.baru2025 || 0), 0);
  [["Terestrial", off.terestrial], ["Mangrove", off.mangrove]].forEach(([cat, official]) => {
    if (official == null) return;
    const s = sumCat(cat);
    if (Math.abs(s - official) > 0.5) out.push(`QC-02 ${cat}: jumlah baris IP ${fmt1(s)} ${CO2E} ≠ total resmi ${fmt1(official)} ${CO2E}.`);
  });
  return out;
}

const cell = { padding: "9px 14px" };

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
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1B2A22" }}>{item.label}</span>
        </div>
        <span style={{ fontSize: 13, color: "#2C4A3A", fontWeight: 600 }}>
          {fmt1(item.estimasi)} {CO2E}
          {item.uncertaintyPct != null ? (
            <span style={{ color: "#8A8677", fontWeight: 400 }}> ({"±"}{item.uncertaintyPct}%)</span>
          ) : (
            <span style={{ color: "#B9791F", fontWeight: 400 }}> (uncertainty belum dilaporkan)</span>
          )}
        </span>
      </div>
      {item.uncertaintyPct != null && (
        <>
          <div style={{ position: "relative", height: 10, background: "#EDEAD9" }}>
            <div style={{ position: "absolute", left: `${lowerPct}%`, width: `${Math.max(upperPct - lowerPct, 0.5)}%`, top: 0, bottom: 0, background: item.color, opacity: 0.35 }} />
            <div style={{ position: "absolute", left: `${estPct}%`, width: 2, top: -3, bottom: -3, background: item.color }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A8677", marginTop: 4 }}>
            <span>{fmt1(item.lower)} {CO2E}</span>
            <span>{fmt1(item.upper)} {CO2E}</span>
          </div>
        </>
      )}
      <div style={{ fontSize: 12, color: "#5C5A4E", marginTop: 6, lineHeight: 1.5 }}>{item.status}</div>
    </div>
  );
}

export function IpTableRow({ row, isFirstOfGroup, qc, showPmu }) {
  const iv = intensity(row);
  return (
    <tr style={{ borderTop: "1px solid #E5E2D6", background: row.isDummy ? "#FBF4E4" : undefined }}>
      {showPmu && <td style={{ ...cell, color: "#8A8677", fontSize: 11.5 }}>{isFirstOfGroup ? row.pmu : ""}</td>}
      <td style={{ ...cell, color: "#1B2A22", fontWeight: isFirstOfGroup ? 600 : 400 }}>{isFirstOfGroup ? row.ip : ""}</td>
      <td style={{ ...cell, color: "#8A8677", fontSize: 11.5 }}>{isFirstOfGroup ? row.provinsi : ""}</td>
      <td style={{ ...cell, color: "#5C5A4E" }}>{row.tipeLahan}</td>
      <td style={{ ...cell, color: "#5C5A4E", textAlign: "right" }}>{row.target != null ? fmt1(row.target) : "–"}</td>
      <td style={{ ...cell, color: "#5C5A4E", textAlign: "right" }}>{row.real2024 != null ? fmt1(row.real2024) : "–"}</td>
      <td style={{ ...cell, color: "#5C5A4E", textAlign: "right" }}>{row.real2025 != null ? fmt1(row.real2025) : "–"}</td>
      <td style={{ ...cell, color: "#2C4A3A", fontWeight: 500, textAlign: "right", whiteSpace: "nowrap" }}>
        {row.baru2025 != null ? fmt1(row.baru2025) : "–"}
        {row.note ? <span style={{ color: "#B9791F" }}>{row.note}</span> : null}
      </td>
      <td style={{ ...cell, color: "#5C5A4E", textAlign: "right" }}>{iv != null ? fmt1(iv) : "–"}</td>
      <td style={{ ...cell }}>
        <QcBadge codes={qc} rules={QC_RULES} />
      </td>
    </tr>
  );
}

export function IpTablePanel({ ipTable, ipTotal, hasNote, title, qcOf, showPmu }) {
  const headers = [
    ...(showPmu ? ["PMU"] : []),
    "Implementing Partner",
    "Provinsi",
    "Tipe Lahan",
    "Target (ha)",
    "Realisasi 2024 (ha)",
    "Realisasi 2025 (ha)",
    `PCK 2025 (${CO2E})`,
    `Intensitas (${CO2E}/ha)`,
    "Uji kewajaran",
  ];
  const left = (h) => ["PMU", "Implementing Partner", "Provinsi", "Tipe Lahan", "Uji kewajaran"].includes(h);
  const flagged = ipTable.filter((r) => (qcOf(r) || []).length).length;
  return (
    <div style={{ marginTop: 18 }}>
      <SectionTitle>{title}</SectionTitle>
      <div style={{ border: "1px solid #D6D2C4", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 860 }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} style={{ textAlign: left(h) ? "left" : "right", ...cell, color: "#5C5A4E", fontWeight: 500, fontSize: 11.5, borderBottom: "1px solid #D6D2C4" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ipTable.map((row, i) => (
              <IpTableRow
                key={`${row.pmu || ""}-${row.no}-${row.tipeLahan}-${i}`}
                row={row}
                qc={qcOf(row)}
                showPmu={showPmu}
                isFirstOfGroup={i === 0 || ipTable[i - 1].ip !== row.ip || ipTable[i - 1].pmu !== row.pmu}
              />
            ))}
            <tr style={{ borderTop: "1px solid #D6D2C4", background: "#EDEAD9" }}>
              <td colSpan={showPmu ? 4 : 3} style={{ ...cell, color: "#1B2A22", fontWeight: 600 }}>Jumlah baris</td>
              <td style={{ ...cell, color: "#1B2A22", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.target)}</td>
              <td style={{ ...cell, color: "#1B2A22", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.real2024)}</td>
              <td style={{ ...cell, color: "#1B2A22", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.real2025)}</td>
              <td style={{ ...cell, color: "#2C4A3A", fontWeight: 600, textAlign: "right" }}>{fmt1(ipTotal.baru2025)}</td>
              <td style={{ ...cell, color: "#1B2A22", textAlign: "right" }}>{ipTotal.real2025 ? fmt1(ipTotal.baru2025 / ipTotal.real2025) : "–"}</td>
              <td style={{ ...cell, color: flagged ? "#8A2E2E" : "#5C5A4E", fontSize: 11.5 }}>{flagged ? `${flagged} baris ditandai` : "–"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: "#8A8677", marginTop: 6, lineHeight: 1.6 }}>
        Kode uji kewajaran (Pedoman MRV Draf 1, Tabel 6.1):{" "}
        {Object.entries(QC_RULES).map(([k, v]) => `${k} ${v}`).join(" · ")}. Penanda berarti <em>perlu klarifikasi</em> ke PMU, bukan
        kesimpulan bahwa data salah. Arahkan kursor ke badge untuk rinciannya.
        {hasNote && (
          <>
            <br />* Sel Mangrove Ditjen PDASRH pada tabel sumber menampilkan nilai Alometrik Lama dan Adjustment Baru tahun 2024 yang sama
            (13.465); ditampilkan apa adanya mengikuti dokumen sumber.
            <br />
            {"†"} Nilai Alometrik Lama 2025 sebesar 580,39 muncul identik pada dua baris berbeda (YBLL &ndash; Terestrial MPTS, dan
            Dishut Prov. Kalsel) pada tabel sumber; kemungkinan duplikasi pada dokumen asli.
            <br />
            {"‡"} Nilai 190,73 {CO2E} identik pada tiga IP pada dokumen sumber.
          </>
        )}
      </div>
    </div>
  );
}

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

function KpiCards({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginTop: 16 }}>
      {items.map((it, i) => (
        <div key={it.label} style={{ flex: "1 1 190px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
          <div style={{ fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontWeight: 600, fontSize: it.small ? 15 : 22, color: it.warn ? "#A23B3B" : it.accent ? "#2C4A3A" : "#1B2A22", lineHeight: 1.15 }}>
            {it.value}
            <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
          </div>
          {it.flag && <div style={{ marginTop: 5, fontSize: 11, color: "#8A2E2E" }}>{"⚠"} {it.flag}</div>}
        </div>
      ))}
    </div>
  );
}

function ClaimNote({ total }) {
  const c = claimable(total);
  const row = total.uncertaintyPct != null ? BUFFER_TABLE.find((b) => total.uncertaintyPct <= b.maxPct) : null;
  return (
    <div style={{ fontSize: 11.5, color: "#5C5A4E", marginTop: 6, lineHeight: 1.6 }}>
      {c.value != null ? (
        <>
          Nilai klaim konservatif = estimasi &times; (1 &minus; buffer). Uncertainty agregat {total.uncertaintyPct}% masuk kelas{" "}
          {row.label}, buffer {c.buffer}% (Tabel 7, Kerangka Metodologi FOLU, Ditjen PPI 2023). Batas bawah rentang:{" "}
          {fmt1(total.lower)} {CO2E}.
        </>
      ) : (
        <>Nilai klaim belum dapat dihitung karena uncertainty belum dilaporkan (wajib menurut Pedoman MRV Draf 1, 5.6).</>
      )}
    </div>
  );
}

export function ReportCarbonPanel({ data, ipFilter }) {
  const { meta, interventions, survival, methodNote, ipTable, isDummy, source, pmu, exAnte } = data;
  const hasIpFilter = ipFilter && ipFilter !== "Semua";
  const rows = hasIpFilter ? ipTable.filter((r) => r.ip === ipFilter) : ipTable;
  const hasNote = rows.some((r) => r.note);
  const [alometrikView, setAlometrikView] = useState("total");
  const qcOf = (r) => (isDummy ? [] : qcFor(pmu, r));
  const flaggedRows = rows.filter((r) => qcOf(r).length);
  const flaggedCo2 = flaggedRows.reduce((a, r) => a + (r.baru2025 || 0), 0);
  const panelQc = hasIpFilter || isDummy ? [] : panelLevelQc(data);

  const sum = (field) => rows.reduce((a, r) => a + (r[field] || 0), 0);
  const planting = {
    targetHa: sum("target"),
    realisasi2025Ha: sum("real2025"),
    pctOfTarget: sum("target") ? ((sum("real2025") / sum("target")) * 100).toFixed(1) : "0.0",
  };
  const methodComparison = [
    { tahun: 2024, alometrikLama: sum("lama2024"), adjustmentBaru: sum("baru2024") },
    { tahun: 2025, alometrikLama: sum("lama2025"), adjustmentBaru: sum("baru2025") },
  ];
  const after = methodComparison[1];
  const perJenisComparison = KARBON_CATEGORIES.map((c) => {
    const rs = rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key);
    return {
      key: c.key,
      lama2025: rs.reduce((a, r) => a + (r.lama2025 || 0), 0),
      adjustmentBaru2025: rs.reduce((a, r) => a + (r.baru2025 || 0), 0),
    };
  }).filter((c) => c.lama2025 > 0 || c.adjustmentBaru2025 > 0);
  const categoryTotals = KARBON_CATEGORIES.map((c) => ({
    ...c,
    total: rows.filter((r) => tipeLahanToCategory(r.tipeLahan) === c.key).reduce((a, r) => a + (r.baru2025 || 0), 0),
  })).filter((c) => c.total > 0);

  const total = data.total;
  const claim = claimable(total);
  const kpis = [
    { label: "Realisasi tanam 2025", value: fmt1(planting.realisasi2025Ha), unit: `ha (${planting.pctOfTarget}% dari ${fmt1(planting.targetHa)} ha)` },
    {
      label: hasIpFilter ? "PCK 2025 (jumlah baris IP)" : "PCK 2025 (estimasi)",
      value: fmt1(hasIpFilter ? after.adjustmentBaru : total.estimasi),
      unit: CO2E,
      accent: true,
      flag: flaggedRows.length ? `${flaggedRows.length} baris IP perlu klarifikasi (jumlah ${fmt1(flaggedCo2)} ${CO2E})` : null,
    },
  ];
  if (!hasIpFilter) {
    kpis.push(
      claim.value != null
        ? { label: `Nilai klaim konservatif (buffer ${claim.buffer}%)`, value: fmt1(claim.value), unit: CO2E }
        : { label: "Nilai klaim konservatif", value: "Belum dapat dihitung", unit: "", small: true, warn: true }
    );
    if (exAnte)
      kpis.push({
        label: "Capaian terhadap target ex-ante",
        value: `${((total.estimasi / exAnte.max) * 100).toFixed(0)}–${((total.estimasi / exAnte.min) * 100).toFixed(0)}%`,
        unit: `dari ${fmt1(exAnte.min)}–${fmt1(exAnte.max)} ${CO2E}`,
      });
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <SourceBadge source={source} />
        {hasIpFilter && <span style={{ fontSize: 12, color: "#5C5A4E" }}>Ditampilkan hanya untuk <strong>{ipFilter}</strong>.</span>}
      </div>
      {isDummy && (
        <Note tone="warn">
          Panel ini memakai <strong>data contoh</strong> dengan format yang sama seperti NC-1. Dokumen sumber PMU {pmu} belum tersedia,
          sehingga angka ini tidak ikut dijumlahkan pada ringkasan Semua PMU.
        </Note>
      )}
      {panelQc.length > 0 && (
        <Note tone="danger">
          {panelQc.map((t) => (
            <div key={t}>{"⚠"} {t} Total resmi dipakai sebagai angka estimasi sampai diklarifikasi.</div>
          ))}
        </Note>
      )}

      <KpiCards items={kpis} />
      {!hasIpFilter && <ClaimNote total={total} />}
      {!hasIpFilter && exAnte && (
        <div style={{ fontSize: 11.5, color: "#8A8677", marginTop: 4 }}>
          Target ex-ante: {exAnte.keterangan} ({exAnte.source.dokumen}). Target disusun sebelum adjustment alometrik, sehingga persentase
          capaian cenderung rendah.
        </div>
      )}

      {after.alometrikLama === 0 ? (
        <div style={{ border: "1px solid #D6D2C4", padding: "4px 22px 16px", marginTop: 16 }}>
          <Note tone="neutral">
            Perbandingan alometrik lama vs. adjustment tidak tersedia untuk PMU ini: dokumen sumber hanya melaporkan PCK hasil
            alometrik yang memakai diameter pangkal dan tinggi semai.
          </Note>
        </div>
      ) : (
        <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 10px", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <SectionTitle>Alometrik lama vs. adjustment alometrik baru</SectionTitle>
            <ToggleGroup value={alometrikView} onChange={setAlometrikView} options={[{ value: "total", label: "Total" }, { value: "perjenis", label: "Per jenis lahan" }]} />
          </div>
          <div style={{ fontSize: 12.5, color: "#8A8677", marginTop: -8, marginBottom: 8 }}>
            Adjustment memakai persamaan tanaman muda (Adinugroho et al., 2023), mengoreksi estimasi {after.tahun} dari{" "}
            {fmt1(after.alometrikLama)} menjadi {fmt1(after.adjustmentBaru)} {CO2E}.
          </div>
          <ResponsiveContainer width="100%" height={alometrikView === "total" ? 220 : 260}>
            <BarChart data={alometrikView === "total" ? methodComparison : perJenisComparison} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
              <XAxis dataKey={alometrikView === "total" ? "tahun" : "key"} tick={{ fontFamily: "IBM Plex Sans", fontSize: 11.5, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} interval={0} />
              <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} ${CO2E}`} />
              <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
              <Bar dataKey={alometrikView === "total" ? "alometrikLama" : "lama2025"} name="Alometrik lama" fill="#8A8677" />
              <Bar dataKey={alometrikView === "total" ? "adjustmentBaru" : "adjustmentBaru2025"} name="Adjustment baru" fill="#2C4A3A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <CategoryAccumulationChart data={categoryTotals} title={`Akumulasi PCK per jenis intervensi (${after.tahun})`} unitLabel={CO2E} />
      </div>

      {!hasIpFilter ? (
        <div style={{ marginTop: 18 }}>
          <SectionTitle>Estimasi & rentang uncertainty per jenis intervensi ({after.tahun})</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {interventions.map((item) => (
              <UncertaintyRow key={item.key} item={item} />
            ))}
            <div style={{ padding: "14px 18px", borderTop: "1px solid #D6D2C4", background: "#EDEAD9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "#1B2A22" }}>Total</span>
                <span style={{ fontSize: 13, color: "#2C4A3A", fontWeight: 600 }}>
                  {fmt1(total.estimasi)} {CO2E}{" "}
                  <span style={{ color: "#8A8677", fontWeight: 400 }}>
                    {total.uncertaintyPct != null ? `(±${total.uncertaintyPct}%, rentang ${fmt1(total.lower)}–${fmt1(total.upper)})` : "(uncertainty belum dilaporkan)"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 11.5, color: "#8A8677" }}>
          Rentang uncertainty hanya tersedia pada level agregat seluruh IP, sehingga tidak ditampilkan saat difilter per-IP.
        </div>
      )}

      <IpTablePanel
        title={`Rincian per implementing partner (${meta.title})`}
        ipTable={rows}
        ipTotal={{ target: sum("target"), real2024: sum("real2024"), real2025: sum("real2025"), baru2025: sum("baru2025") }}
        hasNote={hasNote}
        qcOf={qcOf}
      />

      {!hasIpFilter && survival.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <SectionTitle>Survival rate yang dilaporkan</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {survival.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6" }}>
                <span style={{ fontSize: 13, color: "#1B2A22" }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: s.value < 70 ? "#B9791F" : "#2C4A3A" }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start", border: "1px solid #D6D2C4", padding: "14px 18px" }}>
        <FileText size={16} color="#5C5A4E" style={{ flex: "none", marginTop: 2 }} />
        <div style={{ fontSize: 12, color: "#5C5A4E", lineHeight: 1.6 }}>{methodNote}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ringkasan "Semua PMU": hanya menjumlahkan PMU berdata riil, kecuali pengguna
// secara sadar menyalakan "sertakan data contoh".
// ---------------------------------------------------------------------------
function TargetVsCapaianTable({ pmus }) {
  const th = { ...cell, color: "#5C5A4E", fontWeight: 500, fontSize: 11.5, borderBottom: "1px solid #D6D2C4", textAlign: "right" };
  return (
    <div style={{ border: "1px solid #D6D2C4", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 820 }}>
        <thead>
          <tr>
            {["PMU", "Sumber", "Target (ha)", "Realisasi 2025 (ha)", "% luas", `PCK estimasi (${CO2E})`, "Uncertainty", `Nilai klaim (${CO2E})`, `Target ex-ante (${CO2E})`].map((h, i) => (
              <th key={h} style={{ ...th, textAlign: i < 2 ? "left" : "right" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pmus.map((pmu) => {
            const d = REPORT_DATA[pmu];
            const t = d.ipTable.reduce((a, r) => a + (r.target || 0), 0);
            const r25 = d.ipTable.reduce((a, r) => a + (r.real2025 || 0), 0);
            const c = claimable(d.total);
            return (
              <tr key={pmu} style={{ borderTop: "1px solid #E5E2D6", background: d.isDummy ? "#FBF4E4" : undefined }}>
                <td style={{ ...cell, fontWeight: 600, color: "#1B2A22" }}>{PMU_META[pmu].label}</td>
                <td style={cell}><SourceBadge source={d.source} compact /></td>
                <td style={{ ...cell, textAlign: "right" }}>{fmt1(t)}</td>
                <td style={{ ...cell, textAlign: "right" }}>{fmt1(r25)}</td>
                <td style={{ ...cell, textAlign: "right" }}>{t ? `${((r25 / t) * 100).toFixed(1)}%` : "–"}</td>
                <td style={{ ...cell, textAlign: "right", color: "#2C4A3A", fontWeight: 500 }}>{fmt1(d.total.estimasi)}</td>
                <td style={{ ...cell, textAlign: "right", color: d.total.uncertaintyPct == null ? "#B9791F" : undefined }}>{d.total.uncertaintyPct != null ? `±${d.total.uncertaintyPct}%` : "belum ada"}</td>
                <td style={{ ...cell, textAlign: "right" }}>{c.value != null ? fmt1(c.value) : "–"}</td>
                <td style={{ ...cell, textAlign: "right" }}>{d.exAnte ? `${fmt1(d.exAnte.min)}–${fmt1(d.exAnte.max)}` : "belum ada"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IntensityChart({ rows }) {
  const pmus = [...new Set(rows.map((r) => r.pmu))];
  const data = KARBON_CATEGORIES.map((c) => {
    const o = { key: c.key };
    pmus.forEach((p) => {
      const rs = rows.filter((r) => r.pmu === p && tipeLahanToCategory(r.tipeLahan) === c.key && r.baru2025 > 0 && r.real2025 > 0);
      const co2 = rs.reduce((a, r) => a + r.baru2025, 0);
      const ha = rs.reduce((a, r) => a + r.real2025, 0);
      o[p] = ha ? Number((co2 / ha).toFixed(3)) : null;
    });
    return o;
  }).filter((o) => pmus.some((p) => o[p] != null));
  return (
    <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 10px", marginTop: 18 }}>
      <SectionTitle>Intensitas PCK per tipe lahan ({CO2E}/ha, skala logaritmik)</SectionTitle>
      <div style={{ fontSize: 12.5, color: "#8A8677", marginTop: -8, marginBottom: 8, lineHeight: 1.5 }}>
        Dihitung dari baris IP dengan realisasi luas dan PCK 2025 &gt; 0. Perbedaan beberapa orde besaran untuk tipe lahan dan umur
        tanaman yang sama biasanya menandakan perbedaan metode atau kesalahan input, sehingga perlu uji sampel PMU (QC-03).
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
          <XAxis dataKey="key" tick={{ fontFamily: "IBM Plex Sans", fontSize: 11.5, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} interval={0} />
          <YAxis scale="log" domain={[0.01, "auto"]} allowDataOverflow tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => fmt1(v)} />
          <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => (v == null ? "–" : `${fmt1(v)} ${CO2E}/ha`)} />
          <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
          {pmus.map((p) => (
            <Bar key={p} dataKey={p} name={PMU_META[p].label} fill={PMU_META[p].color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CarbonView({ pmuFilter, ipFilter }) {
  const [includeDummy, setIncludeDummy] = useState(false);
  if (REPORT_DATA[pmuFilter]) {
    return <ReportCarbonPanel data={REPORT_DATA[pmuFilter]} ipFilter={ipFilter} />;
  }

  const base = includeDummy ? ALL_IP_ROWS : REAL_IP_ROWS;
  const rows = !ipFilter || ipFilter === "Semua" ? base : base.filter((r) => r.ip === ipFilter);
  const pmus = Object.keys(PMU_META).filter((p) => includeDummy || !REPORT_DATA[p].isDummy);
  const qcOf = (r) => (r.isDummy ? [] : qcFor(r.pmu, r));

  const byPmuCategory = pmus.map((pmu) => {
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
  const flagged = rows.filter((r) => qcOf(r).length);
  const flaggedCo2 = flagged.reduce((a, r) => a + (r.baru2025 || 0), 0);
  const realTotalHa = rows.reduce((a, r) => a + (r.real2025 || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12.5, color: "#5C5A4E", maxWidth: 720, lineHeight: 1.55 }}>
          Lapis B &mdash; peningkatan cadangan karbon (PCK) langsung dari penanaman. Angka dijumlahkan dari baris IP setiap PMU;
          kinerja pengurangan emisi nasional (Lapis A) ada di tab <strong>Nasional</strong> dan tidak dijumlahkan di sini.
        </div>
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12.5, color: includeDummy ? "#7A5212" : "#5C5A4E", cursor: "pointer" }}>
          <input type="checkbox" checked={includeDummy} onChange={(e) => setIncludeDummy(e.target.checked)} />
          Sertakan data contoh ({DUMMY_PMUS.join(", ")})
        </label>
      </div>
      {includeDummy && (
        <Note tone="warn">
          Total di bawah <strong>termasuk data contoh</strong> {DUMMY_PMUS.join(", ")} (baris berlatar kuning). Jangan dipakai untuk
          pelaporan.
        </Note>
      )}

      <KpiCards
        items={[
          { label: "PMU yang dijumlahkan", value: pmus.length, unit: pmus.map((p) => p).join(", ") },
          { label: "Realisasi tanam 2025", value: fmt1(realTotalHa), unit: "ha" },
          { label: "PCK 2025 (jumlah baris IP)", value: fmt1(grandTotal), unit: CO2E, accent: true },
          { label: "Perlu klarifikasi (uji kewajaran)", value: fmt1(flaggedCo2), unit: `${CO2E} dari ${flagged.length} baris`, warn: flagged.length > 0 },
        ]}
      />
      <div style={{ fontSize: 11.5, color: "#8A8677", marginTop: 6, lineHeight: 1.6 }}>
        Jumlah baris IP dapat berbeda dari total resmi dokumen (mis. NC-2&amp;3 terestrial, QC-02). Nilai klaim per PMU ada pada tabel
        target vs capaian.
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionTitle>Target vs capaian per PMU</SectionTitle>
        <TargetVsCapaianTable pmus={pmus} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", borderBottom: "none", marginTop: 18 }}>
        {categoryTotals.map((r, i) => (
          <div key={r.key} style={{ flex: "1 1 150px", padding: "16px 18px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <span style={{ width: 9, height: 9, background: r.color, display: "inline-block" }} />
              <span style={{ fontSize: 12.5, color: "#5C5A4E" }}>{r.key}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 20, color: "#1B2A22" }}>
              {fmt1(r.total)}
              <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{CO2E}</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#8A8677", marginTop: 2 }}>{grandTotal ? Math.round((r.total / grandTotal) * 100) : 0}% dari total</div>
          </div>
        ))}
      </div>
      <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px 10px" }}>
        <SectionTitle>PCK 2025 per PMU, menurut jenis intervensi</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byPmuCategory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="#D6D2C4" vertical={false} />
            <XAxis dataKey="pmu" tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "#5C5A4E" }} axisLine={{ stroke: "#D6D2C4" }} tickLine={false} />
            <YAxis tick={{ fontFamily: "IBM Plex Sans", fontSize: 11, fill: "#5C5A4E" }} axisLine={false} tickLine={false} width={55} />
            <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5, border: "1px solid #D6D2C4", borderRadius: 0 }} formatter={(v) => `${fmt1(v)} ${CO2E}`} />
            <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12.5 }} />
            {KARBON_CATEGORIES.map((c) => (
              <Bar key={c.key} dataKey={c.key} stackId="a" fill={c.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <IntensityChart rows={rows} />

      <IpTablePanel
        title="Rincian per implementing partner (semua PMU)"
        ipTable={rows}
        ipTotal={{
          target: rows.reduce((a, r) => a + (r.target || 0), 0),
          real2024: rows.reduce((a, r) => a + (r.real2024 || 0), 0),
          real2025: realTotalHa,
          baru2025: grandTotal,
        }}
        hasNote={rows.some((r) => r.note)}
        qcOf={qcOf}
        showPmu
      />
    </div>
  );
}
