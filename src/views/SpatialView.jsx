import React, { useState, useMemo, useRef } from "react";
import * as turf from "@turf/turf";
import { Filter, Upload, MapPinned } from "lucide-react";
import { DownloadMenu, GenericGeoMap, LeafletMap, MechanismPanel, checkOverlapAgainstReference } from "../components/maps";
import { Field, Note, Select, StatusBadge, ToggleGroup, useIsNarrow } from "../components/ui";
import { NC1_TIPE_COLOR, PMU_META, STATUS_META } from "../constants";
import { NC1_IP_TABLE } from "../data";
import { CO2E, fmt, fmt1 } from "../lib/format";
import { NC1_AOI_FEATURES, NC1_PETAK_BY_ROW } from "../lib/geo";

// ---------------------------------------------------------------------------
// Province-level choropleth metrics, from the real-structure dummy dataset
// (indonesia_provinsi_folu_ro_emisi.geojson): emisi GRK, RO count, small
// grants by PMU, KTH count, dan realisasi tanam/karbon NC-1 per provinsi.
// ---------------------------------------------------------------------------
// `desc` menjelaskan isi kolom; `caveat` dipakai bila definisi kolom belum
// terdokumentasi atau berisiko disalahartikan (poin 8 tinjauan dashboard).
const NC1_GEO_CAVEAT =
  "Jumlah kolom ini di seluruh provinsi tidak sama dengan Laporan Tahunan NC-1 TA 2025 (realisasi 18.699 ha; PCK adjustment 22.277,68 tCO\u2082e, " +
  "alometrik lama 36.814,2 tCO\u2082e). Versi data dan metode kolom GeoJSON perlu dikonfirmasi sebelum dipakai sebagai angka resmi.";
const GHG_CAVEAT =
  "Definisi metode kolom GHG_* belum terdokumentasi pada sumber GeoJSON. Hasil pengecekan atas 37 provinsi berdata: " +
  "kolom \"Selisih\" = Emisi 2006\u20132020 \u2212 Emisi 2021\u20132024, sedangkan kolom \"FileFormula\" = Emisi 2006\u20132020 + Emisi 2021\u20132024. " +
  "Keduanya berbeda arti; nilai Emisi 2021\u20132024 bisa negatif (serapan bersih). Jangan dibandingkan dengan nilai RBC nasional sebelum metodenya dikonfirmasi.";
export const PROVINCE_METRICS = [
  { key: "NC1_Planting_Area_Ha", label: "Luas Tanam NC-1", unit: "ha", color: "#2C4A3A", desc: "Luas tanam NC-1 per provinsi.", caveat: NC1_GEO_CAVEAT },
  { key: "NC1_Ton_CO2e", label: "Potensi Karbon NC-1", unit: "tCO\u2082e", color: "#2E6B6B", desc: "Potensi PCK NC-1 per provinsi (Lapis B).", caveat: NC1_GEO_CAVEAT },
  { key: "JML_RO", label: "Jumlah RO", unit: "RO", color: "#5B4A7A", desc: "Jumlah Rencana Operasional per provinsi." },
  { key: "Jumlah_Small_Grant_NC2_3", label: "Small Grants NC-2&3", unit: "unit", color: "#B9791F", desc: "Jumlah penerima small grant NC-2&3." },
  { key: "Jumlah_Small_Grant_NC4", label: "Small Grants NC-4", unit: "unit", color: "#8A6A2E", desc: "Jumlah penerima small grant NC-4." },
  { key: "NC1_Jumlah_KTH_2025", label: "Jumlah KTH 2025", unit: "kelompok", color: "#6B4C9A", desc: "Jumlah KTH NC-1 tahun 2025." },
  { key: "GHG_Emissions_2006_2020_tonCO2e_y", label: "Emisi FOLU 2006\u20132020", unit: "tCO\u2082e/th", color: "#7A3B3B", desc: "Emisi tahunan sektor FOLU periode 2006\u20132020.", caveat: GHG_CAVEAT },
  { key: "GHG_Emissions_2021_2024_tonCO2e_y", label: "Emisi FOLU 2021\u20132024", unit: "tCO\u2082e/th", color: "#9A5B3B", desc: "Emisi tahunan sektor FOLU periode 2021\u20132024 (negatif = serapan bersih).", caveat: GHG_CAVEAT },
  { key: "GHG_Pengurangan_Emisi_Selisih_tonCO2e_y", label: "Pengurangan Emisi (Selisih)", unit: "tCO\u2082e/th", color: "#2451A3", desc: "Emisi 2006\u20132020 dikurangi emisi 2021\u20132024.", caveat: GHG_CAVEAT },
  { key: "GHG_Mitigation_FileFormula_tonCO2e_y", label: "Mitigasi (FileFormula)", unit: "tCO\u2082e/th", color: "#3B5BA3", desc: "Penjumlahan emisi 2006\u20132020 dan 2021\u20132024 (bukan selisih).", caveat: GHG_CAVEAT },
  { key: "TOTAL_ANGGARAN_RP", label: "Total Anggaran", unit: "Rp", color: "#A23B3B", desc: "Total anggaran program per provinsi." },
];

