import { TreePine, Waves, Sprout, Droplets } from "lucide-react";

// cx / cy are placed on the real province geometry below (in map units),
// hand-offset where a province holds more than one site so markers don't stack.
export const SITES = [
  { id: "S01", name: "Blok Rehabilitasi Siak Kecil", provinsi: "Riau", pmu: "NC-1", ip: "IP Riau Lestari", kegiatan: "Rehabilitasi Mangrove", luas: 128, jenisPck: "Mangrove", pck: 4210, status: "Terverifikasi", lat: 1.15, lng: 102.05 },
  { id: "S02", name: "Blok Penanaman Kampar Kiri", provinsi: "Riau", pmu: "NC-1", ip: "IP Riau Lestari", kegiatan: "Rehabilitasi Lahan", luas: 340, jenisPck: "Terestrial", pck: 9850, status: "Terverifikasi", lat: 0.35, lng: 100.95 },
  { id: "S03", name: "Blok Konservasi Batang Toru", provinsi: "Sumatera Utara", pmu: "NC-1", ip: "IP Sumut Hijau", kegiatan: "Konservasi", luas: 95, jenisPck: "Terestrial", pck: 3120, status: "Perlu Klarifikasi", lat: 1.55, lng: 99.15 },
  { id: "S04", name: "Blok Mangrove Sembilang", provinsi: "Sumatera Selatan", pmu: "NC-1", ip: "IP Sumsel Bakau", kegiatan: "Rehabilitasi Mangrove", luas: 210, jenisPck: "Mangrove", pck: 7460, status: "Overlap Terdeteksi", lat: -2.06, lng: 104.66, overlapIp: "IP Sumsel Bakau Mitra" },
  { id: "S05", name: "Blok Penanaman Kapuas Hulu", provinsi: "Kalimantan Barat", pmu: "NC-2&3", ip: "IP Borneo Asri", kegiatan: "Rehabilitasi Lahan", luas: 415, jenisPck: "Terestrial", pck: 11230, status: "Terverifikasi", lat: 0.85, lng: 112.9 },
  { id: "S06", name: "Blok Gambut Katingan", provinsi: "Kalimantan Tengah", pmu: "NC-2&3", ip: "IP Katingan Mitra", kegiatan: "Rehabilitasi Lahan", luas: 520, jenisPck: "Terestrial", pck: 14980, status: "Terverifikasi", lat: -1.9, lng: 113.3 },
  { id: "S07", name: "Blok Cegah Deforestasi Sebangau", provinsi: "Kalimantan Tengah", pmu: "NC-2&3", ip: "IP Katingan Mitra", kegiatan: "Konservasi", luas: 610, jenisPck: "Deforestasi", pck: 16240, status: "Terverifikasi", lat: -2.3, lng: 113.8 },
  { id: "S08", name: "Blok Rehabilitasi Kutai Barat", provinsi: "Kalimantan Timur", pmu: "NC-2&3", ip: "IP Kaltim Asri", kegiatan: "Rehabilitasi Lahan", luas: 280, jenisPck: "Terestrial", pck: 8010, status: "Perlu Klarifikasi", lat: -0.4, lng: 115.6 },
  { id: "S09", name: "Blok Mangrove Teluk Balikpapan", provinsi: "Kalimantan Timur", pmu: "NC-2&3", ip: "IP Kaltim Asri", kegiatan: "Rehabilitasi Mangrove", luas: 76, jenisPck: "Mangrove", pck: 2650, status: "Di Luar RO", lat: -1.25, lng: 116.75 },
  { id: "S10", name: "Blok Konservasi Wallacea", provinsi: "Sulawesi Tengah", pmu: "NC-2&3", ip: "IP Sulteng Mandiri", kegiatan: "Konservasi", luas: 190, jenisPck: "Terestrial", pck: 5320, status: "Terverifikasi", lat: -1.4, lng: 121.4 },
  { id: "S11", name: "Blok Rehabilitasi Merauke", provinsi: "Papua Selatan", pmu: "NC-4", ip: "IP Papua Tumbuh", kegiatan: "Rehabilitasi Lahan", luas: 380, jenisPck: "Terestrial", pck: 10420, status: "Terverifikasi", lat: -8.47, lng: 140.4 },
  { id: "S12", name: "Blok Mangrove Mimika", provinsi: "Papua Tengah", pmu: "NC-4", ip: "IP Papua Tumbuh", kegiatan: "Rehabilitasi Mangrove", luas: 152, jenisPck: "Mangrove", pck: 5680, status: "Terverifikasi", lat: -4.5, lng: 136.9 },
  { id: "S13", name: "Blok Cegah Deforestasi Mamberamo", provinsi: "Papua", pmu: "NC-4", ip: "IP Papua Tumbuh", kegiatan: "Konservasi", luas: 705, jenisPck: "Deforestasi", pck: 19870, status: "Terverifikasi", lat: -2.0, lng: 137.8 },
  { id: "S14", name: "Blok Penanaman Sorong Selatan", provinsi: "Papua Barat Daya", pmu: "NC-4", ip: "IP Papua Barat Lestari", kegiatan: "Rehabilitasi Lahan", luas: 165, jenisPck: "Terestrial", pck: 4590, status: "Perlu Klarifikasi", lat: -1.6, lng: 131.6 },
];

