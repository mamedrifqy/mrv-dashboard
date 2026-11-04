import { TreePine, Waves, Flame, AlertTriangle, CheckCircle2, HelpCircle, XCircle, Sprout, Droplets, Shield } from "lucide-react";

// Konstanta tampilan (warna, ikon, kategori) yang dipakai lintas view.

export const PMU_META = {
  "NC-1": { color: "#2C4A3A", label: "PMU NC-1" },
  "NC-2&3": { color: "#2E6B6B", label: "PMU NC-2&3" },
  "NC-4": { color: "#8A6A2E", label: "PMU NC-4" },
};

export const STATUS_META = {
  Terverifikasi: { color: "#2C4A3A", icon: CheckCircle2 },
  "Perlu Klarifikasi": { color: "#B9791F", icon: HelpCircle },
  "Overlap Terdeteksi": { color: "#A23B3B", icon: AlertTriangle },
  "Di Luar RO": { color: "#7A7566", icon: XCircle },
};

export const JENIS_META = {
  Terestrial: { color: "#2C4A3A", icon: TreePine },
  Mangrove: { color: "#2E6B6B", icon: Waves },
  Deforestasi: { color: "#8A6A2E", icon: Flame },
};

export const NC1_TIPE_COLOR = {
  Terestrial: "#2C4A3A",
  "Terestrial (Bambu)": "#5B4A7A",
  "Terestrial (MPTS)": "#B9791F",
  Mangrove: "#2E6B6B",
  Gambut: "#8A6A2E",
};

export const KARBON_CATEGORIES = [
  { key: "Terestrial", color: "#2C4A3A" },
  { key: "Mangrove", color: "#2E6B6B" },
  { key: "Gambut", color: "#8A6A2E" },
  { key: "Bambu", color: "#5B4A7A" },
  { key: "Agroforestri/MPTS", color: "#B9791F" },
];

export function tipeLahanToCategory(tipeLahan) {
  const t = String(tipeLahan);
  if (t.includes("Bambu")) return "Bambu";
  if (t.includes("MPTS") || t.toLowerCase().includes("agroforestri")) return "Agroforestri/MPTS";
  if (t.startsWith("Terestrial")) return "Terestrial";
  if (t === "Mangrove") return "Mangrove";
  if (t === "Gambut") return "Gambut";
  return "Terestrial";
}

export const STRATEGY_ICONS = { Shield, TreePine, Droplets, Sprout };
