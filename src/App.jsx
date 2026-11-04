import React, { useState, useMemo, useEffect } from "react";
import { Filter } from "lucide-react";
import { KpiStrip, Nc1PetaKpiStrip, Select, ToggleGroup } from "./components/ui";
import { PMU_META, STATUS_META } from "./constants";
import { ALL_IP_ROWS, EMISSION_YEARS, NC1_IP_TABLE, REPORT_DATA, SITES } from "./data/legacy";
import { BerandaView } from "./views/BerandaView";
import { CarbonView } from "./views/CarbonView";
import { MeasurementView } from "./views/MeasurementView";
import { ReportingView } from "./views/ReportingView";
import { SpatialView } from "./views/SpatialView";

export default function App() {
  const [tab, setTab] = useState("beranda");
  const [year, setYear] = useState(EMISSION_YEARS[EMISSION_YEARS.length - 1]);
  const [pmuFilter, setPmuFilter] = useState("Semua");
  const [ipFilter, setIpFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selected, setSelected] = useState(null);
  const [petaMode, setPetaMode] = useState("lokasi");
  const [sebaranIpList, setSebaranIpList] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}folu_nc1_planting_ip.geojson`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSebaranIpList(Array.from(new Set(data.features.map((f) => f.properties.ip))).sort());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const ipOptions = useMemo(() => {
    if (tab === "karbon") {
      const scoped = pmuFilter === "Semua" ? ALL_IP_ROWS : ALL_IP_ROWS.filter((r) => r.pmu === pmuFilter);
      return ["Semua", ...Array.from(new Set(scoped.map((r) => r.ip))).sort()];
    }
    if (tab === "peta" && petaMode === "sebaran") {
      return ["Semua", ...(sebaranIpList || [])];
    }
    if (tab === "peta" && pmuFilter === "NC-1") {
      return ["Semua", ...Array.from(new Set(NC1_IP_TABLE.map((r) => r.ip)))];
    }
    const scoped = pmuFilter === "Semua" ? SITES : SITES.filter((s) => s.pmu === pmuFilter);
    return ["Semua", ...Array.from(new Set(scoped.map((s) => s.ip))).sort()];
  }, [pmuFilter, tab, petaMode, sebaranIpList]);

  useEffect(() => {
    setIpFilter("Semua");
  }, [tab, petaMode]);

  const handlePmuChange = (val) => {
    setPmuFilter(val);
    setIpFilter("Semua");
  };

  const filteredSites = SITES.filter(
    (s) =>
      (pmuFilter === "Semua" || s.pmu === pmuFilter) &&
      (ipFilter === "Semua" || s.ip === ipFilter) &&
      (statusFilter === "Semua" || s.status === statusFilter)
  );

  const isKarbonReportPanel = tab === "karbon" && !!REPORT_DATA[pmuFilter];

  return (
    <div style={{ background: "#EEF0E7", minHeight: "100%", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div style={{ background: "#1B2A22", color: "#EEF0E7", padding: "16px 26px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 19 }}>Dashboard MRV</span>
            <span style={{ fontSize: 12.5, color: "#B7BBA8" }}>Indonesia's FOLU Net Sink 2030</span>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", rowGap: 8 }}>
            {[
              ["beranda", "Beranda"],
              ["pengukuran", "Pengukuran"],
              ["pelaporan", "Pelaporan"],
              ["peta", "Peta"],
              ["karbon", "Karbon"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 14,
                  color: tab === key ? "#EEF0E7" : "#8B9186",
                  borderBottom: tab === key ? "2px solid #EEF0E7" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "peta" && pmuFilter === "NC-1" && petaMode === "lokasi" && <Nc1PetaKpiStrip ipFilter={ipFilter} />}
      {((tab === "peta" && petaMode === "lokasi" && pmuFilter !== "NC-1") || (tab === "karbon" && !isKarbonReportPanel)) && <KpiStrip sites={filteredSites} />}

      <div style={{ padding: "18px 26px 40px", maxWidth: 1180, margin: "0 auto" }}>
        {tab === "peta" && (
          <div style={{ marginBottom: 16 }}>
            <ToggleGroup
              value={petaMode}
              onChange={setPetaMode}
              options={[
                { value: "lokasi", label: "Lokasi AOI" },
                { value: "sebaran", label: "Sebaran Penanaman (Semua IP)" },
                { value: "provinsi", label: "Choropleth Provinsi" },
              ]}
            />
          </div>
        )}

        {((tab === "peta" && petaMode !== "provinsi") || tab === "karbon") && (
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#5C5A4E", fontSize: 12.5 }}>
              <Filter size={13} /> Filter
            </div>
            {!(tab === "peta" && petaMode === "sebaran") && (
              <Select label="PMU" value={pmuFilter} onChange={handlePmuChange} options={["Semua", ...Object.keys(PMU_META)]} renderLabel={(o) => (o === "Semua" ? "Semua PMU" : PMU_META[o].label)} />
            )}
            <Select label="IP" value={ipFilter} onChange={setIpFilter} options={ipOptions} renderLabel={(o) => (o === "Semua" ? "Semua IP" : o)} />
            {tab === "peta" && petaMode === "lokasi" && pmuFilter !== "NC-1" && (
              <Select label="Status" value={statusFilter} onChange={setStatusFilter} options={["Semua", ...Object.keys(STATUS_META)]} renderLabel={(o) => o} />
            )}
            {tab === "peta" && petaMode === "lokasi" && pmuFilter === "NC-1" && (
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8A8677", fontStyle: "italic" }}>
                Menampilkan data riil Tabel 6.9 (IP asli, bukan status verifikasi dummy)
              </span>
            )}
            {tab === "peta" && petaMode === "sebaran" && (
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8A8677", fontStyle: "italic" }}>
                52 unit pelaksana di seluruh Indonesia (data dummy)
              </span>
            )}
          </div>
        )}
        {tab === "peta" && petaMode === "provinsi" && (
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8A8677", fontStyle: "italic", marginBottom: 16 }}>
            Data gabungan tingkat provinsi &mdash; filter PMU/IP tidak berlaku untuk tampilan ini.
          </div>
        )}

        {tab === "beranda" && <BerandaView year={year} setTab={setTab} />}
        {tab === "pengukuran" && <MeasurementView />}
        {tab === "pelaporan" && <ReportingView />}
        {tab === "peta" && <SpatialView sites={filteredSites} selected={selected} setSelected={setSelected} pmuFilter={pmuFilter} ipFilter={ipFilter} petaMode={petaMode} />}
        {tab === "karbon" && <CarbonView sites={filteredSites} pmuFilter={pmuFilter} ipFilter={ipFilter} />}

        <div style={{ marginTop: 22, fontSize: 11.5, color: "#8A8677", lineHeight: 1.6 }}>
          {tab === "peta" || tab === "karbon"
            ? "Peta dasar dan batas provinsi bersumber dari data geografis riil (citra satelit Esri & GeoJSON provinsi Indonesia) sehingga dapat di-zoom dan digeser. Namun lokasi AOI, IP, dan angka capaian/karbon pada peta ini tetap data contoh (dummy) untuk keperluan demonstrasi antarmuka, disusun mengikuti struktur Pedoman MRV Terpadu Indonesia's FOLU Net Sink 2030. Belum merepresentasikan capaian aktual program."
            : "Seluruh angka baseline, capaian aktual, dan pengurangan emisi pada halaman ini adalah data contoh (dummy) untuk keperluan demonstrasi antarmuka. Belum merepresentasikan capaian aktual program."}
        </div>
      </div>
    </div>
  );
}