// Target program: net sink -140 juta tCO2e pada 2030 (Perpres 98/2021).
// Nilai antar-tahun adalah interpolasi dummy menuju target tersebut.
export const TREND = [
  { tahun: 2021, target: 180, capaian: 205 },
  { tahun: 2022, target: 110, capaian: 128 },
  { tahun: 2023, target: 40, capaian: 62 },
  { tahun: 2024, target: -20, capaian: 5 },
  { tahun: 2025, target: -60, capaian: -32 },
  { tahun: 2026, target: -90, capaian: -58 },
  { tahun: 2027, target: -112, capaian: null },
  { tahun: 2028, target: -128, capaian: null },
  { tahun: 2029, target: -137, capaian: null },
  { tahun: 2030, target: -140, capaian: null },
];

// ---------------------------------------------------------------------------
// Category-level emission data (baseline vs. capaian aktual), mirroring the
// structure used on the provincial MRV site: a fixed reference-level baseline
// per category, and yearly actual emissions used to compute reduction
// achieved. All figures are dummy (juta ton CO2e / year).
// ---------------------------------------------------------------------------
export const EMISSION_CATEGORIES = [
  { key: "deforestasi", label: "Deforestasi", color: "#A23B3B", baseline: 14.2 },
  { key: "degradasi", label: "Degradasi Hutan", color: "#B9791F", baseline: 5.4 },
  { key: "mangrove", label: "Tanah Mineral Mangrove", color: "#2E6B6B", baseline: 0.9 },
  { key: "gambut", label: "Dekomposisi Gambut", color: "#8A6A2E", baseline: 1.8 },
  { key: "kebakaran", label: "Kebakaran Hutan & Lahan", color: "#5B4A7A", baseline: 0.76 },
];

export const EMISSION_ACTUAL_BY_YEAR = {
  2017: { deforestasi: 4.8, degradasi: 2.3, mangrove: 0.5, gambut: 1.1, kebakaran: 1.9 },
  2018: { deforestasi: 3.9, degradasi: 2.0, mangrove: 0.45, gambut: 0.95, kebakaran: 0.6 },
  2019: { deforestasi: 4.5, degradasi: 2.1, mangrove: 0.5, gambut: 1.0, kebakaran: 3.2 },
  2020: { deforestasi: 2.6, degradasi: 1.8, mangrove: 0.35, gambut: 0.8, kebakaran: 0.55 },
  2021: { deforestasi: 2.1, degradasi: 1.6, mangrove: 0.3, gambut: 0.7, kebakaran: 0.49 },
};
export const EMISSION_YEARS = Object.keys(EMISSION_ACTUAL_BY_YEAR).map(Number).sort();

export function emissionRowsForYear(year) {
  const actuals = EMISSION_ACTUAL_BY_YEAR[year];
  return EMISSION_CATEGORIES.map((c) => ({
    ...c,
    aktual: actuals[c.key],
    reduksi: c.baseline - actuals[c.key],
  }));
}

export function emissionTotalsForYear(year) {
  const rows = emissionRowsForYear(year);
  return rows.reduce(
    (acc, r) => ({
      baseline: acc.baseline + r.baseline,
      aktual: acc.aktual + r.aktual,
      reduksi: acc.reduksi + r.reduksi,
    }),
    { baseline: 0, aktual: 0, reduksi: 0 }
  );
}

export const EMISSION_TREND = EMISSION_YEARS.map((y) => {
  const t = emissionTotalsForYear(y);
  return { tahun: y, baseline: Number(t.baseline.toFixed(2)), aktual: Number(t.aktual.toFixed(2)), reduksi: Number(t.reduksi.toFixed(2)) };
});

// ---------------------------------------------------------------------------
// REAL program facts about Indonesia's FOLU Net Sink 2030, compiled from
// public/official sources (KLHK press releases, Perpres 98/2021, Kepmen LHK
// SK.168/2022). Used on Beranda for factual program context \u2014 separate from
// the illustrative (dummy) national emissions trajectory chart below it.
// ---------------------------------------------------------------------------
export const FOLU_PROGRAM_FACTS = {
  legalBasis: [
    { label: "Peraturan Presiden No. 98 Tahun 2021", desc: "Penyelenggaraan Nilai Ekonomi Karbon (NEK) untuk pencapaian target NDC dan pengendalian emisi GRK. Pasal 3 ayat (4) menetapkan sektor kehutanan sebagai pendukung utama melalui pendekatan carbon net sink." },
    { label: "Kepmen LHK No. SK.168/MENLHK/PKTL/PLA.1/2/2022", desc: "Ditetapkan 24 Februari 2022, mengatur Indonesia's FOLU Net Sink 2030 untuk pengendalian perubahan iklim beserta susunan tim pelaksana." },
  ],
  target: "-140 juta ton CO\u2082e (net sink) pada tahun 2030",
  definition: "Kondisi ketika tingkat serapan emisi GRK dari sektor kehutanan dan penggunaan lahan lainnya (Forestry and Other Land Use) sama dengan atau lebih tinggi daripada tingkat emisi yang dihasilkan.",
  ndcContext: {
    before: "29% (upaya sendiri) / 41% (dengan dukungan internasional)",
    after: "31,89% (upaya sendiri) / 43,20% (dengan dukungan internasional)",
    foluShare: "17,4% (upaya sendiri) dan 25,4% (dengan kerja sama internasional) dari total target penurunan emisi nasional",
    forestrySectorShare: "sekitar 60% dari pemenuhan target netral karbon (NZE) nasional",
    updatedAt: "Enhanced NDC, September 2022",
  },
  history: [
    { year: "2015", text: "Persetujuan Paris (COP21 UNFCCC) disepakati; Indonesia meratifikasi melalui UU No. 16 Tahun 2016." },
    { year: "2021", text: "Presiden RI berkomitmen pada COP26 Glasgow agar sektor kehutanan dan lahan Indonesia menjadi penyerap karbon bersih paling lambat 2030; Perpres 98/2021 diterbitkan." },
    { year: "2022", text: "Kepmen LHK 168/2022 ditetapkan (Februari); dokumen Rencana Operasional FOLU Net Sink 2030 rampung; Enhanced NDC diserahkan ke UNFCCC (September)." },
    { year: "2022\u2013kini", text: "Sosialisasi Rencana Operasional dilakukan berjenjang ke tingkat regional dan sub-nasional di provinsi-provinsi prioritas." },
  ],
  strategies: [
    { key: "deforestasi", label: "Menghindari Deforestasi", icon: "Shield", desc: "Mengendalikan alih fungsi hutan alam dan lahan agar tidak menambah emisi dari deforestasi." },
    { key: "konservasi", label: "Konservasi & Pengelolaan Hutan Lestari", icon: "TreePine", desc: "Menjaga tutupan hutan yang tersisa melalui pengelolaan hutan produksi dan konservasi berkelanjutan." },
    { key: "gambut", label: "Perlindungan & Restorasi Gambut", icon: "Droplets", desc: "Memulihkan hidrologi lahan gambut dan mencegah kebakaran serta dekomposisi karbon organik." },
    { key: "serapan", label: "Peningkatan Serapan Karbon", icon: "Sprout", desc: "Rehabilitasi hutan dan lahan, penanaman mangrove, agroforestri, dan bambu untuk menambah cadangan karbon (basis data NC-1 di dashboard ini)." },
  ],
  sourceNote: "Disusun dari siaran pers dan laman resmi Kementerian Lingkungan Hidup dan Kehutanan (KLHK), per pengetahuan hingga awal 2026.",
};

