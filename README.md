# Dashboard MRV — Indonesia's FOLU Net Sink 2030

A demo dashboard (spatial + carbon views) built with Vite + React, using dummy
data structured around the Pedoman MRV Terpadu.

## Run locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## Deploy to GitHub Pages

1. **Rename the repo (or edit the config)** — this project assumes your
   GitHub repo is named `mrv-dashboard`. Two ways to make that true:
   - Create the repo on GitHub as `mrv-dashboard`, **or**
   - Rename it to whatever you like, then open `vite.config.js` and change
     `base: "/mrv-dashboard/"` to `base: "/<your-repo-name>/"`.
   - If the repo is your special `<username>.github.io` repo, set
     `base: "/"` instead.

2. **Push this project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

3. **Turn on Pages via GitHub Actions:**
   - In your repo on GitHub, go to **Settings → Pages**.
   - Under "Build and deployment", set **Source** to **GitHub Actions**.
   - That's it — pushing to `main` now triggers `.github/workflows/deploy.yml`,
     which builds the site with Vite and publishes it to Pages automatically.

4. Your dashboard will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

## Project structure

```
src/
  App.jsx                 – shell: tab, filter, banner mode demo
  constants.js            – warna, ikon, kategori tipe lahan
  data/
    index.js              – satu pintu data; menandai riil vs dummy
    national.json         – Lapis A: baseline FREL, kontribusi RBC, target ENDC (riil)
    program.json          – konteks program di Beranda (riil)
    pck/nc1.json          – PCK NC-1, Laporan Tahunan TA 2025 (riil)
    pck/nc23.json         – PCK NC-2&3, Juknis Revisi 1 (riil)
    pck/nc4.dummy.json    – PCK NC-4 (data contoh, tidak ikut total)
    sites.dummy.json      – lokasi contoh NC-1 dan NC-4 untuk tab Peta
    nc23-aoi.dummy.json   – atribut ilustrasi AOI NC-2&3 (posisi, provinsi, status); nama IP dan luas dibaca dari pck/nc23.json
    news.dummy.json       – berita contoh
    schema.js             – kamus data T1–T4 (Pedoman MRV Draf 1, Lampiran A)
    qc.js                 – uji kewajaran atas baris riil
  lib/                    – format angka, rumus alometrik, buffer, QC, geometri
  components/             – UI umum, peta, SourceBadge/DemoBanner
  views/                  – Beranda, Pengukuran, Nasional, Peta, Karbon, Kamus Data
```

## Data riil vs data contoh

Setiap berkas JSON memuat `source: { status, dokumen, asOf }`. Berkas data
contoh diberi akhiran `.dummy.json` dan `status: "dummy"`. Akibatnya:

- panel menampilkan label *Data riil* (beserta dokumen sumber) atau *Data contoh*;
- banner **Mode demo** muncul pada tab yang memakai data contoh;
- ringkasan **Semua PMU** di tab Karbon hanya menjumlahkan PMU berdata riil,
  kecuali pengguna mencentang *Sertakan data contoh*.

Untuk mengganti data NC-4 dengan data resmi: buat `src/data/pck/nc4.json`
dengan struktur yang sama seperti `nc1.json`, isi `source.status` dengan
`"riil"`, lalu ubah impor di `src/data/index.js`.

## Lapis akuntansi karbon

- **Lapis A (tab Nasional)**: pengurangan emisi nasional, dasar RBC (juta tCO₂e).
- **Lapis B (tab Karbon)**: PCK langsung dari penanaman IP (tCO₂e), dengan
  uncertainty, buffer (Tabel 7 Kerangka Metodologi FOLU 2023), dan uji
  kewajaran (QC-01 s.d. QC-06).

Keduanya tidak dijumlahkan.

## Notes

- Province boundaries are real, simplified from a GeoJSON. Attributes in
  `indonesia_provinsi_folu_ro_emisi.geojson` are not yet verified; the GHG
  column definitions are documented in the Choropleth view.
- No backend or database — everything is static, so hosting is just files.
