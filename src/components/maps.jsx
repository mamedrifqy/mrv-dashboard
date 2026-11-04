import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as shpwrite from "@mapbox/shp-write";
import shp from "shpjs";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import wellknown from "wellknown";
import { Download } from "lucide-react";
import { titleCase } from "./ui";
import { STATUS_META } from "../constants";
import { CO2E, fmt1 } from "../lib/format";
import { PROVINCES } from "../lib/geo";

// --- Leader-line callout, reused by the mechanism diagrams below -----------
export function Callout({ x, y, dotX, dotY, text, tone = "neutral", align = "left" }) {
  const bg = tone === "danger" ? "#A23B3B" : "#EDEAD9";
  const fg = tone === "danger" ? "#F5F3EA" : "#1B2A22";
  const w = text.length * 5.6 + 16;
  const boxX = align === "left" ? x : x - w;
  return (
    <g>
      <line x1={dotX} y1={dotY} x2={x} y2={y} stroke={tone === "danger" ? "#A23B3B" : "#8A8677"} strokeWidth="1" />
      <circle cx={dotX} cy={dotY} r="2.6" fill="none" stroke={tone === "danger" ? "#A23B3B" : "#8A8677"} strokeWidth="1" />
      <rect x={boxX} y={y - 10} width={w} height={20} fill={bg} />
      <text x={boxX + w / 2} y={y + 4} textAnchor="middle" fontFamily="IBM Plex Sans" fontSize="10.5" fontWeight="500" fill={fg}>
        {text}
      </text>
    </g>
  );
}

// Compact recreation of the guideline's "Mekanisme Overlapping RO" diagram
// (Bab III, Gambar 3.2), substituting in the selected site's real IP/name.
export function OverlapMechanismDiagram({ site }) {
  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="hatchOverlap" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#E7C9D6" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#A23B3B" strokeWidth="1.6" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="320" height="220" fill="#3C4A34" />
      <rect x="0" y="0" width="320" height="220" fill="#000" opacity="0.08" />

      {/* AOI kegiatan situs terpilih */}
      <rect x="70" y="60" width="90" height="90" fill="url(#hatchOverlap)" stroke="#D9B23C" strokeWidth="2" strokeDasharray="6 4" />
      {/* AOI IP tetangga, overlap sebagian */}
      <rect x="120" y="40" width="90" height="70" fill="none" stroke="#D9B23C" strokeWidth="2" strokeDasharray="6 4" />

      <Callout x={20} y={30} dotX={95} dotY={72} text={`AOI ${site.ip}`} />
      <Callout x={190} y={20} dotX={165} dotY={55} text={`AOI ${site.overlapIp || "IP lain"}`} align="left" />
      <Callout x={110} y={190} dotX={120} dotY={112} text="Overlapping" tone="danger" />
    </svg>
  );
}

// Compact recreation for "Di Luar RO" sites: AOI sitting outside the RO boundary.
export function OutsideRoDiagram({ site }) {
  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", height: "auto", display: "block" }}>
      <rect x="0" y="0" width="320" height="220" fill="#3C4A34" />
      <rect x="0" y="0" width="320" height="220" fill="#000" opacity="0.08" />

      {/* stylised RO boundary */}
      <path d="M40 150 C 60 100, 140 90, 170 120 C 210 110, 250 130, 240 165 C 220 190, 100 195, 60 180 Z" fill="none" stroke="#D9B23C" strokeWidth="2" strokeDasharray="7 5" />
      {/* AOI kegiatan, sitting outside the boundary */}
      <rect x="220" y="30" width="60" height="50" fill="#7FA377" stroke="#4C6A47" strokeWidth="1.5" />

      <Callout x={150} y={20} dotX={250} dotY={55} text={`AOI ${site.ip}`} align="right" />
      <Callout x={20} y={195} dotX={90} dotY={165} text="Lokasi di luar RO" tone="danger" />
    </svg>
  );
}

