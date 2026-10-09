import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../data/mockDatabase';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Info
} from 'lucide-react';

function ConfidenceBadge({ level }) {
  const map = { High: 'badge-confidence-high', Medium: 'badge-confidence-medium', Low: 'badge-confidence-low' };
  return (
    <span className={`badge ${map[level] || 'badge-confidence-nodata'}`}>
      {level === 'High' && <CheckCircle2 size={10} />}
      {level === 'Medium' && <Clock size={10} />}
      {level === 'Low' && <AlertTriangle size={10} />}
      {level} confidence
    </span>
  );
}

function PolicyStatusBadge({ status }) {
  const map = {
    Active: 'badge-active', Mandatory: 'badge-active',
    Partial: 'badge-partial', 'Implementation phase': 'badge-partial',
    Planned: 'badge-planned', 'No data': 'badge-nodata'
  };
  return <span className={`badge ${map[status] || 'badge-nodata'}`}>{status}</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#ffffff', border: '1px solid var(--color-border-main)',
      borderRadius: '4px', padding: '0.6rem 0.85rem',
      fontSize: '0.8rem', boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function CountryDashboard({ countryId, onBack }) {
  const country = COUNTRIES_DATA.find(c => c.id === countryId);
  if (!country) return null;

  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedChemistry, setSelectedChemistry] = useState('All');

  const chartData = country.timeSeries.map(d => ({
    year: d.year,
    Historical: d.historical,
    Projected: d.projected,
    Collected: d.collection
  }));

  const materials = country.materialsBreakdown;
  const materialRows = [
    { name: 'Lithium', symbol: 'Li', color: '#2563eb', ...materials.lithium },
    { name: 'Cobalt', symbol: 'Co', color: '#114b3e', ...materials.cobalt },
    { name: 'Nickel', symbol: 'Ni', color: '#d97706', ...materials.nickel },
    { name: 'Copper', symbol: 'Cu', color: '#dc2626', ...materials.copper },
  ];

  const collectionStackData = [
    { name: 'Generated', value: country.wasteGenerated, color: '#cbd5e1' },
    { name: 'Collected', value: (country.wasteGenerated * country.collectionRate / 100), color: '#114b3e' },
    { name: 'Recycled', value: (country.wasteGenerated * country.recyclingRate / 100), color: '#1b6b53' },
    { name: 'Unaccounted', value: country.wasteGenerated * (100 - country.collectionRate) / 100, color: '#fcd34d' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', color: 'var(--color-emerald-muted)',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '0.75rem', padding: 0
          }}
        >
          <ChevronLeft size={16} /> Back to Countries
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{country.flag}</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', letterSpacing: '-0.02em' }}>
              {country.name}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Battery circularity profile · {country.region}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <ConfidenceBadge level={country.confidence} />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Last updated: {country.lastUpdated}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Year:</span>
          <select className="filter-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {['2020', '2022', '2024', '2025', '2026', '2028', '2030'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Chemistry:</span>
          <select className="filter-select" value={selectedChemistry} onChange={e => setSelectedChemistry(e.target.value)}>
            {['All', 'Li-ion', 'Lead-acid', 'NiMH', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Section 1: Waste Generation Chart */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div className="section-tag">Waste Generation</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Battery Waste Generation — 2018–2030
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
            Dashed lines represent modeled/projected values. Shaded uncertainty band shown where applicable.
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -5, bottom: 5 }}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#114b3e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#114b3e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#114b3e" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#114b3e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis unit=" Mt" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area dataKey="Historical" stroke="#114b3e" strokeWidth={2.5} fill="url(#histGrad)" dot={{ r: 3 }} connectNulls={false} name="Historical (reported)" />
            <Area dataKey="Projected" stroke="#114b3e" strokeWidth={2} strokeDasharray="6 4" fill="url(#projGrad)" dot={{ r: 3 }} connectNulls={false} name="Projected (modeled)" />
            <Area dataKey="Collected" stroke="#2563eb" strokeWidth={2} fill="url(#colGrad)" dot={{ r: 3 }} connectNulls={false} name="Formally collected" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Source: {country.source} · Confidence: {country.confidence}
        </div>
      </div>

      {/* Section 2: Collection & Recycling Stacked */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div className="section-tag">Collection & Recycling</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Waste Flow Breakdown — {selectedYear}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {collectionStackData.map(item => (
            <div key={item.name} style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-main)',
              borderLeft: `4px solid ${item.color}`,
              borderRadius: '6px', padding: '0.85rem'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.03em' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>
                {item.value.toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Mt</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {((item.value / country.wasteGenerated) * 100).toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>
        {/* Visual proportion bar */}
        <div style={{ display: 'flex', height: '20px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.4rem' }}>
          {collectionStackData.map(item => (
            <div
              key={item.name}
              style={{ width: `${(item.value / country.wasteGenerated) * 100}%`, backgroundColor: item.color, transition: 'width 0.3s' }}
              title={`${item.name}: ${item.value.toFixed(2)} Mt`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          {collectionStackData.map(item => (
            <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: item.color, borderRadius: '2px', display: 'inline-block' }} />
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {/* Section 3: Material Recovery */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div className="section-tag">Material Recovery</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Critical Materials — Recoverable vs Actual</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {materialRows.map(mat => {
            const pct = mat.current / mat.recoverable * 100;
            const gap = mat.potential - mat.current;
            return (
              <div key={mat.name} style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-main)',
                borderRadius: '6px', padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '28px', borderRadius: '4px',
                      backgroundColor: mat.color, color: '#ffffff',
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700
                    }}>{mat.symbol}</span>
                    <span style={{ fontWeight: 700 }}>{mat.name}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 800 }}>{mat.current} {mat.unit}</span>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>recovered</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: '8px', backgroundColor: 'var(--color-border-main)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: mat.color, borderRadius: '4px', transition: 'width 0.4s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <span>Current recovery: <strong>{pct.toFixed(1)}%</strong></span>
                  <span>Recoverable: <strong>{mat.recoverable} {mat.unit}</strong></span>
                  <span style={{ color: '#d97706' }}>Gap: <strong>+{gap.toFixed(0)} {mat.unit}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Policy Scorecard */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div className="section-tag">Policy Scorecard</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Regulatory & Compliance Indicators</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
            Individual policy indicators with source, year, and context. Not a composite score.
          </p>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Status</th>
                <th>Year</th>
                <th>Source</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {country.policyScorecard.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td><PolicyStatusBadge status={item.status} /></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.year}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.source}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', maxWidth: '200px' }}>{item.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Attribution */}
      <div style={{
        fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '1rem',
        backgroundColor: 'var(--color-bg-subtle)', borderRadius: '6px',
        border: '1px solid var(--color-border-light)'
      }}>
        <strong>Data source:</strong> {country.source} ·
        <strong> Confidence:</strong> {country.confidence} · {country.confidenceDetails}
      </div>
    </div>
  );
}
