import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  EUROSTAT_COUNTRIES,
  EU27_AGGREGATE,
  AVAILABLE_YEARS,
  DATASET_META
} from '../data/eurostatData';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp, TrendingDown, Minus, Info, Download, Copy,
  AlertTriangle, CheckCircle2, ExternalLink
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = n => n != null ? n.toLocaleString('en-GB') : '—';
const fmtK = n => n != null ? (n >= 1000 ? `${(n/1000).toFixed(1)}k` : n.toLocaleString()) : '—';

function YoyIndicator({ pct }) {
  if (pct == null) return <span style={{ color: 'var(--color-text-muted)' }}>—</span>;
  const color = pct > 0 ? '#15803d' : pct < 0 ? '#dc2626' : '#64748b';
  const icon = pct > 0 ? '↑' : pct < 0 ? '↓' : '→';
  return <span style={{ color, fontWeight: 700 }}>{icon} {Math.abs(pct)}%</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--color-border-main)',
      borderRadius: '4px', padding: '0.6rem 0.85rem', fontSize: '0.8rem',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.stroke || p.fill, display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{p.name || p.dataKey}:</span>
          <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value} t</strong>
        </div>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function EurostatView({ onOpenDrawer }) {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sortKey, setSortKey] = useState('latestTonnes');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [chartType, setChartType] = useState('bar'); // bar | line | area

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  // ── Year-filtered data ────────────────────────────────────────────────────
  const yearData = useMemo(() => {
    return EUROSTAT_COUNTRIES
      .map(c => ({
        ...c,
        yearTonnes: c.timeSeries[selectedYear] ?? null,
        prevYearTonnes: c.timeSeries[selectedYear - 1] ?? null,
      }))
      .map(c => ({
        ...c,
        yearYoY: (c.yearTonnes && c.prevYearTonnes)
          ? +(((c.yearTonnes - c.prevYearTonnes) / c.prevYearTonnes) * 100).toFixed(1)
          : null,
        perCapitaYear: (c.yearTonnes && c.populationM)
          ? +(c.yearTonnes / (c.populationM * 1000)).toFixed(2)
          : null,
      }));
  }, [selectedYear]);

  const eu27Year = EU27_AGGREGATE.timeSeries[selectedYear] ?? null;
  const eu27Prev = EU27_AGGREGATE.timeSeries[selectedYear - 1] ?? null;
  const eu27YoY  = (eu27Year && eu27Prev) ? +(((eu27Year - eu27Prev) / eu27Prev) * 100).toFixed(1) : null;

  // ── Filtered + sorted table rows ─────────────────────────────────────────
  const tableRows = useMemo(() => {
    return yearData
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const va = sortKey === 'name' ? a.name : (a[sortKey] ?? -Infinity);
        const vb = sortKey === 'name' ? b.name : (b[sortKey] ?? -Infinity);
        if (typeof va === 'number' && typeof vb === 'number')
          return sortDir === 'asc' ? va - vb : vb - va;
        return sortDir === 'asc'
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
  }, [yearData, search, sortKey, sortDir]);

  // ── EU27 trend for chart ──────────────────────────────────────────────────
  const eu27Trend = EU27_AGGREGATE.trendData;

  // ── Top-10 bar chart data for selected year ───────────────────────────────
  const top10 = useMemo(() =>
    [...yearData]
      .filter(c => c.yearTonnes != null)
      .sort((a, b) => b.yearTonnes - a.yearTonnes)
      .slice(0, 10)
      .map(c => ({ name: c.iso3, flag: c.flag, tonnes: c.yearTonnes, country: c.name }))
  , [yearData]);

  // ── Selected country trend ────────────────────────────────────────────────
  const selectedCountryData = selectedCountry
    ? EUROSTAT_COUNTRIES.find(c => c.iso3 === selectedCountry)
    : null;

  // ── CSV export ────────────────────────────────────────────────────────────
  const handleCopy = () => {
    const header = 'Country,ISO3,' + AVAILABLE_YEARS.join(',');
    const rows = EUROSTAT_COUNTRIES.map(c =>
      `"${c.name}",${c.iso3},` + AVAILABLE_YEARS.map(y => c.timeSeries[y] ?? '').join(',')
    );
    navigator.clipboard.writeText([header, ...rows].join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SortTh = ({ label, k }) => (
    <button
      onClick={() => handleSort(k)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: sortKey === k ? 'var(--color-forest-main)' : 'var(--color-text-secondary)',
        display: 'flex', alignItems: 'center', gap: '3px'
      }}
    >
      {label}{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <div className="section-tag">Real Data · Eurostat env_waspb</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          EU Portable Battery Market — Official Data
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Sales and collection of portable batteries and accumulators · Eurostat · 2009–2023 · Unit: Tonnes
        </p>
      </div>

      {/* ── Source banner ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        padding: '0.85rem 1rem',
        backgroundColor: '#f0f9f5', border: '1px solid var(--color-emerald-border)',
        borderLeft: '4px solid var(--color-forest-main)', borderRadius: '4px',
        fontSize: '0.8125rem', color: 'var(--color-text-secondary)'
      }}>
        <CheckCircle2 size={16} style={{ color: 'var(--color-forest-main)', flexShrink: 0, marginTop: '1px' }} />
        <div>
          <strong style={{ color: 'var(--color-forest-main)' }}>Official Eurostat data</strong> —
          Dataset code: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8em' }}>{DATASET_META.code}</code> ·
          Metric: {DATASET_META.metric} · Last updated: {DATASET_META.lastUpdated} · License: {DATASET_META.license}
          <br />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            Note: "put on market" = sold tonnes, used as proxy denominator for collection rate calculations under EU Battery Directive.
          </span>
        </div>
        <a
          href="https://ec.europa.eu/eurostat/databrowser/product/page/ENV_WASPB"
          target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--color-emerald-muted)', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}
        >
          Eurostat page <ExternalLink size={12} />
        </a>
      </div>

      {/* ── Year selector + actions ─────────────────────────────────────── */}
      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Reference year:</span>
          <select
            className="filter-select"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {AVAILABLE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Chart:</span>
          {['bar', 'line', 'area'].map(t => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              style={{
                padding: '0.3rem 0.65rem', fontSize: '0.8rem', fontWeight: 600,
                border: '1px solid var(--color-border-main)', borderRadius: '4px', cursor: 'pointer',
                backgroundColor: chartType === t ? 'var(--color-forest-main)' : 'transparent',
                color: chartType === t ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={handleCopy} style={{ fontSize: '0.8rem' }}>
            <Copy size={13} />
            {copied ? 'Copied!' : 'Copy CSV'}
          </button>
        </div>
      </div>

      {/* ── KPI strip: EU27 aggregate ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          {
            label: 'EU27 — batteries on market',
            value: fmt(eu27Year), unit: 't',
            sub: eu27Year ? `${(eu27Year/1000).toFixed(1)} kt total` : '—',
            yoy: eu27YoY
          },
          {
            label: 'EU27 — per capita',
            value: EU27_AGGREGATE.perCapitaKg != null ? EU27_AGGREGATE.perCapitaKg : '—',
            unit: 'kg / person',
            sub: `448 million population`,
            yoy: null
          },
          {
            label: 'Countries reporting',
            value: tableRows.filter(c => c.yearTonnes != null).length,
            unit: 'of 30',
            sub: `${tableRows.filter(c => c.yearTonnes == null).length} with gaps in ${selectedYear}`,
            yoy: null
          },
          {
            label: 'Largest market',
            value: top10[0]?.flag + ' ' + (top10[0]?.country.split(' ')[0] || '—'),
            unit: '',
            sub: top10[0] ? `${fmt(top10[0].tonnes)} t` : '—',
            yoy: null
          },
          {
            label: 'Year-over-year (EU27)',
            value: eu27YoY != null ? `${eu27YoY > 0 ? '+' : ''}${eu27YoY}%` : '—',
            unit: '',
            sub: `${selectedYear - 1} → ${selectedYear}`,
            yoy: null,
            highlight: eu27YoY
          },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-title" style={{ fontSize: '0.75rem' }}>{kpi.label}</div>
            <div className="kpi-value-row" style={{ marginTop: '0.4rem' }}>
              <span className="kpi-value" style={{ fontSize: '1.6rem' }}>{kpi.value}</span>
              {kpi.unit && <span className="kpi-unit">{kpi.unit}</span>}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              {kpi.sub}
            </div>
            {kpi.yoy != null && (
              <div style={{ marginTop: '0.25rem' }}>
                <YoyIndicator pct={kpi.yoy} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Main charts row ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* EU27 Trend */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
            🇪🇺 EU27 — Batteries on Market, 2009–2023
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Portable batteries and accumulators placed on the market · tonnes · official Eurostat
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={eu27Trend} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="eu27Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#114b3e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#114b3e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={selectedYear} stroke="#d97706" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: String(selectedYear), position: 'top', fontSize: 9, fill: '#d97706' }} />
              <Area dataKey="tonnes" stroke="#114b3e" strokeWidth={2.5} fill="url(#eu27Grad)" dot={{ r: 3 }} name="EU27 total" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            2021 peak: 244,899 t · 2023: 230,637 t (−5.0% from peak). Source: Eurostat · Imputed for missing members.
          </div>
        </div>

        {/* Top-10 Bar chart for selected year */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
            Top Countries — {selectedYear}
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Portable batteries placed on market · tonnes · click bar to compare trend
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={top10} margin={{ top: 5, right: 10, left: -5, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v, n, p) => [`${v.toLocaleString()} t`, p.payload.country]}
                contentStyle={{ fontSize: '12px', borderRadius: '4px' }}
              />
              <Bar
                dataKey="tonnes"
                fill="#114b3e"
                radius={[3, 3, 0, 0]}
                onClick={(d) => setSelectedCountry(d.name === selectedCountry ? null : d.name)}
              >
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Country comparison trend (if selected) ─────────────────────── */}
      {selectedCountryData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
              {selectedCountryData.flag} {selectedCountryData.name} — Full Trend vs EU27
            </h3>
            <button
              onClick={() => setSelectedCountry(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}
            >✕</button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} allowDuplicatedCategory={false} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="country" tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="eu27" orientation="right" tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                yAxisId="country"
                data={selectedCountryData.trendData}
                dataKey="tonnes"
                stroke="#114b3e"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                name={selectedCountryData.name}
                connectNulls={false}
              />
              <Line
                yAxisId="eu27"
                data={EU27_AGGREGATE.trendData}
                dataKey="tonnes"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                dot={false}
                name="EU27 total (right axis)"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
            <span>Latest ({selectedCountryData.latestYear}): <strong>{fmt(selectedCountryData.latestTonnes)} t</strong></span>
            <span>YoY: <YoyIndicator pct={selectedCountryData.yoyPct} /></span>
            <span>Per capita: <strong>{selectedCountryData.perCapitaKg ?? '—'} kg</strong></span>
          </div>
        </div>
      )}

      {/* ── Full data table ────────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
            Country Data — {selectedYear}
          </h3>
          <input
            type="text"
            placeholder="Filter countries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.35rem 0.75rem', border: '1px solid var(--color-border-main)',
              borderRadius: '4px', fontSize: '0.8125rem', outline: 'none',
              backgroundColor: 'var(--color-bg-subtle)'
            }}
          />
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 160 }}><SortTh label="Country" k="name" /></th>
                <th><SortTh label="Tonnes on Market" k="yearTonnes" /></th>
                <th><SortTh label="YoY %" k="yearYoY" /></th>
                <th><SortTh label="Per Capita (kg)" k="perCapitaYear" /></th>
                <th><SortTh label="2009 Baseline" k={null} /></th>
                <th><SortTh label="2023 Latest" k="latestTonnes" /></th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(c => {
                const baseline2009 = c.timeSeries[2009];
                const maxVal = Math.max(...tableRows.map(r => r.yearTonnes || 0));
                const barPct = c.yearTonnes ? (c.yearTonnes / maxVal) * 100 : 0;
                const availCount = AVAILABLE_YEARS.filter(y => c.timeSeries[y] != null).length;
                return (
                  <tr
                    key={c.iso3}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedCountry(c.iso3 === selectedCountry ? null : c.iso3)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
                        <span style={{ fontWeight: 700 }}>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      {c.yearTonnes != null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--color-border-main)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ width: `${barPct}%`, height: '100%', backgroundColor: '#114b3e', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmt(c.yearTonnes)}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>not available</span>
                      )}
                    </td>
                    <td><YoyIndicator pct={c.yearYoY} /></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {c.perCapitaYear != null ? c.perCapitaYear : '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      {baseline2009 != null ? fmt(baseline2009) : <span style={{ color: '#dc2626' }}>—</span>}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {fmt(c.latestTonnes)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ height: '6px', width: `${(availCount / AVAILABLE_YEARS.length) * 50}px`, backgroundColor: availCount === AVAILABLE_YEARS.length ? '#15803d' : '#d97706', borderRadius: '3px', minWidth: '4px' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{availCount}/{AVAILABLE_YEARS.length} yr</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Methodology notes ──────────────────────────────────────────── */}
      <div style={{
        fontSize: '0.8125rem', color: 'var(--color-text-muted)', padding: '0.75rem 1rem',
        backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-light)',
        borderRadius: '6px', lineHeight: 1.6
      }}>
        <strong>Data notes:</strong>
        {DATASET_META.notes.map((n, i) => <span key={i}> {n} ·</span>)}
        {' '}Flags: <code>:</code> = not available · <code>b</code> = series break · <code>d</code> = definition differs · <code>e</code> = estimated · <code>i</code> = imputed by Eurostat.
      </div>

    </div>
  );
}

// Helper as JSX
function SortTh({ label, k, handleSort, sortKey, sortDir }) {
  return <span>{label}</span>;
}