// ---------------------------------------------------------------------------
// Additional REAL data extracted from the full Laporan Tahunan FOLU NC-1 TA
// 2025 (233 halaman): penerima manfaat (Tabel 6.7), realisasi anggaran
// (Tabel 4.1), capaian fisik aforestasi/reforestasi (Tabel 6.8), struktur 5
// Bidang, Theory of Change, dan kemitraan Indonesia-Norwegia (Bab 1.3).
// ---------------------------------------------------------------------------
export const FOLU_BENEFICIARIES = {
  total: 121408,
  lakiLaki: 81240,
  perempuan: 40168,
  categories: [
    { label: "Kelompok Muda", total: 54724, pct: 45.07, l: 28131, p: 26593 },
    { label: "Petani / KTH / KUPS", total: 47938, pct: 39.49, l: 37794, p: 10144 },
    { label: "Pemangku Kepentingan", total: 6002, pct: 4.94, l: null, p: null },
    { label: "SDM KLHK", total: 4433, pct: 3.65, l: null, p: null },
    { label: "Unsur Masyarakat Lainnya", total: 3981, pct: 3.28, l: null, p: null },
    { label: "Masyarakat Adat", total: 2093, pct: 1.72, l: 1866, p: 227 },
    { label: "Masyarakat Peduli Api", total: 1210, pct: 1.0, l: null, p: null },
    { label: "Akademisi", total: 1027, pct: 0.85, l: 517, p: 510 },
  ],
  ipCount: 19,
};

export const FOLU_BUDGET_2025 = {
  totalPaguKeseluruhan: 797417840873,
  paguAwp2025: 316572685803,
  realisasi2025: 298002173775,
  persenRealisasi: 94.13,
  sisaAnggaran: 18570512028,
  perProgram: [
    { program: "Program I \u2014 Pengelolaan Hutan Lestari", pagu: 143156726582, awp: 68701338491, realisasi: 65224112407, persen: 94.94 },
    { program: "Program II \u2014 Peningkatan Cadangan Karbon", pagu: 507000000000, awp: 205010630718, realisasi: 194680512018, persen: 94.96 },
    { program: "Program III \u2014 Konservasi", pagu: 10000000000, awp: 6480659925, realisasi: 5563137939, persen: 85.84 },
    { program: "Program V \u2014 Instrumen dan Informasi", pagu: 104162501946, awp: 21776110658, realisasi: 18760597557, persen: 86.15 },
    { program: "PMU NC-1", pagu: 33098612345, awp: 14603946011, realisasi: 13773813854, persen: 94.32 },
  ],
};

// Tabel 6.8 \u2014 Capaian fisik Direct Mitigation dari Kegiatan Penanaman
// 2024\u20132025. Ini adalah tabel fisik (target/realisasi/aforestasi/reforestasi)
// yang TERPISAH dari Tabel 6.9 (perhitungan adjustment karbon) sehingga
// totalnya sedikit berbeda (20.593 ha vs 19.006 ha) \u2014 keduanya real, hanya
// cakupan/potongan datanya tidak identik.
export const NC1_PHYSICAL_2025 = {
  targetHa: 20593,
  realisasiHa: 18672,
  aforestasiHa: 1923,
  reforestasiHa: 16749,
  pctOfTarget: 90.67,
  pctReforestasiOfRealisasi: 89.7,
};

export const FOLU_BIDANG = [
  { key: "I", label: "Bidang I \u2014 Pengelolaan Hutan Lestari", desc: "Mencegah dan mengurangi deforestasi serta degradasi hutan." },
  { key: "II", label: "Bidang II \u2014 Peningkatan Cadangan Karbon", desc: "Rehabilitasi hutan dan lahan, rehabilitasi mangrove, dan pemulihan ekosistem (basis data NC-1 di dashboard ini)." },
  { key: "III", label: "Bidang III \u2014 Konservasi", desc: "Konservasi keanekaragaman hayati dan perlindungan ekosistem bernilai penting." },
  { key: "IV", label: "Bidang IV \u2014 Pengelolaan Ekosistem Gambut", desc: "Restorasi dan perbaikan tata air ekosistem gambut." },
  { key: "V", label: "Bidang V \u2014 Instrumen dan Informasi", desc: "Peningkatan kapasitas, penegakan hukum, dan penguatan tata kelola pendukung." },
];

