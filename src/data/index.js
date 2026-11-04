// ---------------------------------------------------------------------------
// Satu pintu untuk seluruh data dashboard.
//
// Setiap berkas JSON memuat objek `source` = { status, dokumen, asOf } dengan
// status "riil" (dari dokumen resmi) atau "dummy" (data contoh). Berkas data
// contoh diberi akhiran `.dummy.json` agar tidak tertukar dengan data riil.
// Komponen membaca status ini untuk menampilkan label sumber dan banner mode
// demo (lihat components/SourceBadge.jsx).
// ---------------------------------------------------------------------------
import { TreePine, Waves, Droplets, Sprout } from "lucide-react";
import program from "./program.json";
import national from "./national.json";
import sitesDummy from "./sites.dummy.json";
import nc23Aoi from "./nc23-aoi.dummy.json";
import newsDummy from "./news.dummy.json";
import nc1 from "./pck/nc1.json";
import nc23 from "./pck/nc23.json";
import nc4 from "./pck/nc4.dummy.json";

const ICONS = { TreePine, Waves, Droplets, Sprout };
const withIcons = (items) => items.map((it) => ({ ...it, icon: ICONS[it.icon] || TreePine }));

function toReport(json) {
  return {
    ...json,
    isDummy: json.source.status !== "riil",
    interventions: withIcons(json.interventions),
  };
}

// --- Registry sumber data (dipakai banner & badge) ---------------------------
export const DATA_SOURCES = {
  program: program.source,
  national: national.source,
  sites: sitesDummy.source,
  "nc23-aoi": nc23Aoi.source,
  news: newsDummy.source,
  "pck-NC-1": nc1.source,
  "pck-NC-2&3": nc23.source,
  "pck-NC-4": nc4.source,
  measurement: { status: "dummy", dokumen: "Entri pengukuran contoh (rumus alometrik riil, data lapangan contoh)", asOf: "\u2014" },
  "nc1-aoi": { status: "dummy", dokumen: "Bentuk poligon AOI dan status RO NC-1 adalah ilustrasi; angka IP dari Tabel 6.9 riil", asOf: "\u2014" },
  provinsi: { status: "dummy", dokumen: "Atribut provinsi (emisi GRK, RO, small grant, KTH, anggaran) belum terverifikasi; metode kolom GHG belum terdokumentasi", asOf: "\u2014" },
  sebaran: { status: "dummy", dokumen: "Sebaran titik penanaman per unit pelaksana (data contoh)", asOf: "\u2014" },
};

// --- Lapis A: kinerja nasional ----------------------------------------------
export const NATIONAL = national;

// --- Program (konteks Beranda) -----------------------------------------------
export const FOLU_PROGRAM_FACTS = program.facts;
export const FOLU_BENEFICIARIES = program.beneficiaries;
export const FOLU_BUDGET_2025 = program.budget2025;
export const NC1_PHYSICAL_2025 = program.nc1Physical2025;
export const FOLU_BIDANG = program.bidang;
export const FOLU_OUTCOMES = program.outcomes;
export const FOLU_NORWAY = program.norway;
export const FOLU_MITIGATION_ACTIONS = program.mitigationActions;
export const NEWS = newsDummy.items;

// --- Lapis B: PCK per PMU ----------------------------------------------------
export const REPORT_DATA = {
  "NC-1": toReport(nc1),
  "NC-2&3": toReport(nc23),
  "NC-4": toReport(nc4),
};

export const NC1_REPORT_META = nc1.meta;
export const NC1_PLANTING = nc1.planting;
export const NC1_TOTAL = nc1.total;
export const NC1_IP_TABLE = nc1.ipTable;

// Seluruh baris IP lintas PMU, masing-masing membawa flag isDummy.
export const ALL_IP_ROWS = Object.entries(REPORT_DATA).flatMap(([pmu, rep]) =>
  rep.ipTable.map((r) => ({ ...r, pmu, isDummy: rep.isDummy }))
);
export const REAL_IP_ROWS = ALL_IP_ROWS.filter((r) => !r.isDummy);
export const DUMMY_PMUS = Object.keys(REPORT_DATA).filter((k) => REPORT_DATA[k].isDummy);

// --- Data contoh untuk tampilan Peta ----------------------------------------
// AOI NC-2&3: nama IP, tipe lahan, luas rencana dan luas realisasi dibaca langsung
// dari pck/nc23.json (riil). Hanya baris dengan realisasi > 0 yang punya AOI.
// Posisi, provinsi, status verifikasi dan catatan berasal dari nc23-aoi.dummy.json
// (ilustrasi). PCK = potensi karbon 2025 dari laporan (null bila belum dilaporkan).
const nc23Sites = nc23.ipTable
  .filter((r) => (r.real2025 || 0) > 0)
  .flatMap((r) => {
    const d = nc23Aoi.aoi[`${r.ip}|${r.tipeLahan}`];
    if (!d) {
      console.warn(`AOI NC-2&3 belum punya atribut ilustrasi: ${r.ip} (${r.tipeLahan})`);
      return [];
    }
    const mangrove = r.tipeLahan === "Mangrove";
    return [
      {
        id: `N23-${String(r.no).padStart(2, "0")}`,
        name: `AOI ${r.ip} \u2014 ${r.tipeLahan}`,
        provinsi: d.provinsi,
        pmu: "NC-2&3",
        ip: r.ip,
        kegiatan: mangrove ? "Rehabilitasi Mangrove" : "Rehabilitasi Lahan",
        luas: r.real2025,
        luasRencana: r.target,
        jenisPck: mangrove ? "Mangrove" : "Terestrial",
        pck: r.baru2025 ?? null,
        status: d.status,
        lat: d.lat,
        lng: d.lng,
        overlapIp: d.overlapIp,
        catatan: d.catatan,
        ilustrasiLokasi: true,
      },
    ];
  });

export const SITES = [...sitesDummy.sites, ...nc23Sites];