export function MechanismPanel({ site }) {
  if (site.status !== "Overlap Terdeteksi" && site.status !== "Di Luar RO") return null;
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #D6D2C4" }}>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8A8677", marginBottom: 8 }}>
        Ilustrasi mekanisme (skematik, mengikuti Bab III Pedoman MRV)
      </div>
      {site.status === "Overlap Terdeteksi" ? <OverlapMechanismDiagram site={site} /> : <OutsideRoDiagram site={site} />}
    </div>
  );
}

export function ProvinceBasemap({ highlightName }) {
  return (
    <g>
      {PROVINCES.map((p) => (
        <path
          key={p.n}
          d={p.d}
          fill={p.n === highlightName ? "#D7D9C4" : "#DCDCC9"}
          stroke="#C7C4AE"
          strokeWidth="0.6"
        />
      ))}
    </g>
  );
}

// Real interactive map (Leaflet): satellite imagery basemap, real Indonesia
// province boundaries (GeoJSON), zoom/pan, and clickable site markers.
export function LeafletMap({ sites, selected, setSelected, aoiFeatures, selectedAoi, setSelectedAoi, height, colorMode, uploadedFeatures }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const aoiLayerRef = useRef(null);
  const uploadedLayerRef = useRef(null);
  const geoLayerRef = useRef(null);
  const sitesRef = useRef(sites);
  const setSelectedRef = useRef(setSelected);
  const setSelectedAoiRef = useRef(setSelectedAoi);
  sitesRef.current = sites;
  setSelectedRef.current = setSelected;
  setSelectedAoiRef.current = setSelectedAoi;

  // Init map once.
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;
    const map = L.map(mapElRef.current, {
      center: [-2.3, 117.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
      tap: true,
      inertia: true,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      wheelPxPerZoomLevel: 90,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
    });
    mapRef.current = map;

    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxNativeZoom: 19,
      maxZoom: 19,
    }).addTo(map);

    // If OSM tiles are blocked (some networks restrict external tile CDNs),
    // fall back to rendering our own bundled province GeoJSON as a plain,
    // clearly-visible basemap so the map is never blank.
    let tileErrorCount = 0;
    let fallbackApplied = false;
    osmLayer.on("tileerror", () => {
      tileErrorCount += 1;
      if (tileErrorCount > 6 && !fallbackApplied) {
        fallbackApplied = true;
        mapElRef.current && (mapElRef.current.style.background = "#DDEAE0");
        if (geoLayerRef.current) {
          geoLayerRef.current.setStyle({ color: "#5C7A68", weight: 1.2, fillColor: "#C9D8CC", fillOpacity: 0.9 });
        }
      }
    });

    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    // Fix: Leaflet computes tile positions from the container's size at the
    // moment L.map() runs. In a flex layout (and with a web font that loads
    // asynchronously and can reflow the page), the container's final size is
    // often not yet settled at that moment, which makes the tile grid render
    // torn/misaligned. Re-measuring after mount, on container resize, and on
    // window resize keeps the tile grid correctly aligned.
    const invalidate = () => map.invalidateSize();
    const raf1 = requestAnimationFrame(invalidate);
    const t1 = setTimeout(invalidate, 150);
    const t2 = setTimeout(invalidate, 600);
    const t3 = setTimeout(invalidate, 1500);
    window.addEventListener("resize", invalidate);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(invalidate);
      ro.observe(mapElRef.current);
    }

    fetch(`${import.meta.env.BASE_URL}indonesia_provinsi.geojson`)
      .then((r) => r.json())
      .then((data) => {
        if (!mapRef.current) return;
        const layer = L.geoJSON(data, {
          style: () => ({ color: "#6B7D6E", weight: 1.2, fillColor: "#2C4A3A", fillOpacity: 0.14 }),
          onEachFeature: (feature, fLayer) => {
            const name = titleCase(feature.properties.Propinsi || "");
            fLayer.on({
              mouseover: (e) => e.target.setStyle({ fillOpacity: 0.32, weight: 1.8, color: "#2C4A3A" }),
              mouseout: (e) => geoLayerRef.current && geoLayerRef.current.resetStyle(e.target),
            });
            fLayer.bindTooltip(name, { sticky: true });
          },
        }).addTo(map);
        geoLayerRef.current = layer;
        map.invalidateSize();
      })
      .catch(() => {});

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", invalidate);
      if (ro) ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Rebuild markers whenever the filtered site list or selection changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerLayerRef.current) {
      markerLayerRef.current.remove();
      markerLayerRef.current = null;
    }
    if (!sites || sites.length === 0) return;
    const group = L.layerGroup();
    sites.forEach((s) => {
      const color = STATUS_META[s.status].color;
      const active = selected?.id === s.id;
      const marker = L.circleMarker([s.lat, s.lng], {
        radius: active ? 11 : 7.5,
        color,
        weight: active ? 2.5 : 1.5,
        fillColor: color,
        fillOpacity: active ? 0.8 : 0.55,
      });
      marker.on("click", () => setSelectedRef.current(s));
      marker.bindTooltip(s.name, { direction: "top", offset: [0, -8] });
      marker.addTo(group);
    });
    group.addTo(map);
    markerLayerRef.current = group;
  }, [sites, selected]);

  // Render real-IP AOI polygons (NC-1 showcase) when provided, colored by
  // tipe lahan, with a popup on click, and fit the map to their bounds.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (aoiLayerRef.current) {
      aoiLayerRef.current.remove();
      aoiLayerRef.current = null;
    }
    if (!aoiFeatures || aoiFeatures.length === 0) return;

    const layer = L.geoJSON(
      { type: "FeatureCollection", features: aoiFeatures },
      {
        style: (feature) => {
          const active = selectedAoi && selectedAoi.ip === feature.properties.ip && selectedAoi.tipeLahan === feature.properties.tipeLahan;
          const color = colorMode === "status" ? STATUS_META[feature.properties.roStatus]?.color || "#5C5A4E" : feature.properties.color;
          return {
            color,
            weight: active ? 2.5 : 1.3,
            fillColor: color,
            fillOpacity: active ? 0.55 : 0.32,
          };
        },
        onEachFeature: (feature, fLayer) => {
          const p = feature.properties;
          fLayer.bindPopup(
            `<div style="font-family:'IBM Plex Sans',sans-serif;font-size:12.5px;min-width:200px">` +
              `<div style="font-weight:600;font-size:13.5px;margin-bottom:6px;color:#1B2A22">${p.ip}</div>` +
              `<div style="color:#5C5A4E;margin-bottom:2px">${p.provinsi}</div>` +
              `<div style="display:flex;justify-content:space-between;margin-top:6px"><span style="color:#8A8677">Tipe lahan</span><span>${p.tipeLahan}</span></div>` +
              `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Realisasi 2025</span><span>${p.real2025 != null ? fmt1(p.real2025) : "\u2013"} ha</span></div>` +
              `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Adjustment 2025</span><span>${p.baru2025 != null ? fmt1(p.baru2025) : "\u2013"} ${CO2E}</span></div>` +
              `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Status RO</span><span>${p.roStatus || "\u2013"}</span></div>` +
              `</div>`
          );
          fLayer.on("click", () => setSelectedAoiRef.current && setSelectedAoiRef.current(p));
        },
      }
    ).addTo(map);
    aoiLayerRef.current = layer;

    try {
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    } catch (e) {
      /* no-op */
    }
  }, [aoiFeatures, selectedAoi, colorMode]);

  // Render uploaded data (GeoJSON/SHP/CSV) with its computed RO-overlap
  // result, styled distinctly (dashed outline) from the AOI layer.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (uploadedLayerRef.current) {
      uploadedLayerRef.current.remove();
      uploadedLayerRef.current = null;
    }
    if (!uploadedFeatures || uploadedFeatures.length === 0) return;

    const layer = L.geoJSON(
      { type: "FeatureCollection", features: uploadedFeatures },
      {
        style: (feature) => ({
          color: feature.properties.__overlap ? "#A23B3B" : "#2451A3",
          weight: 2.5,
          dashArray: "6 4",
          fillColor: feature.properties.__overlap ? "#A23B3B" : "#2451A3",
          fillOpacity: 0.22,
        }),
        onEachFeature: (feature, fLayer) => {
          const p = feature.properties;
          fLayer.bindPopup(
            `<div style="font-family:'IBM Plex Sans',sans-serif;font-size:12.5px;min-width:200px">` +
              `<div style="font-weight:600;font-size:13.5px;margin-bottom:6px;color:#1B2A22">${p.__name || "Data unggahan"}</div>` +
              `<div style="display:flex;justify-content:space-between;margin-top:4px"><span style="color:#8A8677">Hasil cek</span><span style="color:${p.__overlap ? "#A23B3B" : "#2451A3"};font-weight:600">${p.__overlap ? "Overlap terdeteksi" : "Di luar cakupan AOI"}</span></div>` +
              (p.__overlapWith ? `<div style="display:flex;justify-content:space-between"><span style="color:#8A8677">Beririsan dengan</span><span>${p.__overlapWith}</span></div>` : "") +
              `</div>`
          );
        },
      }
    ).addTo(map);
    uploadedLayerRef.current = layer;

    try {
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    } catch (e) {
      /* no-op */
    }
  }, [uploadedFeatures]);

  return <div ref={mapElRef} style={{ width: "100%", height: height || 480, background: "#EAEBDF" }} />;
}