export const FOLU_OUTCOMES = [
  { key: 1, label: "Outcome 1: Pengurangan Emisi GRK", desc: "Aksi mitigasi sektor FOLU: pengurangan deforestasi/degradasi, rehabilitasi hutan dan lahan, rehabilitasi mangrove, restorasi gambut, dan pengelolaan hutan lestari." },
  { key: 2, label: "Outcome 2: Akses Masyarakat & Manfaat Ekosistem", desc: "Penguatan perhutanan sosial, peningkatan kapasitas kelompok masyarakat, dan manfaat ekonomi dari pengelolaan sumber daya hutan berkelanjutan." },
  { key: 3, label: "Outcome 3: Tata Kelola Karbon & Hutan", desc: "Penguatan kebijakan, kelembagaan, sistem informasi, kapasitas SDM, penegakan hukum, dan MRV (monitoring, reporting, verification)." },
];

export const FOLU_NORWAY = {
  mouDate: "12 September 2022",
  mouParties: "KLHK (Indonesia) dan Ministry of Climate and Environment/MCE (Norwegia)",
  mouDuration: "5 tahun",
  agreementDate: "19 Oktober 2022",
  firstContributionUsd: 56000000,
  firstContributionTonCo2e: 11200000,
  firstContributionPeriod: "2016\u20132017",
  fundManager: "Badan Pengelolaan Dana Lingkungan Hidup (BPDLH)",
};

export const FOLU_MITIGATION_ACTIONS = [
  "Pengurangan laju deforestasi lahan mineral",
  "Pengurangan laju deforestasi lahan gambut dan mangrove",
  "Pengurangan laju degradasi hutan-hutan lahan mineral",
  "Pengurangan laju degradasi hutan lahan gambut dan mangrove",
  "Pembangunan hutan tanaman",
  "Pengelolaan hutan lestari",
  "Rehabilitasi dengan rotasi",
  "Rehabilitasi non-rotasi",
  "Restorasi gambut dan perbaikan tata air gambut",
  "Rehabilitasi mangrove dan aforestasi pada kawasan bekas tambang",
  "Konservasi keanekaragaman hayati",
  "Perhutanan sosial",
  "Introduksi replikasi ekosistem, ruang terbuka hijau, dan ekoriparian",
  "Pengembangan dan konsolidasi hutan adat",
  "Pengawasan dan law enforcement dalam mendukung perlindungan dan pengamanan kawasan hutan",
];

export const NEWS = [
  {
    title: "Verifikasi capaian pengurangan emisi tahun 2021 diselesaikan",
    date: "12 Maret 2022",
    excerpt: "Tim verifikator independen menyelesaikan proses telaah dokumen dan kunjungan lapangan untuk capaian tahun laporan 2021.",
  },
  {
    title: "Pembaruan basemap dan lapisan aksi mitigasi pada Peta MRV",
    date: "28 Januari 2022",
    excerpt: "Lapisan batas administrasi dan aksi mitigasi pada modul Peta diperbarui mengikuti data terbaru dari perangkat daerah terkait.",
  },
  {
    title: "Sosialisasi metodologi pengukuran emisi kepada perangkat daerah",
    date: "05 Desember 2021",
    excerpt: "Kegiatan sosialisasi metodologi pengukuran baseline dan capaian aktual dilaksanakan bersama dinas lingkungan hidup kabupaten/kota.",
  },
];

// ---------------------------------------------------------------------------
// REAL DATA (not dummy): sourced from Laporan Tahunan FOLU NC-1 TA 2025
// (30 Juni 2026), Bab 6.1.2 — Outcome 1 Bidang II, Tabel 6.9 & Tabel 6.11.
// Headline totals are taken from the report's narrative text (most reliable);
// per-intervention uncertainty figures are taken directly from Tabel 6.11.
// ---------------------------------------------------------------------------
export const NC1_REPORT_META = {
  title: "Laporan Tahunan FOLU NC-1 TA 2025",
  asOf: "30 Juni 2026",
};

export const NC1_PLANTING = {
  targetHa: 19006,
  realisasi2024Ha: 8170,
  realisasi2025Ha: 18699,
  pctOfTarget: 98.4,
};

// Total potensi karbon Bidang II, dibandingkan antara metode lama (alometrik
// pohon dewasa berbasis tipe ekosistem) dan adjustment alometrik baru
// (Adinugroho et al. 2023, untuk tanaman muda/small trees).
export const NC1_METHOD_COMPARISON = [
  { tahun: 2024, alometrikLama: 22159, adjustmentBaru: 14687.65 },
  { tahun: 2025, alometrikLama: 36814.2, adjustmentBaru: 22277.68 },
];

