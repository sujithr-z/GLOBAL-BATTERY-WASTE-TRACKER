import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../data/mockDatabase';
import { AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';

function PolicyStatusBadge({ status }) {
  const map = {
    Active: 'badge-active', Mandatory: 'badge-active',
    Partial: 'badge-partial', 'Implementation phase': 'badge-partial',
    Planned: 'badge-planned', 'No data': 'badge-nodata'
  };
  return <span className={`badge ${map[status] || 'badge-nodata'}`}>{status}</span>;
}

const POLICY_LAYERS = [
  { id: 'epr', label: 'EPR Legislation', scorecardIndex: 0 },
  { id: 'collection', label: 'Collection Targets', scorecardIndex: 1 },
  { id: 'passport', label: 'Battery Passport', scorecardIndex: 2 },
  { id: 'producer', label: 'Producer Responsibility', scorecardIndex: 3 },
  { id: 'reporting', label: 'Reporting Framework', scorecardIndex: 4 },
];

function getStatusColor(status) {
  switch (status) {
    case 'Active': case 'Mandatory': return '#15803d';
    case 'Partial': case 'Implementation phase': return '#d97706';
    case 'Planned': return '#2563eb';
    case 'No data': return '#94a3b8';
    default: return '#94a3b8';
  }
}

function getStatusBg(status) {
  switch (status) {
    case 'Active': case 'Mandatory': return '#dcfce7';
    case 'Partial': case 'Implementation phase': return '#fef9c3';
    case 'Planned': return '#e0f2fe';
    default: return '#f1f5f9';
  }
}

export default function PolicyView({ onOpenDrawer }) {
  const [activeLayer, setActiveLayer] = useState('epr');
  const [drawerCountry, setDrawerCountry] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedIndicator, setExpandedIndicator] = useState(null);

  const layerInfo = POLICY_LAYERS.find(l => l.id === activeLayer);

  const filtered = COUNTRIES_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <div className="section-tag">Policy · Circularity Governance</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Battery Policy & Circularity
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Track EPR legislation, collection targets, recycling mandates, and battery passport adoption across 193 countries.
        </p>
      </div>

      {/* Policy Layer Selector */}
      <div className="filter-row">
        <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
          Policy layer:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {POLICY_LAYERS.map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid',
                fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                backgroundColor: activeLayer === layer.id ? 'var(--color-forest-main)' : 'transparent',
                color: activeLayer === layer.id ? '#ffffff' : 'var(--color-text-secondary)',
                borderColor: activeLayer === layer.id ? 'var(--color-forest-main)' : 'var(--color-border-main)'
              }}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Active', count: COUNTRIES_DATA.filter(c => ['Active', 'Mandatory'].includes(c.policyScorecard[layerInfo.scorecardIndex]?.status)).length, color: '#15803d', bg: '#dcfce7' },
          { label: 'Partial / In Progress', count: COUNTRIES_DATA.filter(c => ['Partial', 'Implementation phase'].includes(c.policyScorecard[layerInfo.scorecardIndex]?.status)).length, color: '#d97706', bg: '#fef9c3' },
          { label: 'Planned', count: COUNTRIES_DATA.filter(c => c.policyScorecard[layerInfo.scorecardIndex]?.status === 'Planned').length, color: '#2563eb', bg: '#e0f2fe' },
          { label: 'No Data', count: COUNTRIES_DATA.filter(c => c.policyScorecard[layerInfo.scorecardIndex]?.status === 'No data').length, color: '#64748b', bg: '#f1f5f9' },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: stat.bg, border: `1px solid ${stat.color}30`,
            borderLeft: `4px solid ${stat.color}`,
            borderRadius: '6px', padding: '0.85rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.count}</div>
            <div style={{ fontSize: '0.8125rem', color: stat.color, fontWeight: 600, marginTop: '0.2rem' }}>{stat.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>of {COUNTRIES_DATA.length} profiled</div>
          </div>
        ))}
      </div>

      {/* Policy Comparison Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Policy Comparison Table</h2>
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.35rem 0.75rem', border: '1px solid var(--color-border-main)',
              borderRadius: '4px', fontSize: '0.8125rem', outline: 'none',
              backgroundColor: 'var(--color-bg-subtle)'
            }}
          />
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>Country</th>
                <th>EPR Legislation</th>
                <th>Collection Target</th>
                <th>Battery Passport</th>
                <th>Producer Responsibility</th>
                <th>Reporting Framework</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(country => (
                <tr
                  key={country.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onOpenDrawer(country.id)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{country.flag}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{country.name}</span>
                    </div>
                  </td>
                  {country.policyScorecard.map((indicator, i) => (
                    <td key={i}>
                      <PolicyStatusBadge status={indicator.status} />
                    </td>
                  ))}
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {country.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Click a row to open country detail. Source: Global Battery Policy Monitor · Confidence: High for G20, Medium–Low for others.
        </div>
      </div>

      {/* Legend / Key */}
      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>Status Definitions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {[
            { status: 'Active', desc: 'Enacted and enforced national regulation with formal reporting and compliance mechanisms.' },
            { status: 'Mandatory', desc: 'Legally binding producer obligations with penalties for non-compliance.' },
            { status: 'Partial', desc: 'Partially implemented — covers some chemistries, waste streams, or geographic areas only.' },
            { status: 'Implementation phase', desc: 'Legislation enacted; compliance infrastructure or registry still being built.' },
            { status: 'Planned', desc: 'Formally proposed or committed but not yet enacted. Subject to revision.' },
            { status: 'No data', desc: 'No official national policy registered at time of data collection. Does not imply no legislation exists.' },
          ].map(item => (
            <div key={item.status} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              padding: '0.65rem', backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-light)', borderRadius: '4px'
            }}>
              <PolicyStatusBadge status={item.status} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--color-amber-bg)', border: '1px solid var(--color-amber-border)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--color-amber-text)', display: 'flex', gap: '0.5rem' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          Do not use unexplained composite scores. Each indicator has its own status, source, year, and context. See individual country profiles for explanation.
        </div>
      </div>

    </div>
  );
}
