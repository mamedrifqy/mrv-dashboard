import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { Note, SectionTitle, Select, ToggleGroup } from "../components/ui";
import { KARBON_CATEGORIES } from "../constants";
import { ALL_IP_ROWS } from "../data/legacy";
import { MUDA_FORMULA_OPTIONS, computeCarbonFromMeasurement } from "../lib/carbon";
import { CO2E, fmt, fmt1 } from "../lib/format";

export const ALL_MEASUREMENT_IPS = Array.from(new Set(ALL_IP_ROWS.map((r) => r.ip))).sort();

export function seedMeasurementEntry(id, ip, jenis, jumlah, diameter, tinggi, tanggal) {
  const calc = computeCarbonFromMeasurement({ jenis, fase: "muda", jumlahTanaman: jumlah, diameter, tinggi });
  return { id, ip, jenis, fase: "muda", jumlah, diameter, tinggi, tanggal, ...calc };
}

export const SEED_MEASUREMENT_ENTRIES = [
  seedMeasurementEntry(1, "Ditjen PDASRH", "Terestrial", 320, 3.2, 2.1, "12 Agu 2025"),
  seedMeasurementEntry(2, "Ditjen PDASRH", "Mangrove", 210, 2.4, 1.6, "15 Agu 2025"),
  seedMeasurementEntry(3, "Ditjen PDASRH", "Gambut", 180, 2.8, 1.9, "20 Agu 2025"),
  seedMeasurementEntry(4, "YBLL", "Bambu", 90, 4.5, 3.0, "02 Sep 2025"),
  seedMeasurementEntry(5, "Ditjen PSKL", "Agroforestri/MPTS", 140, 3.0, 2.0, "08 Sep 2025"),
  seedMeasurementEntry(6, "IP Katingan Mitra", "Gambut", 260, 3.6, 2.3, "14 Sep 2025"),
];