// Tabel 6.11 — Nilai Uncertainty sebagai Skenario Kerja Sementara.
export const NC1_INTERVENTIONS = [
  {
    key: "terestrial",
    label: "Penanaman RHL Terestrial",
    icon: TreePine,
    color: "#2C4A3A",
    estimasi: 806.87,
    uncertaintyPct: 50,
    lower: 403.44,
    upper: 1210.31,
    status: "Estimasi awal; perlu data diameter, tinggi, survival rate aktual, dan verifikasi spasial.",
  },
  {
    key: "mangrove",
    label: "Mangrove",
    icon: Waves,
    color: "#2E6B6B",
    estimasi: 587.45,
    uncertaintyPct: 50,
    lower: 293.73,
    upper: 881.18,
    status: "Estimasi awal; perlu pemisahan seedling/sapling, monitoring substrat, pasang surut, dan survival.",
  },
  {
    key: "gambut",
    label: "Gambut",
    icon: Droplets,
    color: "#8A6A2E",
    estimasi: 20712.75,
    uncertaintyPct: 60,
    lower: 8285.1,
    upper: 33140.4,
    status: "Estimasi awal berisiko tinggi; perlu validasi hidrologi, kebakaran, drainase, dan dekomposisi gambut.",
  },
  {
    key: "bambu",
    label: "Bambu",
    icon: Sprout,
    color: "#5B4A7A",
    estimasi: 14.8,
    uncertaintyPct: 35,
    lower: 9.62,
    upper: 19.98,
    status: "Estimasi awal; perlu data diameter culm, jumlah culm/rumpun, dan survival rumpun.",
  },
  {
    key: "agroforestri",
    label: "MPTS / Agroforestri & IP Lain",
    icon: Sprout,
    color: "#B9791F",
    estimasi: 155.8,
    uncertaintyPct: 50,
    lower: 77.9,
    upper: 233.7,
    status: "Estimasi awal; perlu pemisahan jenis tanaman, diameter, tinggi, survival, dan data kelompok.",
  },
];

export const NC1_TOTAL = {
  estimasi: 22277.68,
  uncertaintyPct: 55.8,
  lower: 9846.0,
  upper: 34709.36,
};

export const NC1_SURVIVAL = [
  { label: "Ditjen PDASRH (P0)", value: 89.62 },
  { label: "Dishut Prov. Kalimantan Selatan (P0)", value: 75 },
  { label: "Rehabilitasi mangrove (rata-rata)", value: 60 },
  { label: "YBLL \u2014 bambu & MPTS", value: 60 },
];

// Tabel 6.9 \u2014 Hasil perhitungan Penyesuaian Metodologi Perhitungan Peningkatan
// Cadangan Karbon melalui Adjustment Allometrik (per implementing partner).
// Nilai null berarti sel kosong pada tabel sumber. Beberapa sel pada baris
// Mangrove Ditjen PDASRH tampak tumpang tindih pada tabel sumber (kolom
// Alometrik Lama 2024 dan Adjustment Baru 2024 bernilai sama, 13.465);
// ditampilkan apa adanya dengan catatan pada UI.
export const NC1_IP_TABLE = [
  { no: 1, ip: "Ditjen PDASRH", provinsi: "Aceh, Lampung, Sumatra Utara, dan 14 provinsi lainnya", tipeLahan: "Terestrial", target: 14080, real2024: 7413, real2025: 13428, lama2024: 6831, lama2025: 13170.37, baru2024: 513.93, baru2025: 806.87 },
  { no: 1, ip: "Ditjen PDASRH", provinsi: "Sumatra Selatan, Jawa Timur, Bali, Lombok, Maluku", tipeLahan: "Mangrove", target: 309, real2024: 189, real2025: 309, lama2024: 13465, lama2025: 570.45, baru2024: 13465.0, baru2025: 570.45, note: "*" },
  { no: 1, ip: "Ditjen PDASRH", provinsi: "Jambi, Kalimantan Tengah", tipeLahan: "Gambut", target: 920, real2024: null, real2025: 1600, lama2024: 570.45, lama2025: 20678.42, baru2024: 570.45, baru2025: 20678.42 },
  { no: 2, ip: "YBLL", provinsi: "NTT", tipeLahan: "Terestrial (Bambu)", target: 801.77, real2024: 20, real2025: 808.26, lama2024: 0.0005, lama2025: 0.04, baru2024: 0.19, baru2025: 14.8 },
  { no: 2, ip: "YBLL", provinsi: "NTT", tipeLahan: "Terestrial (MPTS)", target: null, real2024: null, real2025: null, lama2024: 0.04, lama2025: 580.39, baru2024: 0.19, baru2025: 14.8, note: "\u2020" },
  { no: 3, ip: "Ditjen PHL", provinsi: "Lampung, Kalimantan Selatan, Pekanbaru, dan 5 provinsi lainnya", tipeLahan: "Terestrial", target: 1035, real2024: null, real2025: 907, lama2024: null, lama2025: 976.91, baru2024: 0, baru2025: 38.2 },
  { no: 4, ip: "Dishut Prov. Kalsel", provinsi: "Kalimantan Selatan", tipeLahan: "Terestrial", target: 305, real2024: null, real2025: 305, lama2024: 491, lama2025: 580.39, baru2024: 36.98, baru2025: 43.66, note: "\u2020" },
  { no: 5, ip: "DLHK Prov. Riau", provinsi: "Riau", tipeLahan: "Gambut", target: 36, real2024: null, real2025: 36, lama2024: 0, lama2025: 14.09, baru2024: 0, baru2025: 14.09 },
  { no: 6, ip: "Yayasan Paradigma", provinsi: "Riau", tipeLahan: "Mangrove", target: 100, real2024: null, real2025: null, lama2024: null, lama2025: null, baru2024: 17.25, baru2025: null },
  { no: 6, ip: "Yayasan Paradigma", provinsi: "Riau", tipeLahan: "Gambut", target: 200, real2024: null, real2025: 100, lama2024: 26.51, lama2025: 17.25, baru2024: 6.89, baru2025: 17.25 },
  { no: 7, ip: "Ditjen PSKL", provinsi: "Sulawesi Selatan, Sulawesi Barat, Bali, dan 3 provinsi lainnya", tipeLahan: "Terestrial", target: 827.59, real2024: 305, real2025: 827.59, lama2024: 549, lama2025: 549.29, baru2024: 41.32, baru2025: 41.32 },
  { no: 8, ip: "TGC IPB", provinsi: "Jambi", tipeLahan: "Gambut", target: 4, real2024: null, real2025: 4, lama2024: 2.99, lama2025: 2.99, baru2024: 2.99, baru2025: 2.99 },
  { no: 9, ip: "Dishut Prov. Kalbar", provinsi: "Kalimantan Barat", tipeLahan: "Terestrial", target: 138, real2024: null, real2025: 135, lama2024: 40, lama2025: 71, baru2024: 2.99, baru2025: 5.35 },
  { no: 10, ip: "BP2SDM (Pusluh)", provinsi: "Jambi, Lampung, Jawa Barat", tipeLahan: "Terestrial", target: 18.42, real2024: 18, real2025: 44, lama2024: 19, lama2025: 19, baru2024: 1.43, baru2025: 1.43 },
  { no: 10, ip: "BP2SDM (Pusluh)", provinsi: "Jambi, Lampung, Jawa Barat", tipeLahan: "Mangrove", target: 1, real2024: 1, real2025: 1, lama2024: 17, lama2025: 17, baru2024: 17.0, baru2025: 17.0 },
  { no: 10, ip: "BP2SDM (PGLHK)", provinsi: "Jawa Barat, Sulawesi Selatan, dan 14 provinsi lainnya", tipeLahan: "Terestrial", target: 74.2, real2024: 74, real2025: 38.56, lama2024: 76, lama2025: 76, baru2024: 5.75, baru2025: 5.75 },
  { no: 11, ip: "Dishut Prov. Sumbar", provinsi: "Sumatra Barat", tipeLahan: "Terestrial", target: 150, real2024: 150, real2025: 150, lama2024: 39, lama2025: 39, baru2024: 2.91, baru2025: 2.91 },
  { no: 12, ip: "BNGi", provinsi: "Jawa Barat, Jambi, NTB", tipeLahan: "Terestrial", target: 6, real2024: 0, real2025: 6, lama2024: 32, lama2025: 32, baru2024: 2.38, baru2025: 2.38 },
];