// ---------------------------------------------------------------------------
// Upload parsing: accepts GeoJSON (.geojson/.json), Shapefile (.zip), or CSV
// with a WKT geometry column, and normalizes to a GeoJSON FeatureCollection.
// ---------------------------------------------------------------------------
async function parseUploadedFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".geojson") || name.endsWith(".json")) {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.type === "FeatureCollection") return data.features;
    if (data.type === "Feature") return [data];
    if (data.type) return [{ type: "Feature", properties: {}, geometry: data }];
    throw new Error("Format GeoJSON tidak dikenali.");
  }
  if (name.endsWith(".zip")) {
    const buf = await file.arrayBuffer();
    const data = await shp(buf);
    const fc = Array.isArray(data) ? data[0] : data;
    return fc.features || [];
  }
  if (name.endsWith(".csv")) {
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const wktKey = Object.keys(parsed.data[0] || {}).find((k) => k.toLowerCase().includes("wkt"));
    if (!wktKey) throw new Error("Kolom WKT tidak ditemukan pada CSV. Pastikan ada kolom bernama 'WKT' atau 'wkt_geom'.");
    return parsed.data
      .filter((row) => row[wktKey])
      .map((row) => {
        const geometry = wellknown.parse(row[wktKey]);
        const properties = { ...row };
        delete properties[wktKey];
        return { type: "Feature", properties, geometry };
      });
  }
  throw new Error("Format file tidak didukung. Gunakan .geojson, .json, .zip (shapefile), atau .csv (dengan kolom WKT).");
}

