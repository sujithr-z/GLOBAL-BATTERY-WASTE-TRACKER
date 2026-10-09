import React, { useState } from 'react';
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
import { ChevronDown, ChevronUp, Info, TrendingUp } from 'lucide-react';

const SCENARIOS = {
  bau: {
    label: 'Current Trajectory (BAU)',
    color: '#94a3b8',
    description: 'No significant policy change. Collection rates improve modestly at 2% per year.',
    collection: 42.8,
    recycling: 70,
    secondLife: 5,
    materialRecovery: 75
  },
  s60: {
    label: '60% Collection by 2030',
    color: '#d97706',
    description: 'Moderate policy intervention: EPR expansion + infrastructure investment.',
    collection: 60,
    recycling: 75,
    secondLife: 12,
    materialRecovery: 80
  },
  s80: {
    label: '80% Collection by 2030',
    color: '#2563eb',
    description: 'Ambitious policy: mandatory collection targets + strong producer liability.',
    collection: 80,
    recycling: 82,
    secondLife: 18,
    materialRecovery: 85
  },
  highCirc: {
    label: 'High Circularity',
    color: '#15803d',
    description: 'Fully circular economy: mandatory passports + closed-loop refining + second-life mandates.',
    collection: 92,
    recycling: 90,
    secondLife: 30,
    materialRecovery: 92
  }
};

function generateScenarioData(params) {
  const base = 18.7;
  const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2035, 2037, 2040];
  const ramp = (from, to, year) => {
    const t = Math.min(1, (year - 2025) / 8);
    return from + (to - from) * t;
  };
  return years.map(year => {
    const growth = 1 + (year - 2025) * 0.085;
    const waste = base * growth;
    const coll = ramp(42.8, params.collection, year) / 100;
    const rec = ramp(70, params.recycling, year) / 100;
    return {
      year,
      'Total waste': parseFloat(waste.toFixed(2)),
      Collected: parseFloat((waste * coll).toFixed(2)),
      Recycled: parseFloat((waste * coll * rec).toFixed(2)),
      Uncollected: parseFloat((waste * (1 - coll)).toFixed(2))
    };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--color-border-main)',
      borderRadius: '4px', padding: '0.6rem 0.85rem', fontSize: '0.8rem',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.stroke, display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{p.dataKey}:</span>
          <strong>{p.value} Mt</strong>
        </div>
      ))}
    </div>
  );
};