export const NC1_IP_TOTAL = {
  target: 19006,
  real2024: 8170,
  real2025: 18699,
  lama2024: 22159,
  lama2025: 36814.2,
  baru2024: 14687.65,
  baru2025: 22277.68,
};

export const NC1_METHOD_NOTE =
  "Perhitungan menggunakan persamaan AGB = 0,13868 \u00d7 (D\u00b2H)^0,67265 (Adinugroho et al., 2023), " +
  "dikembangkan untuk tanaman kecil berdiameter <5 cm agar tidak overestimate biomassa tanaman muda. " +
  "Biomassa bawah permukaan dihitung dengan root-to-shoot ratio \u2248 0,215 (rentang 0,196\u20130,235), " +
  "cadangan karbon dengan faktor karbon 0,47, dan konversi ke CO\u2082e dengan faktor 44/12.";

// ---------------------------------------------------------------------------
// DUMMY data for NC-2&3 and NC-4, built in the exact same shape as the real
// NC-1 report data above, so the Karbon tab can show a consistent format
// across all three PMUs while only NC-1 is backed by the real report.
// ---------------------------------------------------------------------------
export const NC23_REPORT_META = { title: "Petunjuk Teknis Monitoring Karbon dan Spasial \u2014 FOLU NC-2&3 (Revisi 1)", asOf: "data s.d. 31 Agustus 2026" };
export const NC23_INTERVENTIONS = [
  { key: "terestrial", label: "Penanaman RHL Terestrial", icon: TreePine, color: "#2C4A3A", estimasi: 356.5, uncertaintyPct: null, lower: 356.5, upper: 356.5, status: "Total resmi dokumen sumber. Catatan: penjumlahan baris IP terestrial = 706,74 (nilai 190,73 identik pada 3 baris \u2021) \u2014 perlu klarifikasi ke penyusun dokumen." },
  { key: "mangrove", label: "Mangrove", icon: Waves, color: "#2E6B6B", estimasi: 1755.65, uncertaintyPct: null, lower: 1755.65, upper: 1755.65, status: "Seluruhnya dari Dishut Prov. Lampung (10 ha). Rentang uncertainty belum dilaporkan." },
];
export const NC23_TOTAL = { estimasi: 2112.15, uncertaintyPct: null, lower: 2112.15, upper: 2112.15 };
export const NC23_SURVIVAL = [];
export const NC23_IP_TABLE = [
  { no: 1, ip: "P2SEMH", provinsi: "–", tipeLahan: "Terestrial", target: 10, real2024: null, real2025: 10, lama2024: null, lama2025: null, baru2024: null, baru2025: 1.86 },
  { no: 2, ip: "Dishut Prov. Kalimantan Selatan", provinsi: "–", tipeLahan: "Terestrial", target: 280, real2024: null, real2025: 280, lama2024: null, lama2025: null, baru2024: null, baru2025: 49.13 },
  { no: 3, ip: "DLHK Prov. Gorontalo", provinsi: "–", tipeLahan: "Terestrial", target: 350, real2024: null, real2025: 350, lama2024: null, lama2025: null, baru2024: null, baru2025: 40.71 },
  { no: 4, ip: "PMU Rumpin", provinsi: "–", tipeLahan: "Terestrial", target: 5, real2024: null, real2025: 5, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 5, ip: "YBKK", provinsi: "–", tipeLahan: "Terestrial", target: 67, real2024: null, real2025: 40, lama2024: null, lama2025: null, baru2024: null, baru2025: 0.47 },
  { no: 6, ip: "FAHUTAN IPB", provinsi: "–", tipeLahan: "Terestrial", target: 80, real2024: null, real2025: 46, lama2024: null, lama2025: null, baru2024: null, baru2025: 3.95 },
  { no: 7, ip: "Fahutan UGM (IKN)", provinsi: "–", tipeLahan: "Terestrial", target: 300, real2024: null, real2025: 171, lama2024: null, lama2025: null, baru2024: null, baru2025: 33.13 },
  { no: 8, ip: "Ditjen KSDAE", provinsi: "–", tipeLahan: "Terestrial", target: 2220, real2024: null, real2025: 1113, lama2024: null, lama2025: null, baru2024: null, baru2025: 190.73, note: " ‡" },
  { no: 9, ip: "Fahutan UGM (Getas)", provinsi: "–", tipeLahan: "Terestrial", target: 300, real2024: null, real2025: 130, lama2024: null, lama2025: null, baru2024: null, baru2025: 190.73, note: " ‡" },
  { no: 10, ip: "Dishut Prov. Sumatera Barat", provinsi: "–", tipeLahan: "Terestrial", target: 275, real2024: null, real2025: 113, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 11, ip: "PULIK Unpad", provinsi: "–", tipeLahan: "Terestrial", target: 60, real2024: null, real2025: 21, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 12, ip: "Dishut Prov. Lampung", provinsi: "–", tipeLahan: "Terestrial", target: 147, real2024: null, real2025: 31, lama2024: null, lama2025: null, baru2024: null, baru2025: 3.2 },
  { no: 13, ip: "DKSHE IPB", provinsi: "–", tipeLahan: "Terestrial", target: 1500, real2024: null, real2025: 238, lama2024: null, lama2025: null, baru2024: null, baru2025: 190.73, note: " ‡" },
  { no: 14, ip: "P2HB", provinsi: "–", tipeLahan: "Terestrial", target: 3500, real2024: null, real2025: 500, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 15, ip: "BP2SDM", provinsi: "–", tipeLahan: "Terestrial", target: 70, real2024: null, real2025: 3, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 16, ip: "Dishut Prov. Sumatera Selatan", provinsi: "–", tipeLahan: "Terestrial", target: 268, real2024: null, real2025: 9, lama2024: null, lama2025: null, baru2024: null, baru2025: 2.1 },
  { no: 17, ip: "Ditjen PDAS RH", provinsi: "–", tipeLahan: "Terestrial", target: 5000, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 18, ip: "Ditjen PS", provinsi: "–", tipeLahan: "Terestrial", target: 1200, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 19, ip: "Saka Wanabakti", provinsi: "–", tipeLahan: "Terestrial", target: 5, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 20, ip: "Jikalahari", provinsi: "–", tipeLahan: "Terestrial", target: 40, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 21, ip: "GCB", provinsi: "–", tipeLahan: "Terestrial", target: 60, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 22, ip: "Dishut Prov. Sulawesi Tengah", provinsi: "–", tipeLahan: "Terestrial", target: 340, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 23, ip: "PPIUNAS", provinsi: "–", tipeLahan: "Terestrial", target: 15, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 24, ip: "TLKM", provinsi: "–", tipeLahan: "Terestrial", target: 150, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 25, ip: "Fak. Pertanian UIM", provinsi: "–", tipeLahan: "Terestrial", target: 98, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 26, ip: "DLHK Prov. Sulawesi Selatan", provinsi: "–", tipeLahan: "Terestrial", target: 80, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 27, ip: "Saka Kalpataru", provinsi: "–", tipeLahan: "Terestrial", target: 1, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 28, ip: "Dishut Prov. Lampung", provinsi: "–", tipeLahan: "Mangrove", target: 10, real2024: null, real2025: 10, lama2024: null, lama2025: null, baru2024: null, baru2025: 1755.65 },
  { no: 29, ip: "Koprabuh Kab. Timika", provinsi: "–", tipeLahan: "Mangrove", target: 50, real2024: null, real2025: 1, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 30, ip: "Kawali", provinsi: "–", tipeLahan: "Mangrove", target: 60, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 31, ip: "Jikalahari", provinsi: "–", tipeLahan: "Mangrove", target: 50, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 32, ip: "Ditjen PDAS RH", provinsi: "–", tipeLahan: "Mangrove", target: 12, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 33, ip: "Direktorat PPED", provinsi: "–", tipeLahan: "Mangrove", target: 100, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 34, ip: "Saka Kalpataru", provinsi: "–", tipeLahan: "Mangrove", target: 2, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: null },
  { no: 35, ip: "DLHK Prov. Aceh", provinsi: "–", tipeLahan: "Gambut", target: 330, real2024: null, real2025: 0, lama2024: null, lama2025: null, baru2024: null, baru2025: 0 },
];
export const NC23_IP_TOTAL = { target: 17034, real2024: null, real2025: 3066, lama2024: null, lama2025: null, baru2024: null, baru2025: 2112.15 };
export const NC23_METHOD_NOTE =
  "Sumber: Integrasi Data Spasial dan Karbon (hal. 14), data s.d. 31 Agustus 2026, angka dibulatkan. PCK dihitung dengan alometrik " +
  "memakai diameter pangkal dan tinggi semai. \u2021 Nilai 190,73 tCO\u2082e identik pada 3 baris IP (Ditjen KSDAE, Fahutan UGM Getas, DKSHE IPB) " +
  "dan penjumlahan baris terestrial (706,74) berbeda dari total resmi (356,50) \u2014 perlu diklarifikasi. Perbandingan alometrik lama vs. adjustment tidak tersedia.";

