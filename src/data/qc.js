// Uji kewajaran dihitung sekali atas seluruh baris RIIL lintas PMU, agar
// median intensitas per tipe lahan tidak tercemar data contoh.
import { REAL_IP_ROWS } from "./index";
import { qcFlags } from "../lib/carbon";
import { tipeLahanToCategory } from "../constants";

const rowKey = (pmu, r) => `${pmu}|${r.no}|${r.ip}|${r.tipeLahan}|${r.baru2025}`;
const QC_BY_KEY = (() => {
  const flags = qcFlags(REAL_IP_ROWS, tipeLahanToCategory);
  const m = new Map();
  REAL_IP_ROWS.forEach((r, i) => m.set(rowKey(r.pmu, r), flags[i]));
  return m;
})();

export const qcFor = (pmu, r) => QC_BY_KEY.get(rowKey(pmu, r)) || [];
