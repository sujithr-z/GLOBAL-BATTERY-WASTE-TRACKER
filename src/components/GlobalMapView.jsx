import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Map as MapLibre, Popup, setWorkerUrl, NavigationControl, ScaleControl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { COUNTRIES_DATA } from '../data/mockDatabase';
import { EUROSTAT_COUNTRIES } from '../data/eurostatData';
import { AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

// ─── Vite worker setup (must be module-level) ───────────────────────────────
setWorkerUrl(workerUrl);

// ─── Build unified lookup: ISO3 → data ──────────────────────────────────────
// Seed from mock first, then overlay real Eurostat data for EU countries
const DATA_BY_ISO3 = {};
COUNTRIES_DATA.forEach(c => { DATA_BY_ISO3[c.id] = { ...c, isEurostat: false }; });
EUROSTAT_COUNTRIES.forEach(c => {
  // Attach real Eurostat data (tonnes on market, per capita, trend)
  if (DATA_BY_ISO3[c.iso3]) {
    // Merge real data into existing mock entry
    DATA_BY_ISO3[c.iso3] = {
      ...DATA_BY_ISO3[c.iso3],
      eurostatTonnes: c.latestTonnes,
      eurostatYear: c.latestYear,
      eurostatPerCapita: c.perCapitaKg,
      eurostatYoY: c.yoyPct,
      trendData: c.trendData,
      isEurostat: true,
    };
  } else {
    // EU country not in mock: add it directly
    DATA_BY_ISO3[c.iso3] = {
      id: c.iso3,
      name: c.name,
      flag: c.flag,
      region: 'Europe',
      eurostatTonnes: c.latestTonnes,
      eurostatYear: c.latestYear,
      eurostatPerCapita: c.perCapitaKg,
      eurostatYoY: c.yoyPct,
      trendData: c.trendData,
      isEurostat: true,
      confidence: 'High',
    };
  }
});


// ─── Color helpers ───────────────────────────────────────────────────────────
function getCollectionColor(rate) {
  if (rate == null) return '#b8c9bc';
  if (rate >= 65) return '#15803d';
  if (rate >= 50) return '#22c55e';
  if (rate >= 35) return '#86efac';
  if (rate >= 20) return '#d97706';
  return '#dc2626';
}

function getWasteColor(waste) {
  if (waste == null) return '#b8c9bc';
  if (waste >= 3.0) return '#1e3a2f';
  if (waste >= 1.0) return '#114b3e';
  if (waste >= 0.5) return '#1b6b53';
  if (waste >= 0.2) return '#2d9d78';
  return '#a7d9c6';
}

function getRecyclingColor(rate) {
  if (rate == null) return '#b8c9bc';
  if (rate >= 60) return '#1d4ed8';
  if (rate >= 45) return '#3b82f6';
  if (rate >= 30) return '#93c5fd';
  if (rate >= 15) return '#d97706';
  return '#ef4444';
}

function getInformalColor(share) {
  if (share == null) return '#b8c9bc';
  if (share >= 60) return '#7f1d1d';
  if (share >= 40) return '#dc2626';
  if (share >= 20) return '#f97316';
  if (share >= 5)  return '#fbbf24';
  return '#d1fae5';
}

function getConfidenceColor(level) {
  if (level === 'High')   return '#15803d';
  if (level === 'Medium') return '#d97706';
  if (level === 'Low')    return '#dc2626';
  return '#94a3b8';
}

// ─── Market volume color (Eurostat tonnes → colour) ─────────────────────────
function getMarketVolumeColor(tonnes) {
  if (tonnes == null) return '#b8c9bc';
  if (tonnes >= 50000) return '#1e3a2f';
  if (tonnes >= 20000) return '#114b3e';
  if (tonnes >= 10000) return '#1b6b53';
  if (tonnes >= 3000)  return '#2d9d78';
  if (tonnes >= 500)   return '#a7d9c6';
  return '#d4f0e4';
}

// Build a MapLibre match expression: ['match', ['get', 'iso_a3'], iso1, col1, ..., default]
function buildMatchExpression(metric) {
  const expr = ['match', ['get', 'iso_a3']];
  Object.values(DATA_BY_ISO3).forEach(c => {
    let color;
    switch (metric) {
      case 'collection':    color = getCollectionColor(c.collectionRate);  break;
      case 'waste':         color = getWasteColor(c.wasteGenerated);        break;
      case 'recycling':     color = getRecyclingColor(c.recyclingRate);     break;
      case 'informal':      color = getInformalColor(c.informalShare);      break;
      case 'confidence':    color = getConfidenceColor(c.confidence);       break;
      case 'marketvolume':  color = getMarketVolumeColor(c.eurostatTonnes); break;
      default:              color = getCollectionColor(c.collectionRate);
    }
    // iso3 or id field
    const iso = c.iso3 || c.id;
    if (iso) expr.push(iso, color);
  });
  expr.push('#d4dbd0'); // default (no data)
  return expr;
}


// ─── Metric config ───────────────────────────────────────────────────────────
const METRICS = [
  { id: 'collection',   label: 'Collection rate',           unit: '%' },
  { id: 'waste',        label: 'Waste generated (Mt)',       unit: 'Mt' },
  { id: 'recycling',    label: 'Recycling rate',             unit: '%' },
  { id: 'informal',     label: 'Informal-sector share',      unit: '%' },
  { id: 'confidence',   label: 'Data confidence',            unit: '' },
  { id: 'marketvolume', label: '🇪🇺 EU Market Volume (real)', unit: 't', realData: true },
];


const LEGEND_CONFIG = {
  collection: [
    { color: '#15803d', label: '≥ 65%  — policy target' },
    { color: '#22c55e', label: '50–64%' },
    { color: '#86efac', label: '35–49%' },
    { color: '#d97706', label: '20–34%' },
    { color: '#dc2626', label: '< 20%' },
    { color: '#d4dbd0', label: 'No data / modeled' },
  ],
  waste: [
    { color: '#1e3a2f', label: '≥ 3.0 Mt' },
    { color: '#114b3e', label: '1.0–3.0 Mt' },
    { color: '#1b6b53', label: '0.5–1.0 Mt' },
    { color: '#2d9d78', label: '0.2–0.5 Mt' },
    { color: '#a7d9c6', label: '< 0.2 Mt' },
    { color: '#d4dbd0', label: 'No data' },
  ],
  recycling: [
    { color: '#1d4ed8', label: '≥ 60%' },
    { color: '#3b82f6', label: '45–59%' },
    { color: '#93c5fd', label: '30–44%' },
    { color: '#d97706', label: '15–29%' },
    { color: '#ef4444', label: '< 15%' },
    { color: '#d4dbd0', label: 'No data' },
  ],
  informal: [
    { color: '#7f1d1d', label: '≥ 60% informal' },
    { color: '#dc2626', label: '40–59%' },
    { color: '#f97316', label: '20–39%' },
    { color: '#fbbf24', label: '5–19%' },
    { color: '#d1fae5', label: '< 5%' },
    { color: '#d4dbd0', label: 'No data' },
  ],
  confidence: [
    { color: '#15803d', label: 'High — audited official data' },
    { color: '#d97706', label: 'Medium — partial + modeled' },
    { color: '#dc2626', label: 'Low — proxy estimate only' },
    { color: '#94a3b8', label: 'No data' },
  ],
  marketvolume: [
    { color: '#1e3a2f', label: '≥ 50,000 t (e.g. Germany)' },
    { color: '#114b3e', label: '20,000–50,000 t' },
    { color: '#1b6b53', label: '10,000–20,000 t' },
    { color: '#2d9d78', label: '3,000–10,000 t' },
    { color: '#a7d9c6', label: '500–3,000 t' },
    { color: '#d4f0e4', label: '< 500 t (small states)' },
    { color: '#d4dbd0', label: 'Not EU / no Eurostat data' },
  ],
};


// GeoJSON URL — Natural Earth 110m countries (has iso_a3 property)
const GEOJSON_URL =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson';

// ─── Component ───────────────────────────────────────────────────────────────
export default function GlobalMapView({ onOpenDrawer }) {
  const containerRef   = useRef(null);
  const mapRef         = useRef(null);
  const popupRef       = useRef(null);
  const hoveredIdRef   = useRef(null);

  const [metric,     setMetric]     = useState('collection');
  const [chemistry,  setChemistry]  = useState('All');
  const [stream,     setStream]     = useState('All');
  const [year,       setYear]       = useState(2025);
  const [mapReady,   setMapReady]   = useState(false);
  const [geoError,   setGeoError]   = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [tooltip,    setTooltip]    = useState(null); // { country, x, y }

  // ── Initialize map once ───────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new MapLibre({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [15, 20],
      zoom: 1.6,
      minZoom: 1,
      maxZoom: 10,
      attributionControl: { compact: true },
    });

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');

    map.on('load', async () => {
      try {
        setLoading(true);
        const res = await fetch(GEOJSON_URL);
        if (!res.ok) throw new Error('GeoJSON fetch failed');
        const geojson = await res.json();

        // ── Source ──────────────────────────────────────────────────────────
        map.addSource('countries-data', {
          type: 'geojson',
          data: geojson,
          generateId: true,
        });

        // ── Choropleth fill (behind country labels, above water) ─────────
        map.addLayer(
          {
            id: 'countries-fill',
            type: 'fill',
            source: 'countries-data',
            paint: {
              'fill-color': buildMatchExpression('collection'),
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.92,
                0.72,
              ],
            },
          },
          // Insert before the first symbol/label layer so labels stay on top
          getFirstSymbolLayer(map)
        );

        // ── Country outline ──────────────────────────────────────────────
        map.addLayer(
          {
            id: 'countries-outline',
            type: 'line',
            source: 'countries-data',
            paint: {
              'line-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#ffffff',
                'rgba(255,255,255,0.35)',
              ],
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0.6,
              ],
            },
          },
          getFirstSymbolLayer(map)
        );

        // ── Hover interactions ───────────────────────────────────────────
        map.on('mousemove', 'countries-fill', (e) => {
          if (!e.features?.length) return;
          const feature = e.features[0];
          const iso3 = feature.properties?.iso_a3;
          const country = DATA_BY_ISO3[iso3];

          map.getCanvas().style.cursor = country ? 'pointer' : 'default';

          if (hoveredIdRef.current !== null && hoveredIdRef.current !== feature.id) {
            map.setFeatureState(
              { source: 'countries-data', id: hoveredIdRef.current },
              { hover: false }
            );
          }
          hoveredIdRef.current = feature.id;
          map.setFeatureState(
            { source: 'countries-data', id: feature.id },
            { hover: true }
          );

          if (country) {
            setTooltip({ country, lngLat: e.lngLat });
          } else {
            setTooltip(null);
          }
        });

        map.on('mouseleave', 'countries-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredIdRef.current !== null) {
            map.setFeatureState(
              { source: 'countries-data', id: hoveredIdRef.current },
              { hover: false }
            );
            hoveredIdRef.current = null;
          }
          setTooltip(null);
        });

        // ── Click → open drawer ──────────────────────────────────────────
        map.on('click', 'countries-fill', (e) => {
          if (!e.features?.length) return;
          const iso3 = e.features[0].properties?.iso_a3;
          const country = DATA_BY_ISO3[iso3];
          if (country) onOpenDrawer(country.id);
        });

        setMapReady(true);
        setLoading(false);
      } catch (err) {
        console.error('Map data error:', err);
        setGeoError(true);
        setLoading(false);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update choropleth when metric changes ─────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    try {
      map.setPaintProperty('countries-fill', 'fill-color', buildMatchExpression(metric));
    } catch (_) {}
  }, [metric, mapReady]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getMetricValue(country) {
    if (!country) return '—';
    switch (metric) {
      case 'collection':  return `${country.collectionRate}%`;
      case 'waste':       return `${country.wasteGenerated} Mt`;
      case 'recycling':   return `${country.recyclingRate}%`;
      case 'informal':    return `${country.informalShare}%`;
      case 'confidence':  return country.confidence;
      default:            return '—';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <div className="section-tag">Global Map · Interactive Choropleth</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Where is battery waste accumulating?
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Hover a country for quick metrics · click to open full detail panel · adjust metric and year below
        </p>
      </div>

      {/* ── Filter row ─────────────────────────────────────────────────────── */}
      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Metric:</span>
          <select
            className="filter-select"
            value={metric}
            onChange={e => setMetric(e.target.value)}
          >
            {METRICS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Chemistry:</span>
          <select className="filter-select" value={chemistry} onChange={e => setChemistry(e.target.value)}>
            {['All', 'Li-ion', 'Lead-acid', 'NiMH', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Stream:</span>
          <select className="filter-select" value={stream} onChange={e => setStream(e.target.value)}>
            {['All', 'EV', 'Portable', 'Industrial', 'Consumer'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="filter-group" style={{ gap: '0.5rem' }}>
          <span className="filter-label">Year: <strong>{year}</strong></span>
          <input
            type="range" min={2020} max={2030} step={1} value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{ width: '130px', accentColor: 'var(--color-forest-main)' }}
          />
        </div>
      </div>

      {/* ── Map + Legend side by side ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px', gap: '1rem', alignItems: 'start' }}>

        {/* Map container */}
        <div style={{ position: 'relative' }}>
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '520px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--color-border-main)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: '#e8f0ec',
            }}
          />

          {/* Loading overlay */}
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(244,246,240,0.82)',
              borderRadius: '8px', zIndex: 10,
              gap: '0.75rem'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '3px solid var(--color-border-main)',
                borderTopColor: 'var(--color-forest-main)',
                animation: 'spin 0.9s linear infinite'
              }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Loading map tiles &amp; country data…
              </span>
            </div>
          )}

          {/* GeoJSON error */}
          {geoError && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '8px',
              backgroundColor: 'rgba(244,246,240,0.9)', zIndex: 10
            }}>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <AlertTriangle size={28} style={{ color: 'var(--color-amber-icon)', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700 }}>Could not load country boundaries</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Check your internet connection and reload.
                </div>
              </div>
            </div>
          )}

          {/* Hover tooltip — rendered as DOM overlay over map */}
          {tooltip && (
            <MapTooltip country={tooltip.country} metric={metric} getMetricValue={getMetricValue} />
          )}

          {/* Confidence source note */}
          {mapReady && !loading && (
            <div style={{
              position: 'absolute', bottom: '2.5rem', right: '0.75rem',
              backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: '4px',
              padding: '0.35rem 0.6rem', fontSize: '0.7rem', color: 'var(--color-text-muted)',
              boxShadow: 'var(--shadow-sm)', zIndex: 5,
              border: '1px solid var(--color-border-light)'
            }}>
              Basemap: OpenFreeMap Liberty · Boundaries: Natural Earth 110m<br />
              Data: GBWT Observatory v2026.2 · Click any highlighted country for detail
            </div>
          )}
        </div>

        {/* ── Legend + Quick Stats Panel ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Legend card */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              Legend
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {METRICS.find(m => m.id === metric)?.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {(LEGEND_CONFIG[metric] || []).map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', backgroundColor: item.color, borderRadius: '2px', flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px dashed var(--color-border-light)', marginTop: '0.75rem', paddingTop: '0.6rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Greyed countries = no detailed profile in this release. Data gaps page shows full coverage map.
            </div>
          </div>

          {/* Quick Stats card */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              Highlighted countries
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {COUNTRIES_DATA.sort((a, b) => {
                const va = metric === 'waste' ? b.wasteGenerated - a.wasteGenerated
                  : metric === 'collection' ? b.collectionRate - a.collectionRate
                  : metric === 'recycling' ? b.recyclingRate - a.recyclingRate
                  : metric === 'informal' ? b.informalShare - a.informalShare
                  : 0;
                return va;
              }).slice(0, 6).map(c => (
                <button
                  key={c.id}
                  onClick={() => onOpenDrawer(c.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.4rem 0.5rem', borderRadius: '4px',
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-light)',
                    cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-subtle)'}
                >
                  <span>{c.flag} {c.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-forest-main)' }}>
                    {getMetricValue(c)}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Country card grid ───────────────────────────────────────────────── */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
          All profiled countries — click to open detail
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.65rem' }}>
          {COUNTRIES_DATA.map(c => {
            const val  = metric === 'collection' ? c.collectionRate
                       : metric === 'waste'      ? c.wasteGenerated
                       : metric === 'recycling'  ? c.recyclingRate
                       : metric === 'informal'   ? c.informalShare
                       : null;
            const maxVal = metric === 'waste' ? 5 : 100;
            const pct = val != null ? Math.min((val / maxVal) * 100, 100) : 0;
            const barColor = metric === 'collection' ? getCollectionColor(c.collectionRate)
                           : metric === 'waste'      ? getWasteColor(c.wasteGenerated)
                           : metric === 'recycling'  ? getRecyclingColor(c.recyclingRate)
                           : metric === 'informal'   ? getInformalColor(c.informalShare)
                           : '#114b3e';
            return (
              <button
                key={c.id}
                onClick={() => onOpenDrawer(c.id)}
                style={{
                  background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-main)',
                  borderRadius: '6px', padding: '0.75rem', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', flexDirection: 'column', gap: '0.3rem',
                  transition: 'border-color 0.15s, box-shadow 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-emerald-muted)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border-main)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{c.flag} {c.name}</span>
                  <span className={`badge ${c.confidence === 'High' ? 'badge-confidence-high' : c.confidence === 'Medium' ? 'badge-confidence-medium' : 'badge-confidence-low'}`} style={{ fontSize: '0.6rem' }}>
                    {c.confidence}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-forest-main)' }}>
                  {getMetricValue(c)}
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--color-border-main)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .maplibregl-popup-content {
          padding: 0 !important;
          border-radius: 6px !important;
          box-shadow: var(--shadow-lg) !important;
          border: 1px solid var(--color-border-main) !important;
          font-family: var(--font-sans) !important;
          overflow: hidden;
        }
        .maplibregl-popup-close-button {
          color: rgba(255,255,255,0.7) !important;
          font-size: 1rem !important;
          top: 4px !important;
          right: 6px !important;
        }
        .maplibregl-popup-tip { border-top-color: var(--color-forest-main) !important; }
      `}</style>
    </div>
  );
}

// ─── Hover tooltip component (top-left corner overlay) ──────────────────────
function MapTooltip({ country, metric, getMetricValue }) {
  if (!country) return null;
  const hasEurostat = country.isEurostat && country.eurostatTonnes != null;
  return (
    <div style={{
      position: 'absolute', top: '12px', left: '12px', zIndex: 20,
      backgroundColor: 'var(--color-forest-dark)', color: '#ffffff',
      borderRadius: '6px', padding: '0.85rem 1rem',
      boxShadow: 'var(--shadow-lg)', pointerEvents: 'none',
      border: '1px solid rgba(255,255,255,0.15)', minWidth: '210px', maxWidth: '260px'
    }}>
      {/* Country name + source badge */}
      <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{country.flag} {country.name}</span>
        {hasEurostat && (
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, backgroundColor: '#4ade80',
            color: '#0a2e23', padding: '1px 5px', borderRadius: '3px', flexShrink: 0
          }}>EUROSTAT</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.22rem', fontSize: '0.8125rem', opacity: 0.92 }}>
        {/* Real Eurostat data block */}
        {hasEurostat && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <span>On market ({country.eurostatYear}):</span>
              <strong>{country.eurostatTonnes?.toLocaleString()} t</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <span>Per capita:</span>
              <strong>{country.eurostatPerCapita ?? '—'} kg</strong>
            </div>
            {country.eurostatYoY != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>YoY change:</span>
                <strong style={{ color: country.eurostatYoY > 0 ? '#4ade80' : '#f87171' }}>
                  {country.eurostatYoY > 0 ? '↑' : '↓'} {Math.abs(country.eurostatYoY)}%
                </strong>
              </div>
            )}
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '0.25rem 0' }} />
          </>
        )}
        {/* Modeled/mock data block */}
        {country.wasteGenerated != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>Est. waste generated:</span>
            <strong>{country.wasteGenerated} Mt</strong>
          </div>
        )}
        {country.collectionRate != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>Collection:</span>
            <strong>{country.collectionRate}%</strong>
          </div>
        )}
        {country.recyclingRate != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span>Recycling:</span>
            <strong>{country.recyclingRate}%</strong>
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '0.7rem', opacity: 0.7, display: 'flex', justifyContent: 'space-between' }}>
        <span>{hasEurostat ? 'Source: Eurostat env_waspb' : `Confidence: ${country.confidence}`}</span>
        <span>Click for detail →</span>
      </div>
    </div>
  );
}


// ─── Helper: find first symbol layer in style (to insert fills below labels) ─
function getFirstSymbolLayer(map) {
  const layers = map.getStyle().layers;
  for (const layer of layers) {
    if (layer.type === 'symbol') return layer.id;
  }
  return undefined;
}
