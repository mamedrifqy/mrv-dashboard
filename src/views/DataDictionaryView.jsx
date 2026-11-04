import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { Note, SectionTitle, ToggleGroup } from "../components/ui";
import { SourceBadge } from "../components/SourceBadge";
import { TABLES, ipRowsToT1T4 } from "../data/schema";
import { REPORT_DATA } from "../data";
import { qcFor } from "../data/qc";

const btn = { display: "inline-flex", alignItems: "center", gap: 6, background: "#1B2A22", color: "#EEF0E7", border: "none", padding: "8px 13px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, cursor: "pointer" };
const cell = { padding: "8px 12px", borderTop: "1px solid #E5E2D6", verticalAlign: "top" };

function downloadCsv(rows, columns, filename) {
  const csv = Papa.unparse({ fields: columns, data: rows.map((r) => columns.map((c) => r[c] ?? "")) });
  saveAs(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), filename);
}

// Poin 6: struktur data T1–T4 (Pedoman MRV Draf 1, Lampiran A) beserta
// template unggah untuk PMU/IP dan ekspor data riil yang sudah dipetakan.
export function DataDictionaryView() {
  const [active, setActive] = useState("T1");
  const table = TABLES.find((t) => t.key === active);
  const realPmus = Object.keys(REPORT_DATA).filter((p) => !REPORT_DATA[p].isDummy);
  const mapped = realPmus.map((p) => ({ pmu: p, ...ipRowsToT1T4(p, REPORT_DATA[p], (r) => qcFor(p, r)) }));
  const t1 = mapped.flatMap((m) => m.t1);
  const t4 = mapped.flatMap((m) => m.t4);
  const t1Cols = TABLES[0].fields.map((f) => f[0]);
  const t4Cols = TABLES[3].fields.map((f) => f[0]);
  const filled = (rows, cols) => cols.filter((c) => rows.some((r) => r[c] !== undefined && r[c] !== "")).length;

  return (
    <div>
      <SectionTitle>Kamus data terpadu RBC-1, RBC-2&amp;3, RBC-4</SectionTitle>
      <div style={{ fontSize: 13, color: "#5C5A4E", lineHeight: 1.6, maxWidth: 820 }}>
        Semua PMU menyampaikan data dengan empat tabel yang sama, saling bertaut melalui kunci ID: <strong>T1 Lokasi</strong> &rarr;{" "}
        <strong>T2 Plot</strong> &rarr; <strong>T3 Pengukuran tanaman</strong>, dan <strong>T1</strong> &rarr; <strong>T4 Hasil PCK</strong>{" "}
        per periode. Nama kolom mengikuti SHP Progres Penanaman PMU NC-2&amp;3 (maks. 10&ndash;12 karakter agar kompatibel dengan
        shapefile). Kolom bertanda <em>sistem</em> dihitung oleh dashboard, tidak diisi IP.
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "16px 0" }}>
        <ToggleGroup value={active} onChange={setActive} options={TABLES.map((t) => ({ value: t.key, label: t.name }))} />
        <button style={btn} onClick={() => downloadCsv([], table.fields.filter((f) => f[3] !== "sistem").map((f) => f[0]), `template_${table.key}.csv`)}>
          <Download size={13} /> Template {table.key} (CSV kosong)
        </button>
      </div>

      <div style={{ border: "1px solid #D6D2C4", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 640 }}>
          <thead>
            <tr>
              {["Kolom", "Tipe", "Keterangan / nilai", "Diisi oleh"].map((h) => (
                <th key={h} style={{ ...cell, borderTop: "none", textAlign: "left", color: "#5C5A4E", fontWeight: 500, fontSize: 11.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.fields.map(([name, type, desc, by]) => (
              <tr key={name}>
                <td style={{ ...cell, fontFamily: "ui-monospace, monospace", color: "#1B2A22" }}>{name}</td>
                <td style={{ ...cell, color: "#5C5A4E" }}>{type}</td>
                <td style={{ ...cell, color: "#5C5A4E" }}>{desc}</td>
                <td style={{ ...cell, color: by === "sistem" ? "#2E6B6B" : "#5C5A4E" }}>{by === "sistem" ? "sistem" : "IP/PMU"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11.5, color: "#8A8677", marginTop: 6 }}>
        Tingkat: {table.level}. Kunci: {table.keyField}.
      </div>

      <div style={{ marginTop: 26 }}>
        <SectionTitle>Data riil yang sudah dipetakan ke T1 dan T4</SectionTitle>
        <Note tone="neutral">
          Laporan sumber saat ini masih berupa agregat per IP, sehingga satu baris IP dipetakan menjadi satu &ldquo;lokasi agregat&rdquo;
          di T1. T2 dan T3 baru akan terisi setelah PMU mengunggah data plot dan pengukuran tanaman. Data contoh (NC-4) tidak diekspor.
        </Note>
        <div style={{ border: "1px solid #D6D2C4", marginTop: 12 }}>
          {mapped.map((m) => (
            <div key={m.pmu} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "12px 16px", borderTop: "1px solid #E5E2D6" }}>
              <div style={{ fontSize: 13, color: "#1B2A22" }}>
                <strong>{m.pmu}</strong> &middot; {m.t1.length} baris T1, {m.t4.length} baris T4{" "}
                <span style={{ color: "#8A8677" }}>
                  ({filled(m.t1, t1Cols)} dari {t1Cols.length} kolom T1 terisi)
                </span>{" "}
                <SourceBadge source={REPORT_DATA[m.pmu].source} compact />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button style={btn} onClick={() => downloadCsv(t1, t1Cols, "T1_lokasi_riil.csv")}>
            <Download size={13} /> Ekspor T1 ({t1.length} baris)
          </button>
          <button style={btn} onClick={() => downloadCsv(t4, t4Cols, "T4_hasil_pck_riil.csv")}>
            <Download size={13} /> Ekspor T4 ({t4.length} baris)
          </button>
        </div>
      </div>
    </div>
  );
}
