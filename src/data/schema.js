// ---------------------------------------------------------------------------
// Kamus data terpadu RBC-1, RBC-2&3, RBC-4 — Pedoman MRV Terpadu Draf 1,
// Lampiran A. Empat tabel yang saling bertaut melalui kunci ID:
//   T1 Lokasi  ->  T2 Plot  ->  T3 Pengukuran tanaman
//   T1 Lokasi  ->  T4 Hasil PCK (per periode)
// `by: "sistem"` = diisi otomatis oleh dashboard, bukan oleh IP.
// ---------------------------------------------------------------------------
export const TABLES = [
  {
    key: "T1",
    name: "T1 — Lokasi",
    level: "Poligon/tapak",
    keyField: "ID_LOKASI",
    fields: [
      ["ID_LOKASI", "Text 30", "Kunci unik: <PMU>-<KODE_IP>-<KODE_PROV>-<NNNN>"],
      ["PMU", "Text 10", "NC-1 / NC-2&3 / NC-4"],
      ["NAMA_IP", "Text 100", "Nama Implementing Partner"],
      ["JUDUL_KEG", "Text 150", "Judul kegiatan sesuai proposal/OWP"],
      ["PROGRAM", "Text 50", "Program pada AWP/OWP"],
      ["OUTPUT", "Text 150", "Output kegiatan sesuai OWP"],
      ["KODE_KEG_UT", "Text 20", "Kode Kegiatan Utama"],
      ["KEG_UTAMA", "Text 100", "Nama Kegiatan Utama"],
      ["KODE_KEG", "Text 20", "Kode Kegiatan"],
      ["KEGIATAN", "Text 150", "Nama Kegiatan"],
      ["SUB_KEG", "Text 150", "Nama Sub-Kegiatan"],
      ["KODE_TOC", "Text 20", "Kode Output ToC (mis. 1210)"],
      ["KAT_KEG", "Text 50", "Penanaman / Pengayaan / Patroli / Capacity Building / Sarana Pendukung / Perhutanan Sosial"],
      ["JNS_PCK", "Text 10", "Langsung / Enabling"],
      ["TIPE_LAHAN", "Text 30", "Mineral (terestrial) / Mangrove / Gambut / Bambu / MPTS-Agroforestri"],
      ["PROVINSI", "Text 50", "Nama provinsi"],
      ["KAB_KOTA", "Text 100", "Nama kabupaten/kota"],
      ["KEC", "Text 100", "Nama kecamatan"],
      ["DESA_KEL", "Text 100", "Nama desa/kelurahan"],
      ["SUB_FN_KWS", "Text 100", "Fungsi kawasan sesuai IGT kehutanan"],
      ["PEMANGKU", "Text 100", "KPH, BKSDA, BBKSDA, BPDAS, UPT, Pemda, dll."],
      ["UNIT_PEL", "Text 100", "Unit/KTH/kelompok pelaksana"],
      ["RENC_LUAS", "Double", "Luas rencana sesuai OWP (ha)"],
      ["REAL_LUAS", "Double", "Luas realisasi diisi IP (ha)"],
      ["LUAS_GIS", "Double", "Luas dihitung sistem, proyeksi luas-sama (ha)", "sistem"],
      ["RENC_JML_BIB", "Long", "Jumlah bibit rencana"],
      ["REAL_JML_BIB", "Long", "Jumlah bibit tertanam"],
      ["JML_HIDUP", "Long", "Bibit hidup hasil monitoring terakhir"],
      ["SR_PCT", "Double", "Survival rate (%)", "sistem"],
      ["RENC_JNS_BIB", "Text 255", "Jenis bibit rencana (nama ilmiah)"],
      ["REAL_JNS_BIB", "Text 255", "Jenis bibit realisasi (nama ilmiah)"],
      ["JRK_TNM", "Text 30", "Jarak tanam, mis. 4 x 4 m"],
      ["TGL_MULAI", "Date", "DD/MM/YYYY"],
      ["TGL_SELESAI", "Date", "DD/MM/YYYY"],
      ["X", "Double", "Longitude, derajat desimal (EPSG:4326)"],
      ["Y", "Double", "Latitude, derajat desimal (EPSG:4326)"],
      ["DALAM_RO", "Text 5", "Ya / Tidak", "sistem"],
      ["PCT_RO", "Double", "Persen luas di dalam RO", "sistem"],
      ["STATUS_OVL", "Text 30", "Tidak ada / Penuh / Sebagian / Jenis berbeda", "sistem"],
      ["STATUS_VER", "Text 30", "Belum diverifikasi / Memerlukan klarifikasi / Terverifikasi / Ditolak"],
      ["SUMBER", "Text 255", "Dokumen/sumber data"],
      ["TGL_DATA", "Date", "Tanggal data"],
      ["PENGINPUT", "Text 100", "Nama/akun penginput"],
    ],
  },
  {
    key: "T2",
    name: "T2 — Plot ukur",
    level: "Petak ukur",
    keyField: "ID_PLOT",
    fields: [
      ["ID_PLOT", "Text 40", "ID_LOKASI + nomor plot"],
      ["ID_LOKASI", "Text 30", "Kunci ke T1"],
      ["X", "Double", "Longitude pusat/titik ikat plot"],
      ["Y", "Double", "Latitude pusat/titik ikat plot"],
      ["UKURAN_PLOT", "Text 20", "Mis. 20x20 m; 50x50 m; lingkaran r=7 m"],
      ["LUAS_PLOT", "Double", "Luas plot (ha), mis. 0,04"],
      ["TAHAP", "Text 5", "P0 / P1 / P2 / lanjutan"],
      ["TGL_UKUR", "Date", "Tanggal pengukuran"],
      ["TOPOGRAFI", "Text 30", "Datar / Landai / Agak Curam / Curam / Sangat Curam"],
      ["TUMB_BAWAH", "Text 20", "Lebat / Sedang / Jarang / Tidak ada"],
      ["KANOPI", "Text 20", "Lebat / Sedang / Jarang / Terbuka"],
      ["GANGGUAN", "Text 100", "Penggembalaan / Kebakaran / Hama Penyakit / Bencana Alam / Lainnya"],
    ],
  },
  {
    key: "T3",
    name: "T3 — Pengukuran tanaman",
    level: "Individu tanaman",
    keyField: "ID_TANAMAN",
    fields: [
      ["ID_TANAMAN", "Text 50", "ID_PLOT + nomor tanaman"],
      ["ID_PLOT", "Text 40", "Kunci ke T2"],
      ["JENIS", "Text 100", "Nama ilmiah"],
      ["D_CM", "Double", "Diameter (cm)"],
      ["TITIK_D", "Text 20", "Pangkal (3 cm) / 1,3 m / atas banir / atas akar tunjang"],
      ["H_M", "Double", "Tinggi total (m)"],
      ["KONDISI", "Text 10", "Hidup / Mati"],
      ["RHO", "Double", "Berat jenis kayu (g/cm³), bila dipakai persamaan"],
    ],
  },
  {
    key: "T4",
    name: "T4 — Hasil PCK",
    level: "Poligon per periode",
    keyField: "ID_LOKASI + PERIODE",
    fields: [
      ["ID_LOKASI", "Text 30", "Kunci ke T1"],
      ["PERIODE", "Text 10", "Mis. 2025 atau 2026-S2"],
      ["POOL", "Text 50", "AGB / AGB+BGB / dst."],
      ["KOMPONEN", "Text 50", "Biomassa / emisi gambut dihindari / dst."],
      ["KODE_PERSAMAAN", "Text 20", "Kode persamaan baku Bab V (mis. ADN23-EQ8)"],
      ["TIER", "Text 5", "1 / 2 / 3"],
      ["CO2E_T", "Double", "tCO₂e total", "sistem"],
      ["CO2E_HA", "Double", "tCO₂e per hektare", "sistem"],
      ["UNC_PCT", "Double", "Uncertainty (%, CI 90%)"],
      ["CO2E_LOW", "Double", "Batas bawah", "sistem"],
      ["CO2E_UP", "Double", "Batas atas", "sistem"],
      ["BUFFER_PCT", "Double", "Faktor buffer (Tabel 7 Kerangka FOLU)", "sistem"],
      ["CO2E_KLAIM", "Double", "Nilai yang diakui setelah buffer", "sistem"],
      ["VERSI_METODE", "Text 20", "Versi pedoman/metode"],
      ["QC_FLAGS", "Text 50", "Kode uji kewajaran (Tabel 6.1)", "sistem"],
      ["STATUS_VER", "Text 30", "Status verifikasi"],
      ["SUMBER", "Text 255", "Dokumen/sumber data"],
    ],
  },
];

