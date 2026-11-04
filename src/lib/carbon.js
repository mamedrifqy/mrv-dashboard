

// ---------------------------------------------------------------------------
// Real allometric calculation, taken directly from the NC-1 report's
// methodology (Adinugroho et al., 2023, for small trees):
//   AGB = 0.13868 * (D^2 * H) ^ 0.67265
//   BGB = AGB * root-to-shoot ratio (~0.215)
//   Carbon stock = (AGB + BGB) * 0.47 (carbon fraction)
//   CO2e = Carbon stock * 44/12
// Used to power the dummy "Pengukuran" input calculator: field measurements
// (jumlah tanaman, diameter, tinggi) are real inputs; the calculation is the
// same real formula; only the entries themselves are illustrative/dummy.
// ---------------------------------------------------------------------------
// Young-tree formula (Adinugroho et al., 2023) \u2014 used for all jenis lahan by
// default, and as the honest fallback for Gambut/Bambu even in "dewasa" mode
// (no verified published coefficients for those two available here).
export function computeMuda({ diameter, tinggi }) {
  const d2h = diameter * diameter * tinggi;
  const agbPerTree = 0.13868 * Math.pow(d2h, 0.67265);
  const bgbPerTree = agbPerTree * 0.215;
  return { agbPerTree, bgbPerTree, formulaLabel: "Adinugroho et al. (2023), tanaman kecil/muda (D<5 cm)" };
}

// Utami et al. (2025), Jurnal Hutan Tropika 20(1): semai Bruguiera gymnorrhiza.
// y = -9,272 + 11,898*Dp + 17,825*Dp^2 -> biomassa total kering (gram),
// Dp = diameter pangkal (cm), valid pada kisaran 0,2-1,6 cm.
export function computeMudaMangroveUtami({ diameter }) {
  const rawGram = -9.272 + 11.898 * diameter + 17.825 * Math.pow(diameter, 2);
  const totalBiomassaPerTree = Math.max(0, rawGram) / 1000; // kg
  const outOfRange = diameter < 0.2 || diameter > 1.6;
  return {
    totalBiomassaPerTree,
    isDirectBiomass: true,
    formulaLabel: "Utami et al. (2025), semai Bruguiera gymnorrhiza (biomassa total, Dp)",
    formulaNote:
      "Persamaan ini menghasilkan biomassa TOTAL kering (gram) dari diameter PANGKAL (Dp); BGB tidak dipisah. " +
      (outOfRange ? "Dp di luar kisaran valid model (0,2\u20131,6 cm) \u2014 hasil ekstrapolasi, gunakan dengan hati-hati. " : "") +
      "Karbon = biomassa \u00d7 0,47.",
  };
}

// Mulyana et al. (2021), Jurnal Galam 2(1): semai R. mucronata, A. marina, S. caseolaris.
// Karbon (gram) = 5,835 * Dp^1,804 \u2014 sudah merupakan karbon (biomassa \u00d7 0,47), bukan AGB.
export function computeMudaMangroveMulyana({ diameter }) {
  const carbonPerTree = (5.835 * Math.pow(diameter, 1.804)) / 1000; // kg C
  return {
    carbonPerTree,
    isDirectCarbon: true,
    formulaLabel: "Mulyana et al. (2021), semai mangrove (karbon langsung, Dp)",
    formulaNote:
      "Persamaan ini langsung menghasilkan KARBON (gram) dari diameter PANGKAL (Dp); tidak dikali 0,47 lagi. AGB/BGB tidak ditampilkan.",
  };
}

export const MUDA_FORMULA_OPTIONS = {
  Mangrove: [
    { key: "adinugroho", label: "Adinugroho et al. (2023) \u2014 umum", fn: computeMuda },
    { key: "utami", label: "Utami et al. (2025) \u2014 semai B. gymnorrhiza", fn: computeMudaMangroveUtami },
    { key: "mulyana_semai", label: "Mulyana et al. (2021) \u2014 semai mangrove", fn: computeMudaMangroveMulyana },
  ],
};

// Mature-stand, ecosystem-specific formulas. Require wood density (rho, g/cm3).
export function computeDewasa({ jenis, diameter, tinggi, density }) {
  const D = diameter;
  const H = tinggi;
  const rho = density || 0.5;
  if (jenis === "Terestrial") {
    const agbPerTree = 0.0673 * Math.pow(rho * D * D * H, 0.976);
    const bgbPerTree = agbPerTree * 0.235;
    return { agbPerTree, bgbPerTree, formulaLabel: "Chave et al. (2014), model pantropis" };
  }
  if (jenis === "Mangrove") {
    const agbPerTree = 0.251 * rho * Math.pow(D, 2.46);
    const bgbPerTree = 0.199 * Math.pow(rho, 0.899) * Math.pow(D, 2.22);
    return { agbPerTree, bgbPerTree, formulaLabel: "Komiyama et al. (2005), model mangrove umum" };
  }
  if (jenis === "Agroforestri/MPTS") {
    const agbPerTree = 0.11 * rho * Math.pow(D, 2.62);
    const bgbPerTree = agbPerTree * 0.235;
    return { agbPerTree, bgbPerTree, formulaLabel: "Ketterings et al. (2001), umum untuk agroforestri" };
  }
  // Gambut, Bambu: no verified published coefficients available here \u2014
  // fall back to the young-tree formula rather than fabricate one.
  const fallback = computeMuda({ diameter, tinggi });
  return {
    ...fallback,
    formulaNote: `Rumus khusus tegakan dewasa untuk ${jenis} belum tersedia/terverifikasi di sini; memakai rumus tanaman muda (Adinugroho) sebagai pendekatan konservatif.`,
  };
}

export function computeCarbonFromMeasurement({ jenis, fase, mudaSumber, jumlahTanaman, diameter, tinggi, density }) {
  let calc;
  if (fase === "dewasa") {
    calc = computeDewasa({ jenis, diameter, tinggi, density });
  } else {
    const options = MUDA_FORMULA_OPTIONS[jenis];
    const chosen = options && options.find((o) => o.key === mudaSumber);
    calc = chosen ? chosen.fn({ diameter, tinggi }) : computeMuda({ diameter, tinggi });
  }
  const { formulaLabel, formulaNote } = calc;
  let agbPerTree = calc.agbPerTree ?? null;
  let bgbPerTree = calc.bgbPerTree ?? null;
  let totalBiomassaPerTree, carbonPerTree;
  if (calc.isDirectCarbon) {
    carbonPerTree = calc.carbonPerTree;
    totalBiomassaPerTree = carbonPerTree / 0.47;
  } else if (calc.isDirectBiomass) {
    totalBiomassaPerTree = calc.totalBiomassaPerTree;
    bgbPerTree = null;
    carbonPerTree = totalBiomassaPerTree * 0.47;
  } else {
    totalBiomassaPerTree = agbPerTree + bgbPerTree;
    carbonPerTree = totalBiomassaPerTree * 0.47;
  }
  const co2ePerTreeKg = carbonPerTree * (44 / 12);
  const totalCo2eTon = (co2ePerTreeKg * jumlahTanaman) / 1000;
  return { agbPerTree, bgbPerTree, totalBiomassaPerTree, carbonPerTree, co2ePerTreeKg, totalCo2eTon, formulaLabel, formulaNote };
}