export function computeQuantileBreaks(values, classes = 5) {
  const sorted = values.filter((v) => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!sorted.length) return [];
  const breaks = [];
  for (let i = 1; i < classes; i++) {
    const idx = Math.min(sorted.length - 1, Math.floor((i / classes) * sorted.length));
    breaks.push(sorted[idx]);
  }
  return breaks;
}

export function classForValue(value, breaks) {
  let cls = 0;
  for (const b of breaks) {
    if (value > b) cls++;
  }
  return cls;
}

export const CHOROPLETH_OPACITIES = [0.12, 0.3, 0.48, 0.66, 0.85];

export function formatMetricValue(metric, value) {
  if (value == null) return "\u2013";
  if (metric.unit === "Rp") return `Rp ${fmt1(value / 1e9)} M`;
  return `${fmt1(value)} ${metric.unit}`;
}

export function ProvinceChoroplethView() {
  const [metricKey, setMetricKey] = useState(PROVINCE_METRICS[0].key);
  const [features, setFeatures] = useState(null);
  const metric = PROVINCE_METRICS.find((m) => m.key === metricKey);

  const breaks = useMemo(() => {
    if (!features) return [];
    return computeQuantileBreaks(features.map((f) => f.properties[metricKey]));
  }, [features, metricKey]);

  const styleFn = useMemo(() => {
    return (feature) => {
      const value = feature.properties[metricKey];
      const cls = value != null ? classForValue(value, breaks) : 0;
      return {
        color: "#5C5A4E",
        weight: 0.8,
        fillColor: metric.color,
        fillOpacity: value != null ? CHOROPLETH_OPACITIES[cls] : 0.05,
      };
    };
  }, [metricKey, breaks, metric.color]);

  const popupFn = (p) => {
    return (
      `<div style="font-family:'IBM Plex Sans',sans-serif;font-size:12.5px;min-width:220px">` +
      `<div style="font-weight:600;font-size:13.5px;margin-bottom:6px;color:#1B2A22">${p.PROVINSI}</div>` +
      PROVINCE_METRICS.map(
        (m) =>
          `<div style="display:flex;justify-content:space-between;gap:10px"><span style="color:#8A8677">${m.label}</span><span style="font-weight:${m.key === metricKey ? 600 : 400}">${formatMetricValue(m, p[m.key])}</span></div>`
      ).join("") +
      `</div>`
    );
  };

  const totals = useMemo(() => {
    if (!features) return null;
    return {
      planting: features.reduce((a, f) => a + (f.properties.NC1_Planting_Area_Ha || 0), 0),
      carbon: features.reduce((a, f) => a + (f.properties.NC1_Ton_CO2e || 0), 0),
      ro: features.reduce((a, f) => a + (f.properties.JML_RO || 0), 0),
      kth: features.reduce((a, f) => a + (f.properties.NC1_Jumlah_KTH_2025 || 0), 0),
    };
  }, [features]);

  return (
    <div>
      <Note tone="warn">
        Peta choropleth ini menggunakan data provinsi dengan atribut <strong>dummy</strong> (dibuat mengikuti struktur data riil:
        emisi GRK, jumlah RO, small grants per PMU, jumlah KTH, realisasi tanam &amp; karbon NC-1) untuk mengilustrasikan
        bagaimana ringkasan tingkat provinsi dapat ditampilkan.
      </Note>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E" }}>Tampilkan metrik</span>
        <Select label="Metrik" value={metricKey} onChange={setMetricKey} options={PROVINCE_METRICS.map((m) => m.key)} renderLabel={(k) => PROVINCE_METRICS.find((m) => m.key === k).label} />
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginTop: -6, marginBottom: 12, lineHeight: 1.55 }}>
        {metric.desc}
        {metric.caveat && <div style={{ marginTop: 6, color: "#8A2E2E" }}>{"\u26A0"} {metric.caveat}</div>}
      </div>

      {totals && (
        <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginBottom: 12 }}>
          {[
            { label: "Total luas tanam NC-1", value: fmt1(totals.planting), unit: "ha" },
            { label: "Total potensi karbon NC-1", value: fmt1(totals.carbon), unit: CO2E },
            { label: "Total RO", value: fmt(totals.ro), unit: "RO" },
            { label: "Total KTH 2025", value: fmt(totals.kth), unit: "kelompok" },
          ].map((it, i) => (
            <div key={it.label} style={{ flex: "1 1 170px", padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, color: "#1B2A22" }}>
                {it.value}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#5C5A4E", marginLeft: 4 }}>{it.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ border: "1px solid #D6D2C4" }}>
        <GenericGeoMap geojsonUrl={`${import.meta.env.BASE_URL}indonesia_provinsi_folu_ro_emisi.geojson`} styleFn={styleFn} popupFn={popupFn} onLoaded={(f) => setFeatures(f.map((x) => x))} height={480} />
      </div>

      {breaks.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677" }}>{metric.label}:</span>
          {CHOROPLETH_OPACITIES.map((op, i) => {
            const lo = i === 0 ? 0 : breaks[i - 1];
            const hi = breaks[i];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 12, height: 12, background: metric.color, opacity: op, display: "inline-block", border: "1px solid #D6D2C4" }} />
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#5C5A4E" }}>
                  {hi != null ? `${fmt1(lo)}\u2013${fmt1(hi)}` : `> ${fmt1(lo)}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PlantingSebaranView({ ipFilter }) {
  const [features, setFeatures] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const hasIpFilter = ipFilter && ipFilter !== "Semua";

  const styleFn = (feature) => {
    const status = feature.properties.status_ro;
    const color = status === "Dalam RO" ? "#2C4A3A" : "#A23B3B";
    return { color, weight: 1.3, fillColor: color, fillOpacity: 0.4 };
  };
  const popupFn = (p) => {
    return (
      `<div style="font-family:'IBM Plex Sans',sans-serif;font-size:12.5px;min-width:210px">` +
      `<div style="font-weight:600;font-size:13.5px;margin-bottom:6px;color:#1B2A22">${p.ip}</div>` +
      `<div style="color:#5C5A4E;margin-bottom:4px">${p.provinsi}</div>` +
      `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Luas tanam</span><span>${fmt1(p.planting_area_ha)} ha</span></div>` +
      `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Potensi karbon</span><span>${fmt1(p.ton_co2e)} ${CO2E}</span></div>` +
      `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Status RO</span><span style="font-weight:600;color:${p.status_ro === "Dalam RO" ? "#2C4A3A" : "#A23B3B"}">${p.status_ro}</span></div>` +
      `</div>`
    );
  };
  const filterFn = hasIpFilter ? (p) => p.ip === ipFilter : null;

  const scoped = features ? (hasIpFilter ? features.filter((f) => f.properties.ip === ipFilter) : features) : null;
  const filtered = scoped ? (statusFilter === "Semua" ? scoped : scoped.filter((f) => f.properties.status_ro === statusFilter)) : null;
  const totals = filtered
    ? {
        count: filtered.length,
        ip: new Set(filtered.map((f) => f.properties.ip)).size,
        luas: filtered.reduce((a, f) => a + (f.properties.planting_area_ha || 0), 0),
        karbon: filtered.reduce((a, f) => a + (f.properties.ton_co2e || 0), 0),
        dalamRo: filtered.filter((f) => f.properties.status_ro === "Dalam RO").length,
        luarRo: filtered.filter((f) => f.properties.status_ro === "Luar RO").length,
      }
    : null;

  return (
    <div>
      <Note tone="warn">
        Sebaran ini adalah data <strong>dummy</strong> yang mencakup seluruh 52 unit pelaksana FOLU NC-1 di 27 provinsi (bukan
        hanya 13 IP Bidang II pada Tabel 6.9), dibuat untuk mengilustrasikan cakupan penuh proyek serta status keberadaannya di
        dalam/luar Rencana Operasional (RO).
        {hasIpFilter && (
          <>
            {" "}Ditampilkan hanya untuk <strong>{ipFilter}</strong>.
          </>
        )}
      </Note>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E" }}>Filter status RO</span>
        <Select label="Status" value={statusFilter} onChange={setStatusFilter} options={["Semua", "Dalam RO", "Luar RO"]} renderLabel={(o) => o} />
      </div>

      {totals && (
        <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginBottom: 12 }}>
          {[
            { label: "Jumlah petak", value: fmt(totals.count), unit: `${totals.ip} unit pelaksana` },
            { label: "Total luas tanam", value: fmt1(totals.luas), unit: "ha" },
            { label: "Total potensi karbon", value: fmt1(totals.karbon), unit: CO2E, accent: true },
            { label: "Dalam RO / Luar RO", value: `${fmt(totals.dalamRo)} / ${fmt(totals.luarRo)}`, unit: "petak" },
          ].map((it, i) => (
            <div key={it.label} style={{ flex: "1 1 170px", padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                {it.value}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#5C5A4E", marginLeft: 4 }}>{it.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ border: "1px solid #D6D2C4" }}>
        <GenericGeoMap geojsonUrl={`${import.meta.env.BASE_URL}folu_nc1_planting_ip.geojson`} styleFn={styleFn} popupFn={popupFn} filterFn={filterFn} onLoaded={setFeatures} height={480} />
      </div>
      <div style={{ display: "flex", gap: 16, padding: "10px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>
          <span style={{ width: 9, height: 9, background: "#2C4A3A", opacity: 0.6, border: "1px solid #2C4A3A", display: "inline-block" }} /> Dalam RO
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>
          <span style={{ width: 9, height: 9, background: "#A23B3B", opacity: 0.6, border: "1px solid #A23B3B", display: "inline-block" }} /> Luar RO
        </div>
      </div>

      {features && (
        <div style={{ marginTop: 8 }}>
          <OverlapUploadPanel referenceFeatures={features} onResult={() => {}} />
        </div>
      )}
    </div>
  );
}

export function MonevBar({ label, pct, ambang }) {
  const color = pct >= ambang ? "#2C4A3A" : "#B9791F";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color: "#8A8677" }}>Ambang {ambang}%</span>
      </div>
      <div style={{ position: "relative", height: 8, background: "#EDEAD9" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, pct)}%`, background: color }} />
        <div style={{ position: "absolute", left: `${ambang}%`, top: -2, bottom: -2, width: 1.5, background: "#8A6A2E" }} />
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: "#1B2A22", marginTop: 3 }}>
        {pct}% <span style={{ fontWeight: 400, fontSize: 11, color: pct >= ambang ? "#2C4A3A" : "#B9791F" }}>{pct >= ambang ? `+${(pct - ambang).toFixed(1)}% dari ambang` : `${(pct - ambang).toFixed(1)}% dari ambang`}</span>
      </div>
    </div>
  );
}

export function PetakCard({ petak }) {
  return (
    <div style={{ border: "1px solid #D6D2C4", padding: "12px 14px", marginBottom: 10, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1B2A22" }}>{petak.kelompok}</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677" }}>{petak.kecamatan} &middot; {petak.desa}</div>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, color: "#2C4A3A", background: "#EDEAD9", padding: "2px 7px", flex: "none" }}>{petak.status}</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 8 }}>Luas petak: {fmt1(petak.luas)} ha</div>
      {petak.monev.map((m) => (
        <MonevBar key={m.label} label={m.label} pct={m.pct} ambang={m.ambang} />
      ))}
    </div>
  );
}

export function AoiListItem({ row, active, onClick }) {
  const petakCount = (NC1_PETAK_BY_ROW[`${row.ip}__${row.tipeLahan}`] || []).length;
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid #E5E2D6",
        cursor: "pointer",
        background: active ? "#1B2A22" : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 7, marginBottom: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: NC1_TIPE_COLOR[row.tipeLahan] || "#2C4A3A", flex: "none" }} />
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: active ? "#EEF0E7" : "#1B2A22", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.ip}</span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, color: active ? "#B7BBA8" : "#8A8677", flex: "none" }}>{petakCount} petak</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: active ? "#B7BBA8" : "#8A8677", marginLeft: 15 }}>
        {row.tipeLahan} &middot; {row.provinsi.split(",")[0]}
      </div>
    </div>
  );
}

export function OverlapUploadPanel({ referenceFeatures, onResult }) {
  const [uploadedFeatures, setUploadedFeatures] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setFileName(file.name);
    try {
      const features = await parseUploadedFile(file);
      if (!features.length) throw new Error("Tidak ada fitur geometri yang terbaca dari file ini.");
      const checked = checkOverlapAgainstReference(features, referenceFeatures);
      setUploadedFeatures(checked);
      onResult && onResult(checked);
    } catch (err) {
      setError(err.message || "Gagal membaca file.");
      setUploadedFeatures(null);
      onResult && onResult(null);
    }
  };

  const overlapCount = uploadedFeatures ? uploadedFeatures.filter((f) => f.properties.__overlap).length : 0;

  return (
    <div style={{ border: "1px solid #D6D2C4", padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <MapPinned size={15} color="#2C4A3A" />
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1B2A22" }}>Unggah data & cek overlap RO</div>
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8A8677", marginBottom: 12, lineHeight: 1.55 }}>
        Unggah GeoJSON (.geojson/.json), Shapefile (.zip), atau CSV dengan kolom WKT untuk memeriksa apakah lahan tersebut
        beririsan secara geometris dengan AOI yang sedang ditampilkan.
      </div>
      <input ref={fileInputRef} type="file" accept=".geojson,.json,.zip,.csv" onChange={handleFile} style={{ display: "none" }} />
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1B2A22", color: "#EEF0E7", border: "none", padding: "9px 16px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, cursor: "pointer" }}
      >
        <Upload size={14} /> Pilih file
      </button>
      {fileName && <span style={{ marginLeft: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>{fileName}</span>}

      {error && <div style={{ marginTop: 12, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#A23B3B" }}>{error}</div>}

      {uploadedFeatures && !error && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E", marginBottom: 8 }}>
            {uploadedFeatures.length} fitur terbaca &middot; <strong style={{ color: overlapCount ? "#A23B3B" : "#2451A3" }}>{overlapCount} beririsan dengan AOI</strong>,{" "}
            {uploadedFeatures.length - overlapCount} di luar cakupan AOI yang ditampilkan.
          </div>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {uploadedFeatures.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5 }}>
                <span style={{ color: "#1B2A22" }}>{f.properties.__name}</span>
                <span style={{ color: f.properties.__overlap ? "#A23B3B" : "#2451A3", fontWeight: 600 }}>
                  {f.properties.__overlap ? `Overlap dengan ${f.properties.__overlapWith}` : "Di luar AOI"}
                </span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginTop: 8, lineHeight: 1.5 }}>
            Catatan: AOI yang dipakai sebagai acuan di sini adalah poligon dummy NC-1 pada dashboard ini, bukan shapefile Rencana
            Operasional (RO) resmi &mdash; laporan sumber tidak menyertakan geometri RO. Perhitungan irisan geometris (turf.js)
            sendiri sudah nyata; yang ilustratif hanya acuannya.
          </div>
        </div>
      )}
    </div>
  );
}

export function SpatialView({ sites, selected, setSelected, pmuFilter, ipFilter, petaMode }) {
  const isNc1 = pmuFilter === "NC-1";
  const isNarrow = useIsNarrow();
  const mapHeight = isNarrow ? 320 : 480;
  const [colorMode, setColorMode] = useState("jenis");
  const [uploadedFeatures, setUploadedFeatures] = useState(null);

  const nc1Rows = isNc1 ? (ipFilter && ipFilter !== "Semua" ? NC1_IP_TABLE.filter((r) => r.ip === ipFilter) : NC1_IP_TABLE) : [];

  const nc1Features = useMemo(() => {
    if (!isNc1) return null;
    const keys = new Set(nc1Rows.map((r) => `${r.ip}__${r.tipeLahan}`));
    return NC1_AOI_FEATURES.filter((f) => keys.has(`${f.properties.ip}__${f.properties.tipeLahan}`));
  }, [isNc1, ipFilter]);

  if (petaMode === "sebaran") {
    return <PlantingSebaranView ipFilter={ipFilter} />;
  }

  if (petaMode === "provinsi") {
    return <ProvinceChoroplethView />;
  }

  if (isNc1) {
    const hasIpFilter = ipFilter && ipFilter !== "Semua";
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>Warnai AOI berdasarkan</div>
          <ToggleGroup
            value={colorMode}
            onChange={setColorMode}
            options={[
              { value: "jenis", label: "Jenis lahan" },
              { value: "status", label: "Status overlap RO" },
            ]}
          />
        </div>

        <OverlapUploadPanel referenceFeatures={nc1Features || []} onResult={setUploadedFeatures} />

        <div style={{ border: "1px solid #D6D2C4", position: "relative" }}>
          <div style={{ position: "absolute", top: 14, left: 18, zIndex: 500, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#1B2A22", background: "rgba(245,243,234,0.9)", padding: "3px 8px", maxWidth: "80%" }}>
            {hasIpFilter ? `Menampilkan lokasi ${ipFilter}` : "Semua AOI NC-1 (Tabel 6.9) \u2014 pilih IP di atas untuk zoom ke lokasinya"}
          </div>
          <LeafletMap sites={[]} aoiFeatures={nc1Features} height={mapHeight} colorMode={colorMode} uploadedFeatures={uploadedFeatures} />
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "10px 4px 16px" }}>
          {colorMode === "jenis"
            ? Object.entries(NC1_TIPE_COLOR).map(([label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>
                  <span style={{ width: 9, height: 9, background: color, opacity: 0.6, border: `1px solid ${color}`, display: "inline-block" }} />
                  {label}
                </div>
              ))
            : Object.entries(STATUS_META).map(([label, meta]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>
                  <span style={{ width: 9, height: 9, background: meta.color, opacity: 0.6, border: `1px solid ${meta.color}`, display: "inline-block" }} />
                  {label}
                </div>
              ))}
        </div>

        {!hasIpFilter ? (
          <div style={{ border: "1px solid #D6D2C4", padding: 18, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5C5A4E", lineHeight: 1.6 }}>
            Ada {NC1_IP_TABLE.length} entri implementing partner (Tabel 6.9) tersebar di peta. Pilih satu IP dari filter di atas
            untuk melihat detail target/realisasi/karbon serta contoh kelompok tani di bawahnya, dan peta akan otomatis zoom ke
            lokasinya.
          </div>
        ) : (
          <div>
            {nc1Rows.map((row, i) => {
              const feature = (nc1Features || []).find((f) => f.properties.ip === row.ip && f.properties.tipeLahan === row.tipeLahan);
              return (
                <div key={`${row.ip}-${row.tipeLahan}-${i}`} style={{ border: "1px solid #D6D2C4", padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#2C4A3A", marginBottom: 6 }}>
                        PMU NC-1 &middot; {row.provinsi}
                      </div>
                      <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 19, color: "#1B2A22", marginBottom: 10, lineHeight: 1.3 }}>{row.ip}</div>
                      <div style={{ display: "inline-block", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#fff", background: NC1_TIPE_COLOR[row.tipeLahan], padding: "3px 9px" }}>
                        {row.tipeLahan}
                      </div>{" "}
                      <span style={{ display: "inline-block", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#fff", background: STATUS_META[feature?.properties?.roStatus]?.color || "#5C5A4E", padding: "3px 9px" }}>
                        {feature?.properties?.roStatus || "\u2013"}
                      </span>
                    </div>
                    {feature && <DownloadMenu features={[feature]} filename={`${row.ip}-${row.tipeLahan}`.replace(/[^a-z0-9]+/gi, "_")} />}
                  </div>

                  <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: isNarrow ? "1fr 1fr" : "repeat(4, 1fr)", rowGap: 14, columnGap: 12 }}>
                    <Field label="Target luasan" value={row.target != null ? `${fmt1(row.target)} ha` : "\u2013"} />
                    <Field label="Realisasi 2025" value={row.real2025 != null ? `${fmt1(row.real2025)} ha` : "\u2013"} />
                    <Field label="Realisasi 2024" value={row.real2024 != null ? `${fmt1(row.real2024)} ha` : "\u2013"} />
                    <Field label="Adjustment karbon 2025" value={row.baru2025 != null ? `${fmt1(row.baru2025)} ${CO2E}` : "\u2013"} />
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: "#1B2A22", marginBottom: 4 }}>
                      Kelompok / petak (contoh)
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginBottom: 10 }}>
                      Rincian kelompok tani, desa, dan progres monev di bawah ini bersifat ilustratif (dummy) &mdash; laporan sumber
                      hanya melaporkan sampai level implementing partner.
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr", gap: 10 }}>
                      {(NC1_PETAK_BY_ROW[`${row.ip}__${row.tipeLahan}`] || []).map((petak) => (
                        <PetakCard key={petak.id} petak={petak} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <Note tone="neutral">
              Data target/realisasi/karbon di atas bersumber dari Tabel 6.9, Laporan Tahunan FOLU NC-1 TA 2025. Bentuk poligon AOI
              pada peta, status overlap RO, dan rincian kelompok/petak adalah ilustrasi (dummy) karena laporan sumber tidak
              menyertakan geometri spasial, shapefile RO resmi, maupun data sampai level kelompok.
            </Note>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isNarrow ? "column" : "row", gap: 0, alignItems: "stretch" }}>
      <div style={{ flex: isNarrow ? "1 1 auto" : "1 1 62%", border: "1px solid #D6D2C4", borderRight: isNarrow ? "1px solid #D6D2C4" : "none", background: "#EAEBDF", position: "relative" }}>
        <div style={{ position: "absolute", top: 14, left: 18, zIndex: 500, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#1B2A22", background: "rgba(245,243,234,0.9)", padding: "3px 8px" }}>
          Peta interaktif &middot; scroll/tombol untuk zoom, seret untuk geser &middot; klik penanda untuk detail lokasi
        </div>
        <LeafletMap sites={sites} selected={selected} setSelected={setSelected} height={mapHeight} />

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "10px 18px 16px", borderTop: "1px solid #D6D2C4" }}>
          {Object.entries(STATUS_META).map(([label, meta]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E" }}>
              <span style={{ width: 9, height: 9, background: meta.color, opacity: 0.6, border: `1px solid ${meta.color}`, display: "inline-block" }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: isNarrow ? "1 1 auto" : "1 1 38%", border: "1px solid #D6D2C4", padding: 22, background: "#F5F3EA", minHeight: 300, maxHeight: isNarrow ? "none" : 640, overflowY: "auto" }}>
        {!selected ? (
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#5C5A4E", fontSize: 13.5, lineHeight: 1.6 }}>
            Klik salah satu AOI pada peta untuk melihat detail lokasi, status verifikasi, dan keterkaitan datanya dengan Rencana Operasional.
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: PMU_META[selected.pmu].color, marginBottom: 6 }}>
              {PMU_META[selected.pmu].label} &middot; {selected.provinsi}
            </div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 21, color: "#1B2A22", marginBottom: 10, lineHeight: 1.3 }}>
              {selected.name}
            </div>
            <StatusBadge status={selected.status} />

            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 14, columnGap: 12 }}>
              <Field label="Implementing Partner" value={selected.ip} />
              <Field label="Jenis kegiatan" value={selected.kegiatan} />
              <Field label="Luas" value={`${fmt(selected.luas)} ha`} />
              <Field label="Jenis PCK" value={selected.jenisPck} />
              <Field label="Cadangan karbon" value={`${fmt(selected.pck)} tCO\u2082e`} />
              <Field label="Kode lokasi" value={selected.id} />
            </div>

            {selected.status === "Overlap Terdeteksi" && (
              <Note tone="danger">
                Terdeteksi irisan geometri dengan AOI {selected.overlapIp || "IP lain"}. Menunggu klarifikasi lapangan oleh PMU sebelum status ditetapkan TT MRV.
              </Note>
            )}
            {selected.status === "Di Luar RO" && (
              <Note tone="neutral">Lokasi berada di luar cakupan Rencana Operasional. Memerlukan justifikasi tertulis dan persetujuan OMO.</Note>
            )}
            {selected.status === "Perlu Klarifikasi" && (
              <Note tone="warn">Konsistensi data spasial dan capaian fisik belum sepenuhnya terverifikasi.</Note>
            )}

            <MechanismPanel site={selected} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