// Checks each uploaded feature against the reference AOI polygons (standing
// in for the real RO/Rencana Operasional boundary, which was not provided in
// the source report) using real geometric intersection (turf.booleanIntersects).
export function checkOverlapAgainstReference(uploadedFeatures, referenceFeatures) {
  return uploadedFeatures.map((f, i) => {
    let overlap = false;
    let overlapWith = null;
    if (f.geometry) {
      for (const ref of referenceFeatures) {
        try {
          if (turf.booleanIntersects(f, ref)) {
            overlap = true;
            overlapWith = ref.properties.ip;
            break;
          }
        } catch (e) {
          /* mismatched/invalid geometry pair \u2014 skip */
        }
      }
    }
    return {
      ...f,
      properties: {
        ...f.properties,
        __name: f.properties?.name || f.properties?.NAME || f.properties?.Name || `Fitur ${i + 1}`,
        __overlap: overlap,
        __overlapWith: overlapWith,
      },
    };
  });
}

export function downloadGeoJSON(features, filename) {
  const blob = new Blob([JSON.stringify({ type: "FeatureCollection", features }, null, 2)], { type: "application/geo+json" });
  saveAs(blob, `${filename}.geojson`);
}

export function downloadShapefile(features, filename) {
  const geojson = { type: "FeatureCollection", features };
  shpwrite.download(geojson, { folder: filename, types: { polygon: filename } });
}

