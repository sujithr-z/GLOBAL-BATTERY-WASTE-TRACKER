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
  Legend,
  ReferenceLine
} from 'recharts';
import {
  X,
  AlertTriangle,
  ChevronRight,
  Info,
  ExternalLink,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

function ConfidenceBadge({ level }) {
  const map = {
    High: 'badge-confidence-high',
    Medium: 'badge-confidence-medium',
    Low: 'badge-confidence-low',
  };
  return (
    <span className={`badge ${map[level] || 'badge-confidence-nodata'}`}>
      {level === 'High' && <CheckCircle2 size={10} />}
      {level === 'Medium' && <Clock size={10} />}
      {level === 'Low' && <AlertTriangle size={10} />}
      Data confidence: {level}
    </span>
  );
}

function PolicyStatusBadge({ status }) {
  const map = {
    Active: 'badge-active',
    Mandatory: 'badge-active',
    Partial: 'badge-partial',
    'Implementation phase': 'badge-partial',
    Planned: 'badge-planned',
    'No data': 'badge-nodata'
  };
  return (
    <span className={`badge ${map[status] || 'badge-nodata'}`}>
      {status}
    </span>
  );
}

export default function CountryDrawer({ countryId, onClose, onOpenDashboard }) {
  const country = COUNTRIES_DATA.find(c => c.id === countryId);
  if (!country) return null;

  const [expandedPolicy, setExpandedPolicy] = useState(null);

  // Merge time series for chart
  const chartData = country.timeSeries.map(d => ({
    year: d.year,
    Historical: d.historical,
    Projected: d.projected,
    Collected: d.collection
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--color-border-main)',
        borderRadius: '4px',
        padding: '0.6rem 0.85rem',
        fontSize: '0.8rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
        {payload.map(p => p.value !== null && (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey}: <strong>{p.value?.toFixed(2)} Mt</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer-panel" role="complementary" aria-label="Country Detail Panel">

        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.1rem' }}>{country.flag}</div>
            <div className="drawer-title">{country.name}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.1rem' }}>
              {country.region} · Population {country.population}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button className="drawer-close-btn" onClick={onClose} aria-label="Close panel">
              <X size={20} />
            </button>
            <ConfidenceBadge level={country.confidence} />
          </div>
        </div>

        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Battery Waste', value: `${country.wasteGenerated} Mt`, sub: `${country.perCapita} kg / capita` },
              { label: 'Collection Rate', value: `${country.collectionRate}%`, sub: 'formally collected' },
              { label: 'Recycling Rate', value: `${country.recyclingRate}%`, sub: 'processed' },
              { label: 'EPR Status', value: country.eprStatus, sub: 'producer responsibility' },
            ].map(m => (
              <div
                key={m.label}
                style={{
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-main)',
                  borderRadius: '6px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Time-series Chart */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                Battery Waste Generation — 2018–2030
              </h4>
            </div>
            <div style={{
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-main)',
              borderRadius: '6px',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '20px', height: '2px', backgroundColor: '#114b3e', display: 'inline-block' }} />
                  Historical
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '20px', height: '2px', backgroundColor: '#114b3e', display: 'inline-block', borderTop: '2px dashed #114b3e', background: 'none' }} />
                  Projected (modeled)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '20px', height: '2px', backgroundColor: '#2563eb', display: 'inline-block' }} />
                  Collected
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis unit=" Mt" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={2025} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Now', position: 'top', fontSize: 10, fill: '#d97706' }} />
                  <Line dataKey="Historical" stroke="#114b3e" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
                  <Line dataKey="Projected" stroke="#114b3e" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3 }} connectNulls={false} />
                  <Line dataKey="Collected" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Narrative Insight */}
          <div style={{
            backgroundColor: '#f0f9f5',
            border: '1px solid var(--color-emerald-border)',
            borderRadius: '6px',
            padding: '1rem'
          }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-forest-main)', marginBottom: '0.4rem' }}>
              What this means
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
              {country.narrative}
            </p>
          </div>

          {/* Key Gaps */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem' }}>Key gaps</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {country.keyGaps.map((gap, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  padding: '0.45rem 0.75rem',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '4px'
                }}>
                  <AlertTriangle size={12} style={{ color: 'var(--color-amber-icon)', flexShrink: 0 }} />
                  {gap}
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Scorecard */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem' }}>Policy Scorecard</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {country.policyScorecard.map((indicator, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid var(--color-border-main)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--color-bg-surface)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setExpandedPolicy(expandedPolicy === i ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.75rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{indicator.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <PolicyStatusBadge status={indicator.status} />
                      <ChevronRight size={14} style={{ transform: expandedPolicy === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: 'var(--color-text-muted)' }} />
                    </div>
                  </button>
                  {expandedPolicy === i && (
                    <div style={{
                      padding: '0 0.75rem 0.75rem 0.75rem',
                      borderTop: '1px solid var(--color-border-light)',
                      paddingTop: '0.6rem'
                    }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                        {indicator.explanation}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        <span>Source: <strong>{indicator.source}</strong></span>
                        <span>Year: <strong>{indicator.year}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Source Attribution */}
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            padding: '0.75rem',
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: '4px',
            border: '1px solid var(--color-border-light)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Data source & confidence</div>
            <div style={{ lineHeight: 1.5 }}>
              <strong>Source:</strong> {country.source}<br />
              <strong>Confidence:</strong> {country.confidence} · {country.confidenceDetails}<br />
              <strong>Last updated:</strong> {country.lastUpdated}
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            onClick={() => onOpenDashboard(countryId)}
          >
            <span>Open Full Country Dashboard</span>
            <ExternalLink size={16} />
          </button>

        </div>
      </aside>
    </>
  );
}