export function MeasurementView() {
  const [ip, setIp] = useState(ALL_MEASUREMENT_IPS[0]);
  const [jenis, setJenis] = useState(KARBON_CATEGORIES[0].key);
  const [fase, setFase] = useState("muda");
  const [mudaSumber, setMudaSumber] = useState("adinugroho");
  const [density, setDensity] = useState(0.5);
  const [jumlah, setJumlah] = useState(100);
  const [diameter, setDiameter] = useState(3);
  const [tinggi, setTinggi] = useState(2);
  const [entries, setEntries] = useState(SEED_MEASUREMENT_ENTRIES);
  const [viewMode, setViewMode] = useState("total");

  const mudaOptions = MUDA_FORMULA_OPTIONS[jenis];

  const handleJenisChange = (val) => {
    setJenis(val);
    setMudaSumber("adinugroho");
  };

  const preview = computeCarbonFromMeasurement({ jenis, fase, mudaSumber, jumlahTanaman: Number(jumlah) || 0, diameter: Number(diameter) || 0, tinggi: Number(tinggi) || 0, density: Number(density) || 0.5 });

  const handleAdd = () => {
    const calc = computeCarbonFromMeasurement({ jenis, fase, mudaSumber, jumlahTanaman: Number(jumlah) || 0, diameter: Number(diameter) || 0, tinggi: Number(tinggi) || 0, density: Number(density) || 0.5 });
    setEntries((prev) => [
      { id: Date.now(), ip, jenis, fase, jumlah: Number(jumlah), diameter: Number(diameter), tinggi: Number(tinggi), tanggal: "Input baru", ...calc },
      ...prev,
    ]);
  };

  const totalCo2e = entries.reduce((a, e) => a + e.totalCo2eTon, 0);
  const totalPohon = entries.reduce((a, e) => a + e.jumlah, 0);
  const byJenis = KARBON_CATEGORIES.map((c) => ({
    ...c,
    total: entries.filter((e) => e.jenis === c.key).reduce((a, e) => a + e.totalCo2eTon, 0),
    pohon: entries.filter((e) => e.jenis === c.key).reduce((a, e) => a + e.jumlah, 0),
    entriCount: entries.filter((e) => e.jenis === c.key).length,
  })).filter((c) => c.entriCount > 0);

  return (
    <div>
      <Note tone="warn">
        Halaman ini adalah <strong>simulasi input pengukuran lapangan (dummy)</strong> untuk mengilustrasikan alur kerja MRV: data
        lapangan (jumlah tanaman hidup, diameter, tinggi) &rarr; perhitungan biomassa &rarr; potensi karbon. Rumus perhitungan di
        bawah <strong>sama persis</strong> dengan metodologi adjustment alometrik pada Laporan Tahunan FOLU NC-1 TA 2025, tetapi
        entri data di sini bersifat contoh, bukan data lapangan sungguhan.
      </Note>

      <div style={{ border: "1px solid #D6D2C4", padding: "20px 22px", marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <SectionTitle>Input pengukuran petak/kelompok</SectionTitle>
          <ToggleGroup
            value={fase}
            onChange={setFase}
            options={[
              { value: "muda", label: "Tanaman muda (D<5cm)" },
              { value: "dewasa", label: "Tegakan dewasa" },
            ]}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>Implementing Partner</div>
            <Select label="IP" value={ip} onChange={setIp} options={ALL_MEASUREMENT_IPS} renderLabel={(o) => o} />
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>Jenis lahan</div>
            <Select label="Jenis" value={jenis} onChange={handleJenisChange} options={KARBON_CATEGORIES.map((c) => c.key)} renderLabel={(o) => o} />
          </div>
          {fase === "muda" && mudaOptions && mudaOptions.length > 1 && (
            <div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>Sumber rumus</div>
              <Select label="Sumber" value={mudaSumber} onChange={setMudaSumber} options={mudaOptions.map((o) => o.key)} renderLabel={(k) => mudaOptions.find((o) => o.key === k).label} />
            </div>
          )}
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>Jumlah tanaman hidup</div>
            <input type="number" min="0" value={jumlah} onChange={(e) => setJumlah(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, border: "1px solid #D6D2C4" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>{fase === "muda" && (mudaSumber === "utami" || mudaSumber === "mulyana_semai") ? "Diameter PANGKAL rata-rata (cm)" : "Diameter rata-rata (cm)"}</div>
            <input type="number" min="0" step="0.1" value={diameter} onChange={(e) => setDiameter(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, border: "1px solid #D6D2C4" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>Tinggi rata-rata (m)</div>
            <input type="number" min="0" step="0.1" value={tinggi} onChange={(e) => setTinggi(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, border: "1px solid #D6D2C4" }} />
          </div>
          {fase === "dewasa" && (
            <div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>Kerapatan kayu &rho; (g/cm&sup3;)</div>
              <input type="number" min="0.1" step="0.05" value={density} onChange={(e) => setDensity(e.target.value)} style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, border: "1px solid #D6D2C4" }} />
            </div>
          )}
        </div>

        {preview.formulaNote && (
          <div style={{ marginBottom: 14, padding: "10px 14px", background: "#F5ECD8", border: "1px solid #E0CFA0", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#7A5C1E", lineHeight: 1.5 }}>
            {preview.formulaNote}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 0, border: "1px solid #D6D2C4", marginBottom: 16 }}>
          {[
            { label: "AGB / tanaman", value: preview.agbPerTree == null ? "\u2013" : `${fmt1(preview.agbPerTree)} kg` },
            { label: "Biomassa total / tanaman", value: `${fmt1(preview.totalBiomassaPerTree)} kg` },
            { label: "Karbon / tanaman", value: `${fmt1(preview.carbonPerTree)} kg` },
            { label: "Potensi karbon total", value: `${fmt1(preview.totalCo2eTon)} ${CO2E}`, accent: true },
          ].map((it, i) => (
            <div key={it.label} style={{ flex: "1 1 150px", padding: "14px 16px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>{it.value}</div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1B2A22", color: "#EEF0E7", border: "none", padding: "10px 18px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, cursor: "pointer" }}
        >
          <Calculator size={14} /> Tambah entri pengukuran
        </button>

        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginTop: 10, lineHeight: 1.6 }}>
          Rumus dipakai: <strong>{preview.formulaLabel}</strong>. Karbon = biomassa &times; 0,47 (kecuali rumus karbon-langsung) &middot; CO&#8322;e = Karbon &times; 44/12
          (sama untuk semua rumus).
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <SectionTitle>Rekap entri pengukuran</SectionTitle>
        <ToggleGroup
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: "total", label: "Total" },
            { value: "perjenis", label: "Per jenis lahan" },
          ]}
        />
      </div>

      {viewMode === "total" ? (
        <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4" }}>
          {[
            { label: "Jumlah entri", value: fmt(entries.length), unit: "entri" },
            { label: "Total tanaman hidup", value: fmt(totalPohon), unit: "batang" },
            { label: "Total potensi karbon", value: fmt1(totalCo2e), unit: CO2E, accent: true },
          ].map((it, i) => (
            <div key={it.label} style={{ flex: "1 1 180px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 22, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                {it.value}
                <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4" }}>
          {byJenis.map((c, i) => (
            <div key={c.key} style={{ flex: "1 1 160px", padding: "16px 18px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <span style={{ width: 9, height: 9, background: c.color, display: "inline-block" }} />
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E" }}>{c.key}</span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 19, color: "#1B2A22" }}>
                {fmt1(c.total)} <span style={{ fontSize: 11.5, fontWeight: 400, color: "#5C5A4E" }}>{CO2E}</span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginTop: 2 }}>
                {fmt(c.pohon)} batang &middot; {c.entriCount} entri
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 18, border: "1px solid #D6D2C4", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, minWidth: 640 }}>
          <thead>
            <tr>
              {["Tanggal", "IP", "Jenis lahan", "Fase", "Jumlah tanaman", "Diameter (cm)", "Tinggi (m)", `Potensi karbon (${CO2E})`].map((h) => (
                <th key={h} style={{ textAlign: h === "Tanggal" || h === "IP" || h === "Jenis lahan" || h === "Fase" ? "left" : "right", padding: "9px 14px", color: "#5C5A4E", fontWeight: 500, fontSize: 11.5, borderBottom: "1px solid #D6D2C4" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(viewMode === "perjenis" ? [...entries].sort((a, b) => a.jenis.localeCompare(b.jenis)) : entries).map((e) => (
              <tr key={e.id} style={{ borderTop: "1px solid #E5E2D6" }}>
                <td style={{ padding: "9px 14px", color: "#8A8677" }}>{e.tanggal}</td>
                <td style={{ padding: "9px 14px", color: "#1B2A22" }}>{e.ip}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, background: KARBON_CATEGORIES.find((c) => c.key === e.jenis)?.color, display: "inline-block" }} />
                    {e.jenis}
                  </span>
                </td>
                <td style={{ padding: "9px 14px", color: "#5C5A4E" }}>{e.fase === "dewasa" ? "Dewasa" : "Muda"}</td>
                <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{fmt(e.jumlah)}</td>
                <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{fmt1(e.diameter)}</td>
                <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{fmt1(e.tinggi)}</td>
                <td style={{ padding: "9px 14px", color: "#2C4A3A", fontWeight: 500, textAlign: "right" }}>{fmt1(e.totalCo2eTon)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