export function downloadCsvWkt(features, filename) {
  const rows = features.map((f) => ({ ...f.properties, WKT: wellknown.stringify(f) }));
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${filename}.csv`);
}

export function DownloadMenu({ features, filename }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#1B2A22", border: "1px solid #D6D2C4", padding: "7px 12px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, cursor: "pointer" }}
      >
        <Download size={13} /> Unduh data
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 20, background: "#fff", border: "1px solid #D6D2C4", minWidth: 180, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
          {[
            { label: "GeoJSON (.geojson)", fn: () => downloadGeoJSON(features, filename) },
            { label: "CSV \u2014 Atribut + WKT (.csv)", fn: () => downloadCsvWkt(features, filename) },
            { label: "Shapefile (.zip)", fn: () => downloadShapefile(features, filename) },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                opt.fn();
                setOpen(false);
              }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#1B2A22", background: "none", border: "none", borderTop: "1px solid #E5E2D6", cursor: "pointer" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Generic reusable Leaflet map: fetches a GeoJSON URL once, then re-styles
// the same cached layer whenever styleFn/popupFn change (e.g. when the user
// switches the choropleth metric), without re-fetching. Shares the same
// tile/invalidateSize robustness as LeafletMap.
// ---------------------------------------------------------------------------
export function GenericGeoMap({ geojsonUrl, styleFn, popupFn, filterFn, height, onLoaded }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const dataLayerRef = useRef(null);
  const rawDataRef = useRef(null);
  const styleFnRef = useRef(styleFn);
  const popupFnRef = useRef(popupFn);
  const filterFnRef = useRef(filterFn);
  const onLoadedRef = useRef(onLoaded);
  styleFnRef.current = styleFn;
  popupFnRef.current = popupFn;
  filterFnRef.current = filterFn;
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;
    const map = L.map(mapElRef.current, {
      center: [-2.3, 117.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
      tap: true,
      inertia: true,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      wheelPxPerZoomLevel: 90,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxNativeZoom: 19,
      maxZoom: 19,
    }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const invalidate = () => map.invalidateSize();
    const raf1 = requestAnimationFrame(invalidate);
    const t1 = setTimeout(invalidate, 150);
    const t2 = setTimeout(invalidate, 600);
    const t3 = setTimeout(invalidate, 1500);
    window.addEventListener("resize", invalidate);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(invalidate);
      ro.observe(mapElRef.current);
    }

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", invalidate);
      if (ro) ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const renderLayer = (fit) => {
    const map = mapRef.current;
    if (!map || !rawDataRef.current) return;
    if (dataLayerRef.current) {
      dataLayerRef.current.remove();
      dataLayerRef.current = null;
    }
    const features = filterFnRef.current ? rawDataRef.current.features.filter((f) => filterFnRef.current(f.properties)) : rawDataRef.current.features;
    const layer = L.geoJSON(
      { type: "FeatureCollection", features },
      {
        style: styleFnRef.current,
        onEachFeature: (feature, fLayer) => {
          if (popupFnRef.current) fLayer.bindPopup(popupFnRef.current(feature.properties));
        },
      }
    ).addTo(map);
    dataLayerRef.current = layer;
    if (fit) {
      try {
        const b = layer.getBounds();
        if (b.isValid()) map.fitBounds(b, { padding: [30, 30] });
      } catch (e) {
        /* no-op */
      }
    }
    map.invalidateSize();
  };

  useEffect(() => {
    let cancelled = false;
    fetch(geojsonUrl)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        rawDataRef.current = data;
        renderLayer(true);
        onLoadedRef.current && onLoadedRef.current(data.features);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [geojsonUrl]);

  useEffect(() => {
    renderLayer(false);
  }, [styleFn, popupFn]);

  useEffect(() => {
    renderLayer(!!filterFn);
  }, [filterFn]);

  return <div ref={mapElRef} style={{ width: "100%", height: height || 480, background: "#EAEBDF" }} />;
}