export const NC4_REPORT_META = { title: "Ringkasan Peningkatan Cadangan Karbon NC-4 (dummy)", asOf: "data contoh" };
export const NC4_PLANTING = { targetHa: 9800, realisasi2024Ha: 3100, realisasi2025Ha: 8700, pctOfTarget: 88.8 };
export const NC4_METHOD_COMPARISON = [
  { tahun: 2024, alometrikLama: 9600, adjustmentBaru: 6100 },
  { tahun: 2025, alometrikLama: 19800, adjustmentBaru: 12400 },
];
export const NC4_INTERVENTIONS = [
  { key: "terestrial", label: "Penanaman RHL Terestrial", icon: TreePine, color: "#2C4A3A", estimasi: 8900, uncertaintyPct: 45, lower: 4895, upper: 12905, status: "Estimasi awal (dummy); perlu data diameter, tinggi, dan survival rate aktual." },
  { key: "mangrove", label: "Mangrove", icon: Waves, color: "#2E6B6B", estimasi: 2600, uncertaintyPct: 50, lower: 1300, upper: 3900, status: "Estimasi awal (dummy); perlu pemisahan seedling/sapling dan monitoring substrat." },
  { key: "agroforestri", label: "Agroforestri & Masyarakat", icon: Sprout, color: "#B9791F", estimasi: 900, uncertaintyPct: 50, lower: 450, upper: 1350, status: "Estimasi awal (dummy); perlu pemisahan jenis tanaman dan data kelompok." },
];
export const NC4_TOTAL = { estimasi: 12400, uncertaintyPct: 50.2, lower: 6645, upper: 18155 };
export const NC4_SURVIVAL = [
  { label: "IP Papua Tumbuh (P0)", value: 71 },
  { label: "IP Papua Barat Lestari (P0)", value: 66 },
  { label: "Rehabilitasi mangrove (rata-rata)", value: 55 },
];
export const NC4_IP_TABLE = [
  { no: 1, ip: "IP Papua Tumbuh", provinsi: "Papua Selatan, Papua Tengah, Papua", tipeLahan: "Terestrial", target: 6200, real2024: 1900, real2025: 5600, lama2024: 6800, lama2025: 13600, baru2024: 4200, baru2025: 8900 },
  { no: 2, ip: "IP Papua Tumbuh", provinsi: "Papua Tengah", tipeLahan: "Mangrove", target: 1500, real2024: 700, real2025: 1450, lama2024: 1900, lama2025: 3900, baru2024: 1200, baru2025: 2600 },
  { no: 3, ip: "IP Papua Barat Lestari", provinsi: "Papua Barat Daya", tipeLahan: "Terestrial", target: 2100, real2024: 500, real2025: 1650, lama2024: 900, lama2025: 2300, baru2024: 700, baru2025: 900 },
];
export const NC4_IP_TOTAL = { target: 9800, real2024: 3100, real2025: 8700, lama2024: 9600, lama2025: 19800, baru2024: 6100, baru2025: 12400 };
export const NC4_METHOD_NOTE =
  "Data ini bersifat dummy untuk keperluan demonstrasi antarmuka, disusun mengikuti format dan metodologi yang sama dengan " +
  "adjustment alometrik NC-1 (Adinugroho et al., 2023). Belum merepresentasikan capaian aktual PMU NC-4.";