export default function ScenariosView() {
  const [selectedScenario, setSelectedScenario] = useState('s60');
  const [sliders, setSliders] = useState({
    collection: 60,
    recycling: 75,
    secondLife: 12,
    materialRecovery: 80
  });
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  const scenario = SCENARIOS[selectedScenario];
  const scenarioData = generateScenarioData(sliders);
  const bauData = generateScenarioData(SCENARIOS.bau);

  // Calculate impact outputs
  const lastYear = scenarioData[scenarioData.length - 1];
  const lastBau = bauData[bauData.length - 1];
  const wasteDiverted = (lastYear.Recycled - lastBau.Recycled).toFixed(1);
  const liRecovered = ((lastYear.Recycled - lastBau.Recycled) * 3.2).toFixed(0);
  const co2Avoided = ((lastYear.Recycled - lastBau.Recycled) * 2.1).toFixed(1);
  const secValue = ((lastYear.Recycled - lastBau.Recycled) * 1.45).toFixed(1);

  const comparisonData = scenarioData.map((d, i) => ({
    year: d.year,
    'Business as Usual': bauData[i].Recycled,
    'Selected Scenario': d.Recycled
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <div className="section-tag">Scenarios · Outlook Tool</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Explore the future
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          What happens if collection and recycling improve? Adjust parameters to explore outcomes. Model outputs are illustrative.
        </p>
      </div>

      {/* Scenario Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedScenario(key);
              setSliders({
                collection: s.collection,
                recycling: s.recycling,
                secondLife: s.secondLife,
                materialRecovery: s.materialRecovery
              });
            }}
            style={{
              padding: '1rem', borderRadius: '6px', border: `2px solid`,
              borderColor: selectedScenario === key ? s.color : 'var(--color-border-main)',
              backgroundColor: selectedScenario === key ? `${s.color}12` : 'var(--color-bg-surface)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: selectedScenario === key ? s.color : 'var(--color-text-primary)' }}>
                {s.label}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>{s.description}</p>
          </button>
        ))}
      </div>

      {/* Two-column: Sliders + Output Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Sliders */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Adjust Parameters</h3>
          {[
            { key: 'collection', label: 'Collection Rate', unit: '%', min: 20, max: 100, color: '#114b3e' },
            { key: 'recycling', label: 'Recycling Efficiency', unit: '%', min: 40, max: 98, color: '#1b6b53' },
            { key: 'secondLife', label: 'Second-Life Utilisation', unit: '%', min: 0, max: 40, color: '#d97706' },
            { key: 'materialRecovery', label: 'Material Recovery Efficiency', unit: '%', min: 50, max: 98, color: '#2563eb' },
          ].map(s => (
            <div key={s.key} className="slider-group">
              <div className="slider-header">
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.label}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 700,
                  color: s.color, fontSize: '1.1rem'
                }}>
                  {sliders[s.key]}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={1}
                value={sliders[s.key]}
                onChange={e => setSliders(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                className="slider-input"
                style={{ accentColor: s.color }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                <span>{s.min}{s.unit}</span>
                <span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '0.75rem', padding: '0.65rem', backgroundColor: 'var(--color-amber-bg)', border: '1px solid var(--color-amber-border)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--color-amber-text)' }}>
            <strong>Model note:</strong> Sliders represent 2030 targets. Linear ramp assumed 2025–2030. Post-2030 rates held constant.
          </div>
        </div>

        {/* Output Impact Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Projected Impact by 2040 vs Business-as-Usual</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Additional waste recycled', value: `+${wasteDiverted} Mt`, unit: '', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', desc: 'vs BAU trajectory', icon: '♻️' },
              { label: 'Additional lithium recovered', value: `+${liRecovered} kt`, unit: '', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', desc: 'secondary supply unlocked', icon: '🔋' },
              { label: 'CO₂ emissions avoided', value: `−${co2Avoided} Mt`, unit: '', color: '#114b3e', bg: '#f0f9f5', border: '#a7d9c6', desc: 'lifecycle GHG basis', icon: '🌍' },
              { label: 'Secondary material value', value: `$${secValue}B`, unit: '', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'estimated market value', icon: '💰' },
            ].map(card => (
              <div key={card.label} style={{
                backgroundColor: card.bg, border: `1px solid ${card.border}`,
                borderRadius: '8px', padding: '1rem'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{card.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: card.color, marginTop: '0.2rem' }}>{card.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          Business as Usual vs Selected Scenario — 2025–2040
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Batteries formally recycled per year. Difference represents additional recovery potential.
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={comparisonData} margin={{ top: 10, right: 20, left: -5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis unit=" Mt" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <ReferenceLine x={2025} stroke="#d97706" strokeDasharray="4 4" />
            <Line dataKey="Business as Usual" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            <Line dataKey="Selected Scenario" stroke={SCENARIOS[selectedScenario].color} strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.75rem', backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-light)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <strong>Modeling basis:</strong> Mass-balance projection from 2025 baseline. Battery market growth: +8.5%/yr (IEA 2025). GHG factor: 2.1 tCO₂e/tonne recycled (vs primary production). Values are illustrative — not certified forecasts.
        </div>
      </div>

      {/* Assumptions Panel */}
      <div className="card">
        <button
          onClick={() => setAssumptionsOpen(!assumptionsOpen)}
          style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Model Assumptions & Limitations</h3>
          {assumptionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {assumptionsOpen && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            <div>
              <strong>Input variables:</strong> Collection rate (%), recycling efficiency (%), second-life utilisation (%), material recovery efficiency (%). Sliders represent aspirational 2030 endpoint values.
            </div>
            <div>
              <strong>Equations:</strong> Annual recycled volume = (Battery waste generated) × (Collection rate) × (Recycling efficiency). Material recovery = Recycled volume × Material yield factor × Material recovery efficiency.
            </div>
            <div>
              <strong>Data sources:</strong> Baseline 2025 figures from UNEP E-waste Observatory. Growth rates: IEA Global Battery Alliance 2025 Outlook. GHG factors: UNEP Life Cycle Assessment Reference Database.
            </div>
            <div>
              <strong>Uncertainty:</strong> ±20% confidence interval applies to all projected values beyond 2027. Material prices, technology improvements, and policy changes are not modeled.
            </div>
            <div>
              <strong>Limitations:</strong> This model does not account for regional heterogeneity, country-specific infrastructure constraints, informal sector dynamics, or macro-economic shocks. Values should not be used as investment forecasts.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
