import React, { useState } from 'react';
import { 
  GLOBAL_SUMMARY 
} from '../data/mockDatabase';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Download, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Globe2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export default function OverviewView({ 
  setActiveTab, 
  onSelectProvenance, 
  onOpenMethodology,
  onOpenCountryDrawer 
}) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedChemistry, setSelectedChemistry] = useState('All');
  const [selectedMassUnit, setSelectedMassUnit] = useState('Mt');
  const [viewMode, setViewMode] = useState('map'); // map or table

  const kpis = GLOBAL_SUMMARY.kpis;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Heading */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-emerald-muted)', letterSpacing: '0.05em' }}>
          OBSERVATORY / OVERVIEW
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: '0.25rem' }}>
          Global battery waste overview
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Tracking battery waste, recovery, critical materials and circularity across the world.
        </p>
      </div>

      {/* Institutional Warning Banner (Matches Figma Screenshot) */}
      <div className="alert-banner">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle className="alert-icon" size={20} style={{ color: 'var(--color-amber-icon)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div className="alert-banner-title">Illustrative data — not for policy decisions</div>
            <div style={{ fontSize: '0.8125rem' }}>
              Demonstration dataset only. Values, comparisons and insights are not validated findings for sovereign regulatory enforcement.
            </div>
          </div>
        </div>
        <button 
          onClick={onOpenMethodology}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-amber-text)', 
            fontWeight: 700, 
            fontSize: '0.8125rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            textDecoration: 'underline'
          }}
        >
          Read limitations →
        </button>
      </div>

      {/* Global Filter Toolbar */}
      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Region:</span>
          <select className="filter-select">
            <option>Global (All 193 Countries)</option>
            <option>Asia-Pacific</option>
            <option>Europe</option>
            <option>North America</option>
            <option>Latin America</option>
            <option>Africa</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Year:</span>
          <select 
            className="filter-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2020">2020</option>
            <option value="2022">2022</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2028">2028</option>
            <option value="2030">2030</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Chemistry:</span>
          <select 
            className="filter-select"
            value={selectedChemistry}
            onChange={(e) => setSelectedChemistry(e.target.value)}
          >
            <option value="All">All Batteries</option>
            <option value="Li-ion">Lithium-ion (EV & Storage)</option>
            <option value="Lead-acid">Lead-acid (Automotive/Industrial)</option>
            <option value="Other">Other (NiMH, NiCd, Primary)</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Unit:</span>
          <select 
            className="filter-select"
            value={selectedMassUnit}
            onChange={(e) => setSelectedMassUnit(e.target.value)}
          >
            <option value="Mt">Mass (Mt)</option>
            <option value="kt">Mass (kt)</option>
            <option value="capita">kg / capita</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary"
            onClick={() => setActiveTab('data')}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            <FileSpreadsheet size={14} />
            <span>Export View</span>
          </button>
        </div>
      </div>

      {/* 01 / DATA · KEY INDICATORS STRIP */}
      <div>
        <div className="section-tag">01 / DATA · KEY INDICATORS</div>
        <div className="kpi-grid">
          
          {/* Card 1: Waste Generated */}
          <div className="kpi-card">
            <div>
              <div className="kpi-title">
                <span>Waste Generated</span>
                <span className="badge badge-confidence-medium">Medium Conf.</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">{kpis.wasteGenerated.value}</span>
                <span className="kpi-unit">{kpis.wasteGenerated.unit}</span>
              </div>
              <div className="kpi-meta-row">
                <span className="kpi-trend-up">↑ {kpis.wasteGenerated.change} {kpis.wasteGenerated.period}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                Target: {kpis.wasteGenerated.target}
              </div>
            </div>
            <div 
              className="kpi-provenance"
              onClick={() => onSelectProvenance('Battery Waste Generated', kpis.wasteGenerated)}
            >
              <span>{kpis.wasteGenerated.source.slice(0, 32)}...</span>
              <Info size={12} />
            </div>
          </div>

          {/* Card 2: Documented Collection */}
          <div className="kpi-card">
            <div>
              <div className="kpi-title">
                <span>Formal Collection Rate</span>
                <span className="badge badge-confidence-high">High Conf.</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">{kpis.formalCollection.value}</span>
                <span className="kpi-unit">of generated</span>
              </div>
              <div className="kpi-meta-row">
                <span className="kpi-trend-up">↑ {kpis.formalCollection.change} {kpis.formalCollection.period}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                Target: {kpis.formalCollection.target}
              </div>
            </div>
            <div 
              className="kpi-provenance"
              onClick={() => onSelectProvenance('Formal Collection', kpis.formalCollection)}
            >
              <span>{kpis.formalCollection.source.slice(0, 32)}...</span>
              <Info size={12} />
            </div>
          </div>

          {/* Card 3: Material Recovery Potential */}
          <div className="kpi-card">
            <div>
              <div className="kpi-title">
                <span>Material Recovery</span>
                <span className="badge badge-confidence-medium">Medium Conf.</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">{kpis.materialRecovery.value}</span>
                <span className="kpi-unit">{kpis.materialRecovery.unit}</span>
              </div>
              <div className="kpi-meta-row">
                <span className="kpi-trend-up">↑ {kpis.materialRecovery.change} {kpis.materialRecovery.period}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                Potential: {kpis.materialRecovery.target}
              </div>
            </div>
            <div 
              className="kpi-provenance"
              onClick={() => onSelectProvenance('Material Recovery Potential', kpis.materialRecovery)}
            >
              <span>{kpis.materialRecovery.source.slice(0, 32)}...</span>
              <Info size={12} />
            </div>
          </div>

          {/* Card 4: Countries Tracked */}
          <div className="kpi-card">
            <div>
              <div className="kpi-title">
                <span>Countries Tracked</span>
                <span className="badge badge-confidence-high">High Conf.</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">{kpis.countriesTracked.value}</span>
                <span className="kpi-unit">{kpis.countriesTracked.unit}</span>
              </div>
              <div className="kpi-meta-row">
                <span style={{ color: 'var(--color-text-muted)' }}>100% UN Member States</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                48 with mandatory registries
              </div>
            </div>
            <div 
              className="kpi-provenance"
              onClick={() => onSelectProvenance('Countries Tracked', kpis.countriesTracked)}
            >
              <span>{kpis.countriesTracked.source.slice(0, 32)}...</span>
              <Info size={12} />
            </div>
          </div>

          {/* Card 5: Policy Coverage */}
          <div className="kpi-card">
            <div>
              <div className="kpi-title">
                <span>Policy Coverage</span>
                <span className="badge badge-confidence-high">High Conf.</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">{kpis.policyCoverage.value}</span>
                <span className="kpi-unit">of global pop.</span>
              </div>
              <div className="kpi-meta-row">
                <span className="kpi-trend-up">↑ {kpis.policyCoverage.change} {kpis.policyCoverage.period}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                Target: {kpis.policyCoverage.target}
              </div>
            </div>
            <div 
              className="kpi-provenance"
              onClick={() => onSelectProvenance('Policy Coverage', kpis.policyCoverage)}
            >
              <span>{kpis.policyCoverage.source.slice(0, 32)}...</span>
              <Info size={12} />
            </div>
          </div>

        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD CONTENT (Matches Figma Screenshot 1 & 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* LEFT CARD: 02 / CONTEXT · Regional distribution */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Where battery waste is generated</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  02 / CONTEXT · Regional distribution, 2025
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--color-bg-subtle)', padding: '2px', borderRadius: '4px', border: '1px solid var(--color-border-main)' }}>
                <button 
                  style={{
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '3px',
                    backgroundColor: viewMode === 'map' ? 'var(--color-forest-main)' : 'transparent',
                    color: viewMode === 'map' ? '#ffffff' : 'var(--color-text-secondary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setViewMode('map')}
                >
                  Map
                </button>
                <button 
                  style={{
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '3px',
                    backgroundColor: viewMode === 'table' ? 'var(--color-forest-main)' : 'transparent',
                    color: viewMode === 'table' ? '#ffffff' : 'var(--color-text-secondary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
              </div>
            </div>

            {/* Regional Map Preview Graphic (Matching Figma Prototype SVG schematic) */}
            <div style={{
              background: 'linear-gradient(180deg, #f3f7f2 0%, #e9efeb 100%)',
              border: '1px solid var(--color-border-main)',
              borderRadius: '6px',
              padding: '1.25rem',
              textAlign: 'center',
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <svg viewBox="0 0 500 240" style={{ width: '100%', height: 'auto', maxHeight: '180px' }}>
                {/* World outlines simplified background */}
                <path d="M70,70 Q90,50 140,60 T130,120 T80,100 Z" fill="#c3d5cb" opacity="0.6" />
                <path d="M120,130 Q140,140 160,190 T120,200 T110,150 Z" fill="#c3d5cb" opacity="0.6" />
                <path d="M220,50 Q280,40 310,80 T260,110 T210,70 Z" fill="#c3d5cb" opacity="0.6" />
                <path d="M240,120 Q280,130 270,180 T230,190 T220,140 Z" fill="#c3d5cb" opacity="0.6" />
                <path d="M320,40 Q420,30 460,90 T380,140 T310,100 Z" fill="#c3d5cb" opacity="0.6" />
                <path d="M400,160 Q440,160 450,190 T410,200 Z" fill="#c3d5cb" opacity="0.6" />

                {/* Regional proportional circles matching reference image */}
                {/* Asia: 50% */}
                <circle cx="380" cy="85" r="32" fill="#114b3e" opacity="0.85" />
                <text x="380" y="89" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">Asia 50%</text>

                {/* Europe: 20% */}
                <circle cx="260" cy="65" r="20" fill="#114b3e" opacity="0.85" />
                <text x="260" y="68" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">EUR 20%</text>

                {/* Americas: 20% */}
                <circle cx="110" cy="85" r="20" fill="#114b3e" opacity="0.85" />
                <text x="110" y="88" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">AMER 20%</text>

                {/* Africa: 7% */}
                <circle cx="250" cy="145" r="12" fill="#114b3e" opacity="0.85" />
                <text x="250" y="148" fill="#ffffff" fontSize="8" fontWeight="700" textAnchor="middle">AFR 7%</text>

                {/* Oceania: 3% */}
                <circle cx="430" cy="175" r="8" fill="#114b3e" opacity="0.85" />
              </svg>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'left', marginTop: '0.35rem' }}>
                ● Circle area represents annual battery waste volume, not environmental risk.
              </div>
            </div>

            {/* Regional Data Breakdown List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              {GLOBAL_SUMMARY.regionalDistribution.map((r) => (
                <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {r.wasteMt.toFixed(2)} Mt · <span style={{ color: 'var(--color-emerald-muted)' }}>{r.percentage}%</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Narrative Insight */}
            <div style={{ marginTop: '1rem', backgroundColor: 'var(--color-bg-subtle)', padding: '0.85rem', borderRadius: '4px', borderLeft: '3px solid var(--color-forest-accent)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-forest-main)' }}>
                Asia represents half of this demonstration total.
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                Compare regional volumes before exploring country-level collection and recycling systems.
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                2025 · Source: UNEP Demonstration Dataset · Confidence: Medium
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setActiveTab('map')}
            >
              <span>Explore global map</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT CARD: 03 / INSIGHT · Generation and Collection trend */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              03 / INSIGHT · Generation and collection, 2020–2025
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.2rem' }}>
              The collection gap persists
            </h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-forest-main)', lineHeight: 1 }}>+20%</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Waste generated in 2025 compared with 2020</span>
            </div>

            {/* Recharts Horizontal Stacked Collection Bar (Matching Figma Image 4) */}
            <div style={{ height: '180px', marginTop: '0.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { year: '2020', Collected: 3.0, Undocumented: 7.0, total: 10.0 },
                    { year: '2025', Collected: 8.0, Undocumented: 10.7, total: 18.7 }
                  ]}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <XAxis type="number" unit=" Mt" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="year" tick={{ fontSize: 12, fontWeight: 700 }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} Mt`, name]}
                    contentStyle={{ fontSize: '12px', borderRadius: '4px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Collected" stackId="a" fill="#114b3e" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Undocumented" stackId="a" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insight Text */}
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem', lineHeight: 1.5 }}>
              The formal collection rate rises from 30% to 42.8%, but undocumented volume also grows: 7.0 to 10.7 Mt.
              <br />
              <strong style={{ color: 'var(--color-text-primary)' }}>Track absolute volumes alongside rates to understand the scale of the collection challenge.</strong>
            </div>
          </div>

          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem', marginTop: '1rem' }}>
            2025 · Source: UNEP E-waste Observatory · Confidence: Medium · Series 2020–2025
          </div>
        </div>

      </div>

      {/* CHEMISTRIES & RECOVERY CONTEXT CARD (Matching Figma Screenshot 5) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Chemistries & recovery context</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Waste mix and documented collection · 2025
            </div>
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('materials')}
            style={{ fontSize: '0.75rem' }}
          >
            Explore critical materials →
          </button>
        </div>

        {/* Stacked Chemistry Bar */}
        <div style={{ display: 'flex', height: '14px', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ width: '60%', backgroundColor: '#114b3e' }} title="Lead-acid 60%" />
          <div style={{ width: '30%', backgroundColor: '#2563eb' }} title="Lithium-ion 30%" />
          <div style={{ width: '10%', backgroundColor: '#d97706' }} title="Other chemistries 10%" />
        </div>

        {/* Chemistries Breakdown Table */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {GLOBAL_SUMMARY.chemistries.map((chem) => (
            <div 
              key={chem.name}
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-main)',
                borderRadius: '6px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: chem.color }}>
                  {chem.name}
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                  {chem.collectionRate}% <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>collected</span>
                </span>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.4rem 0' }}>
                {chem.generatedMt} Mt generated / {chem.collectedMt} Mt collected
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Recovery focus: {chem.recoveryFocus}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem', borderTop: '1px dashed var(--color-border-main)', paddingTop: '0.4rem' }}>
                {chem.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 04 / ACTION · QUESTIONS TO INVESTIGATE (Matching Figma Image 1) */}
      <div className="card">
        <div className="section-tag">04 / ACTION · Questions to investigate, not recommendations</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>From insight to action</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
              REGULATORS
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14532d', margin: '0.3rem 0' }}>
              Make waste pathways visible
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#166534' }}>
              Review reporting and traceability requirements before interpreting collection-gap metrics.
            </p>
            <button 
              onClick={() => setActiveTab('policy')}
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#15803d', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}
            >
              Explore policy →
            </button>
          </div>

          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
              PRODUCERS & RECYCLERS
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', margin: '0.3rem 0' }}>
              Prioritize safe collection
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#1e40af' }}>
              Expand chemistry-specific take-back systems, sorting, and pre-treatment capacity.
            </p>
            <button 
              onClick={() => setActiveTab('countries')}
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}
            >
              Compare countries →
            </button>
          </div>

          <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase' }}>
              RESEARCHERS & PUBLIC
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#581c87', margin: '0.3rem 0' }}>
              Validate before using
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#6b21a8' }}>
              Check definitions, coverage, and uncertainty. Replace demonstration values with verified local data.
            </p>
            <button 
              onClick={onOpenMethodology}
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#7e22ce', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}
            >
              Review methodology →
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
