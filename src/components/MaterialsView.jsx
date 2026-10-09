import React, { useState } from 'react';
import { MATERIALS_DATA } from '../data/mockDatabase';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Info, ChevronDown, ChevronRight } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--color-border-main)',
      borderRadius: '4px', padding: '0.6rem 0.85rem', fontSize: '0.8rem', boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.stroke, display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{p.dataKey}:</span>
          <strong>{p.value.toLocaleString()} kt</strong>
        </div>
      ))}
    </div>
  );
};

export default function MaterialsView() {
  const [selectedMat, setSelectedMat] = useState('lithium');
  const [expandedSankey, setExpandedSankey] = useState(null);

  const { materials, recoverableProjection, sankeyStages, insightDetails } = MATERIALS_DATA;
  const activeMat = materials.find(m => m.id === selectedMat);
  const insight = insightDetails[selectedMat];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <div className="section-tag">Critical Materials · Recovery Intelligence</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Critical Materials
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          How much valuable material could be recovered from future battery waste?
        </p>
      </div>

      {/* Material Selector Tabs */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-main)',
        borderRadius: '6px', padding: '0.5rem'
      }}>
        {materials.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMat(m.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.85rem', borderRadius: '4px', border: 'none',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              backgroundColor: selectedMat === m.id ? m.color : 'transparent',
              color: selectedMat === m.id ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'background 0.15s'
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              border: selectedMat === m.id ? '1px solid rgba(255,255,255,0.5)' : '1px solid var(--color-border-main)',
              borderRadius: '3px', padding: '0 0.2rem', lineHeight: '1.4'
            }}>
              {m.symbol}
            </span>
            {m.name}
          </button>
        ))}
      </div>

      {/* Main Chart + Insight Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Area Chart */}
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Global Recoverable {activeMat?.name} — 2020–2040
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              Annual recoverable quantity from end-of-life batteries under full-collection scenario. Dashed = projected.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={recoverableProjection}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeMat?.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={activeMat?.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis unit=" kt" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                dataKey={selectedMat}
                stroke={activeMat?.color}
                strokeWidth={2.5}
                fill="url(#matGrad)"
                dot={{ r: 4, fill: activeMat?.color }}
                name={activeMat?.name}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Source: UNEP/IEA Secondary Material Yield Model · Confidence: Medium · 2025 reference year
          </div>
        </div>

        {/* Insight Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ borderLeft: `4px solid ${activeMat?.color}` }}>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              Recovery Opportunity
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>
              {insight?.narrative}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              {[
                { label: 'Recoverable tonnes', value: insight?.recoverableTonnes },
                { label: 'Current recovery', value: insight?.currentRecovery },
                { label: 'Theoretical potential', value: insight?.theoreticalPotential },
                { label: 'Recovery gap', value: insight?.recoveryGap, warn: true },
              ].map(row => (
                <div key={row.label} style={{
                  padding: '0.5rem', backgroundColor: row.warn ? '#fff7ed' : 'var(--color-bg-subtle)',
                  border: `1px solid ${row.warn ? '#fed7aa' : 'var(--color-border-light)'}`, borderRadius: '4px'
                }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{row.label}</div>
                  <div style={{ fontWeight: 700, marginTop: '0.15rem', color: row.warn ? '#c2410c' : 'var(--color-text-primary)' }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Materials Comparison */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          All Critical Materials — Global Recoverable (2025)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { mat: 'lithium', col: '#2563eb', recoverable: '275', current: '98', unit: 'kt', symbol: 'Li' },
            { mat: 'cobalt', col: '#114b3e', recoverable: '78', current: '42', unit: 'kt', symbol: 'Co' },
            { mat: 'nickel', col: '#d97706', recoverable: '440', current: '215', unit: 'kt', symbol: 'Ni' },
            { mat: 'copper', col: '#dc2626', recoverable: '980', current: '520', unit: 'kt', symbol: 'Cu' },
            { mat: 'manganese', col: '#64748b', recoverable: '260', current: '85', unit: 'kt', symbol: 'Mn' },
            { mat: 'graphite', col: '#334155', recoverable: '620', current: '95', unit: 'kt', symbol: 'C' },
          ].map(m => {
            const pct = (Number(m.current) / Number(m.recoverable)) * 100;
            return (
              <div
                key={m.mat}
                onClick={() => setSelectedMat(m.mat)}
                style={{
                  backgroundColor: selectedMat === m.mat ? '#f0f9f5' : 'var(--color-bg-subtle)',
                  border: `1px solid ${selectedMat === m.mat ? 'var(--color-emerald-border)' : 'var(--color-border-main)'}`,
                  borderLeft: `4px solid ${m.col}`,
                  borderRadius: '6px', padding: '1rem', cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '28px', height: '28px', borderRadius: '4px',
                    backgroundColor: m.col, color: '#fff',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {m.symbol}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    {pct.toFixed(0)}% recovered
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>{m.current} {m.unit}</strong> of <strong>{m.recoverable} {m.unit}</strong>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-border-main)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: m.col, borderRadius: '3px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sankey Flow Diagram */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Battery Material Flow — 2025</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Schematic flow from production through collection to material recovery. Click each stage to expand.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {sankeyStages.map((stage, i) => (
            <div key={stage.id}>
              <button
                onClick={() => setExpandedSankey(expandedSankey === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', background: expandedSankey === i ? '#f0f9f5' : 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-main)', borderRadius: expandedSankey === i ? '6px 6px 0 0' : '6px',
                  cursor: 'pointer', textAlign: 'left', marginBottom: expandedSankey === i ? 0 : '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'var(--color-forest-main)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{stage.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-forest-main)', fontWeight: 600 }}>{stage.value}</div>
                  </div>
                </div>
                {expandedSankey === i ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {expandedSankey === i && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f0f9f5',
                  border: '1px solid var(--color-border-main)',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '4px'
                }}>
                  {stage.detail}
                </div>
              )}
              {i < sankeyStages.length - 1 && (
                <div style={{
                  width: '2px', height: '12px', backgroundColor: 'var(--color-emerald-muted)',
                  margin: '0 auto 4px auto'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