export const REPORT_DATA = {
  "NC-1": {
    isDummy: false,
    meta: NC1_REPORT_META,
    planting: NC1_PLANTING,
    methodComparison: NC1_METHOD_COMPARISON,
    interventions: NC1_INTERVENTIONS,
    total: NC1_TOTAL,
    survival: NC1_SURVIVAL,
    methodNote: NC1_METHOD_NOTE,
    ipTable: NC1_IP_TABLE,
    ipTotal: NC1_IP_TOTAL,
  },
  "NC-2&3": {
    isDummy: false,
    meta: NC23_REPORT_META,
    interventions: NC23_INTERVENTIONS,
    total: NC23_TOTAL,
    survival: NC23_SURVIVAL,
    methodNote: NC23_METHOD_NOTE,
    ipTable: NC23_IP_TABLE,
    ipTotal: NC23_IP_TOTAL,
  },
  "NC-4": {
    isDummy: true,
    meta: NC4_REPORT_META,
    planting: NC4_PLANTING,
    methodComparison: NC4_METHOD_COMPARISON,
    interventions: NC4_INTERVENTIONS,
    total: NC4_TOTAL,
    survival: NC4_SURVIVAL,
    methodNote: NC4_METHOD_NOTE,
    ipTable: NC4_IP_TABLE,
    ipTotal: NC4_IP_TOTAL,
  },
};

// ---------------------------------------------------------------------------
// Combined implementing-partner rows across all three PMUs (NC-1 real,
// NC-2&3/NC-4 dummy but same shape), used by the "Semua PMU" aggregate view
// in the Karbon tab so it's built from the same 5-category structure as the
// per-PMU report panels, filterable by Implementing Partner (IP).
// ---------------------------------------------------------------------------
export const ALL_IP_ROWS = [
  ...NC1_IP_TABLE.map((r) => ({ ...r, pmu: "NC-1" })),
  ...NC23_IP_TABLE.map((r) => ({ ...r, pmu: "NC-2&3" })),
  ...NC4_IP_TABLE.map((r) => ({ ...r, pmu: "NC-4" })),
];