const slug = (s) =>
  String(s)
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9]+/g, "")
    .toUpperCase()
    .slice(0, 12);

// Adapter: baris IP laporan (format lama, agregat per IP) -> T1 dan T4.
// Satu baris IP menjadi satu "lokasi agregat" karena laporan sumber belum
// menyediakan poligon per tapak. Kolom yang belum ada di sumber dibiarkan kosong.
export function ipRowsToT1T4(pmu, rep, qcOf) {
  const t1 = [];
  const t4 = [];
  rep.ipTable.forEach((r, i) => {
    const id = `${pmu.replace("&", "")}-${slug(r.ip)}-${String(i + 1).padStart(4, "0")}`;
    t1.push({
      ID_LOKASI: id,
      PMU: pmu,
      NAMA_IP: r.ip,
      KAT_KEG: "Penanaman",
      JNS_PCK: "Langsung",
      TIPE_LAHAN: r.tipeLahan,
      PROVINSI: r.provinsi === "–" ? "" : r.provinsi,
      RENC_LUAS: r.target ?? "",
      REAL_LUAS: r.real2025 ?? "",
      STATUS_VER: "Belum diverifikasi",
      SUMBER: rep.source.dokumen,
      TGL_DATA: rep.source.asOf,
    });
    if (r.baru2025 != null)
      t4.push({
        ID_LOKASI: id,
        PERIODE: "2025",
        POOL: pmu === "NC-1" ? "AGB" : "",
        CO2E_T: r.baru2025,
        CO2E_HA: r.real2025 ? +(r.baru2025 / r.real2025).toFixed(4) : "",
        QC_FLAGS: (qcOf(r) || []).join(" "),
        STATUS_VER: "Belum diverifikasi",
        SUMBER: rep.source.dokumen,
      });
  });
  return { t1, t4 };
}
