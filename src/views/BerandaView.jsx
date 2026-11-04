import React from "react";
import { Note, SectionTitle } from "../components/ui";
import { STRATEGY_ICONS } from "../constants";
import { FOLU_BENEFICIARIES, FOLU_BIDANG, FOLU_BUDGET_2025, FOLU_MITIGATION_ACTIONS, FOLU_NORWAY, FOLU_OUTCOMES, FOLU_PROGRAM_FACTS, NC1_IP_TABLE, NC1_PHYSICAL_2025, NC1_PLANTING, NC1_TOTAL, NEWS, NATIONAL, DATA_SOURCES } from "../data";
import { CO2E, fmt, fmt1 } from "../lib/format";
import { claimable } from "../lib/carbon";
import { SourceBadge } from "../components/SourceBadge";

export function BerandaView({ setTab }) {
  return (
    <div>
      <div style={{ padding: "26px 0 22px", borderBottom: "1px solid #D6D2C4" }}>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#2C4A3A", marginBottom: 8, letterSpacing: 0.3 }}>
          PROGRAM NASIONAL &middot; KEMENTERIAN KEHUTANAN
        </div>
        <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 30, color: "#1B2A22", lineHeight: 1.2, marginBottom: 12, maxWidth: 760 }}>
          Indonesia's FOLU Net Sink 2030
        </div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14.5, color: "#5C5A4E", lineHeight: 1.65, maxWidth: 720, marginBottom: 16 }}>
          {FOLU_PROGRAM_FACTS.definition}
        </div>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 8, background: "#1B2A22", color: "#EEF0E7", padding: "10px 18px" }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>Target program</span>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 17 }}>{FOLU_PROGRAM_FACTS.target}</span>
        </div>
      </div>

      <div style={{ padding: "22px 0" }}>
        <SectionTitle>Dasar hukum</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 6 }}>
          {FOLU_PROGRAM_FACTS.legalBasis.map((lb) => (
            <div key={lb.label} style={{ border: "1px solid #D6D2C4", padding: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1B2A22", marginBottom: 6 }}>{lb.label}</div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E", lineHeight: 1.55 }}>{lb.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 26 }}>
          <SectionTitle>Konteks NDC (Nationally Determined Contribution)</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4", padding: 18, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5C5A4E", lineHeight: 1.7 }}>
            Melalui <strong>{FOLU_PROGRAM_FACTS.ndcContext.updatedAt}</strong>, target penurunan emisi GRK nasional diperkuat dari{" "}
            <strong>{FOLU_PROGRAM_FACTS.ndcContext.before}</strong> menjadi <strong>{FOLU_PROGRAM_FACTS.ndcContext.after}</strong> pada 2030.
            Sektor FOLU menyumbang <strong>{FOLU_PROGRAM_FACTS.ndcContext.foluShare}</strong>, sementara sektor kehutanan secara
            keseluruhan berkontribusi <strong>{FOLU_PROGRAM_FACTS.ndcContext.forestrySectorShare}</strong>.
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <SectionTitle>4 strategi utama</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {FOLU_PROGRAM_FACTS.strategies.map((s) => {
              const Icon = STRATEGY_ICONS[s.icon];
              return (
                <div key={s.key} style={{ border: "1px solid #D6D2C4", padding: 16 }}>
                  <Icon size={18} color="#2C4A3A" strokeWidth={1.8} style={{ marginBottom: 10 }} />
                  <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13.5, color: "#1B2A22", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <SectionTitle>Perjalanan kebijakan</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {FOLU_PROGRAM_FACTS.history.map((h, i) => (
              <div key={h.year} style={{ display: "flex", gap: 16, padding: "13px 18px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#2C4A3A", flex: "0 0 90px" }}>{h.year}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5C5A4E", lineHeight: 1.55 }}>{h.text}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8A8677", marginTop: 8 }}>{FOLU_PROGRAM_FACTS.sourceNote}</div>
        </div>

        <div style={{ marginTop: 26 }}>
          <SectionTitle>5 bidang program & 3 outcome (Theory of Change)</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 16 }}>
            {FOLU_BIDANG.map((b) => (
              <div key={b.key} style={{ border: "1px solid #D6D2C4", padding: 14 }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1B2A22", marginBottom: 5 }}>{b.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {FOLU_OUTCOMES.map((o, i) => (
              <div key={o.key} style={{ padding: "13px 18px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#2C4A3A", marginBottom: 3 }}>{o.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E", lineHeight: 1.55 }}>{o.desc}</div>
              </div>
            ))}
          </div>
          <details style={{ marginTop: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E" }}>
            <summary style={{ cursor: "pointer", color: "#2C4A3A" }}>Lihat 15 kegiatan aksi mitigasi IFNS 2030</summary>
            <ol style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.7 }}>
              {FOLU_MITIGATION_ACTIONS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </details>
        </div>

        <div style={{ marginTop: 26 }}>
          <SectionTitle>Kemitraan Indonesia&ndash;Norwegia</SectionTitle>
          <div style={{ border: "1px solid #D6D2C4", padding: 18, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5C5A4E", lineHeight: 1.7 }}>
            Pada <strong>{FOLU_NORWAY.mouDate}</strong>, {FOLU_NORWAY.mouParties} menandatangani MoU "Partnership in Support of
            Indonesia's Efforts to Reduce Greenhouse Gas Emissions from Forestry and Other Land Use" untuk jangka waktu{" "}
            {FOLU_NORWAY.mouDuration}. Pada <strong>{FOLU_NORWAY.agreementDate}</strong>, kedua pihak menandatangani Perjanjian
            Kontribusi dengan nilai kontribusi berbasis hasil pertama (first result-based contribution) sebesar{" "}
            <strong>USD {fmt(FOLU_NORWAY.firstContributionUsd / 1000000)} juta</strong>, atas reduksi emisi terverifikasi sebesar{" "}
            <strong>{fmt1(FOLU_NORWAY.firstContributionTonCo2e / 1000000)} juta {CO2E}</strong> selama periode {FOLU_NORWAY.firstContributionPeriod}.
            Dana kerja sama ini dikelola oleh {FOLU_NORWAY.fundManager}; Proyek FOLU NC-1 yang datanya ditampilkan pada dashboard ini
            merupakan bagian dari Kontribusi Norwegia Tahap I tersebut.
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <SectionTitle>Contoh capaian riil: NC-1, peningkatan cadangan karbon 2025</SectionTitle>
          <Note tone="neutral">
            Angka berikut adalah data <strong>riil</strong> dari Laporan Tahunan FOLU NC-1 TA 2025, khusus komponen Outcome 1 Bidang
            II (peningkatan cadangan karbon melalui penanaman). Ini hanya sebagian kecil dari keseluruhan target nasional
            {" "}{FOLU_PROGRAM_FACTS.target} &mdash; bukan representasi capaian nasional secara keseluruhan.
          </Note>
          <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginTop: 12 }}>
            {[
              { label: "Realisasi tanam 2025", value: fmt(NC1_PLANTING.realisasi2025Ha), unit: "ha" },
              { label: "Potensi karbon 2025 (adjustment)", value: fmt1(NC1_TOTAL.estimasi), unit: CO2E, accent: true },
              { label: `Nilai klaim konservatif (buffer ${claimable(NC1_TOTAL).buffer}%)`, value: fmt1(claimable(NC1_TOTAL).value), unit: CO2E },
              { label: "Implementing partner terlibat", value: fmt(new Set(NC1_IP_TABLE.map((r) => r.ip)).size), unit: "IP" },
            ].map((it, i) => (
              <div key={it.label} style={{ flex: "1 1 200px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 22, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                  {it.value}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
            {[
              ["pengukuran", "Lihat rincian Pengukuran \u2192"],
              ["pelaporan", "Lihat kinerja nasional (Lapis A) \u2192"],
              ["karbon", "Lihat detail Karbon NC-1 \u2192"],
              ["peta", "Buka Peta lokasi kegiatan \u2192"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  background: "#1B2A22",
                  color: "#EEF0E7",
                  border: "none",
                  padding: "10px 16px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <SectionTitle>Capaian fisik penanaman 2025 (aforestasi vs. reforestasi)</SectionTitle>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677", marginTop: -8, marginBottom: 10 }}>
            Data riil dari Tabel 6.8 (Capaian Fisik Direct Mitigation) &mdash; tabel fisik terpisah dari Tabel 6.9, sehingga
            totalnya sedikit berbeda dari angka adjustment karbon di atas.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4" }}>
            {[
              { label: "Target penanaman", value: fmt(NC1_PHYSICAL_2025.targetHa), unit: "ha" },
              { label: "Realisasi (% target)", value: `${fmt(NC1_PHYSICAL_2025.realisasiHa)} ha`, unit: `${NC1_PHYSICAL_2025.pctOfTarget}%` },
              { label: "Aforestasi", value: fmt(NC1_PHYSICAL_2025.aforestasiHa), unit: "ha" },
              { label: "Reforestasi", value: fmt(NC1_PHYSICAL_2025.reforestasiHa), unit: `ha (${NC1_PHYSICAL_2025.pctReforestasiOfRealisasi}%)`, accent: true },
            ].map((it, i) => (
              <div key={it.label} style={{ flex: "1 1 170px", padding: "16px 18px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 19, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                  {it.value}
                  <span style={{ fontSize: 11.5, fontWeight: 400, color: "#5C5A4E", marginLeft: 4 }}>{it.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <SectionTitle>Penerima manfaat (data riil, Tabel 6.7)</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginBottom: 12 }}>
            {[
              { label: "Total penerima manfaat", value: fmt(FOLU_BENEFICIARIES.total), unit: `dari ${FOLU_BENEFICIARIES.ipCount} IP`, accent: true },
              { label: "Laki-laki", value: fmt(FOLU_BENEFICIARIES.lakiLaki), unit: `${((FOLU_BENEFICIARIES.lakiLaki / FOLU_BENEFICIARIES.total) * 100).toFixed(1)}%` },
              { label: "Perempuan", value: fmt(FOLU_BENEFICIARIES.perempuan), unit: `${((FOLU_BENEFICIARIES.perempuan / FOLU_BENEFICIARIES.total) * 100).toFixed(1)}%` },
            ].map((it, i) => (
              <div key={it.label} style={{ flex: "1 1 190px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 22, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                  {it.value}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {FOLU_BENEFICIARIES.categories.map((c, i) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6", gap: 12 }}>
                <div style={{ flex: "1 1 200px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#1B2A22" }}>{c.label}</div>
                <div style={{ flex: "2 1 200px", background: "#EDEAD9", height: 8, position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${c.pct}%`, background: "#2C4A3A" }} />
                </div>
                <div style={{ flex: "0 0 90px", textAlign: "right", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5C5A4E" }}>
                  {fmt(c.total)} ({c.pct}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <SectionTitle>Realisasi anggaran 2025 (data riil, Tabel 4.1)</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4", marginBottom: 12 }}>
            {[
              { label: "Pagu AWP 2025", value: `Rp ${fmt1(FOLU_BUDGET_2025.paguAwp2025 / 1e9)} M` },
              { label: "Realisasi 2025", value: `Rp ${fmt1(FOLU_BUDGET_2025.realisasi2025 / 1e9)} M`, unit: `${FOLU_BUDGET_2025.persenRealisasi}%`, accent: true },
              { label: "Sisa anggaran", value: `Rp ${fmt1(FOLU_BUDGET_2025.sisaAnggaran / 1e9)} M` },
            ].map((it, i) => (
              <div key={it.label} style={{ flex: "1 1 190px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 20, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                  {it.value}
                  {it.unit && <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid #D6D2C4" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5 }}>
              <thead>
                <tr>
                  {["Program", "Pagu AWP 2025 (Rp M)", "Realisasi (Rp M)", "% Realisasi"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Program" ? "left" : "right", padding: "9px 14px", color: "#5C5A4E", fontWeight: 500, fontSize: 11.5, borderBottom: "1px solid #D6D2C4" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FOLU_BUDGET_2025.perProgram.map((p) => (
                  <tr key={p.program} style={{ borderTop: "1px solid #E5E2D6" }}>
                    <td style={{ padding: "9px 14px", color: "#1B2A22" }}>{p.program}</td>
                    <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{fmt1(p.awp / 1e9)}</td>
                    <td style={{ padding: "9px 14px", color: "#5C5A4E", textAlign: "right" }}>{fmt1(p.realisasi / 1e9)}</td>
                    <td style={{ padding: "9px 14px", color: "#2C4A3A", fontWeight: 500, textAlign: "right" }}>{p.persen}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <SectionTitle>Kinerja pengurangan emisi nasional (Lapis A)</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #D6D2C4" }}>
            {[
              { label: `Baseline FREL (${NATIONAL.baseline.periode})`, value: fmt1(NATIONAL.baseline.nilai), unit: "juta tCO\u2082e/tahun" },
              ...NATIONAL.kontribusi.slice(-2).map((k) => ({ label: `Pengurangan emisi ${k.periode}`, value: fmt1(k.erJutaTco2e), unit: "juta tCO\u2082e", accent: true })),
            ].map((it, i) => (
              <div key={it.label} style={{ flex: "1 1 200px", padding: "16px 20px", borderLeft: i === 0 ? "none" : "1px solid #D6D2C4" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#5C5A4E", marginBottom: 4 }}>{it.label}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 22, color: it.accent ? "#2C4A3A" : "#1B2A22" }}>
                  {it.value}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#5C5A4E", marginLeft: 5 }}>{it.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <SourceBadge source={DATA_SOURCES.national} compact />
            <button onClick={() => setTab("pelaporan")} style={{ background: "none", border: "none", padding: 0, color: "#2C4A3A", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, cursor: "pointer", textDecoration: "underline" }}>
              Lihat rincian per periode RBC dan target ENDC
            </button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <SectionTitle>Berita terbaru <SourceBadge source={DATA_SOURCES.news} compact /></SectionTitle>
          <div style={{ border: "1px solid #D6D2C4" }}>
            {NEWS.map((n, i) => (
              <div key={n.title} style={{ padding: "16px 18px", borderTop: i === 0 ? "none" : "1px solid #E5E2D6" }}>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677", marginBottom: 4 }}>{n.date}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 14.5, color: "#1B2A22", marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5C5A4E", lineHeight: 1.55 }}>{n.excerpt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
