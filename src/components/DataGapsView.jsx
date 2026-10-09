import React from 'react';
import { COUNTRIES_DATA } from '../data/mockDatabase';
import { AlertTriangle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

const CONFIDENCE_MAP = [
  { level: 'High', label: 'High confidence', color: '#15803d', bg: '#dcfce7', border: '#bbf7d0', pattern: 'solid', count: 0 },
  { level: 'Medium', label: 'Medium confidence', color: '#d97706', bg: '#fef9c3', border: '#fde68a', pattern: 'dotted', count: 0 },
  { level: 'Low', label: 'Low confidence', color: '#dc2626', bg: '#fee2e2', border: '#fecaca', pattern: 'dashed', count: 0 },
  { level: 'No data', label: 'No official data', color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0', pattern: 'none', count: 0 },
];

CONFIDENCE_MAP.forEach(cm => {
  cm.count = COUNTRIES_DATA.filter(c => c.confidence === cm.level).length;
});

const noDataCount = 193 - COUNTRIES_DATA.length;

export default function DataGapsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <div className="section-tag">Data Gaps · Transparency Layer</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Where data is missing
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Absence of data should never silently become false precision.
          This page maps the geographic distribution of data quality and coverage gaps.
        </p>
      </div>

      {/* Critical Notice */}
      <div className="alert-banner">
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} style={{ color: 'var(--color-amber-icon)', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontWeight: 700 }}>Data absence ≠ zero waste</div>
            <div style={{ fontSize: '0.8125rem', marginTop: '0.15rem' }}>
              Countries with "No data" designation still generate battery waste — it is simply not systematically measured.
              Misinterpreting absence as zero will grossly underestimate the global total.
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'High confidence', count: COUNTRIES_DATA.filter(c => c.confidence === 'High').length, total: 193, color: '#15803d', bg: '#f0fdf4', icon: <CheckCircle2 size={20} color="#15803d" />, desc: 'Official national statistics with audited reporting' },
          { label: 'Medium confidence', count: COUNTRIES_DATA.filter(c => c.confidence === 'Medium').length, total: 193, color: '#d97706', bg: '#fffbeb', icon: <Clock size={20} color="#d97706" />, desc: 'Partial reporting + modeled infill' },
          { label: 'Low confidence', count: COUNTRIES_DATA.filter(c => c.confidence === 'Low').length, total: 193, color: '#dc2626', bg: '#fef2f2', icon: <AlertTriangle size={20} color="#dc2626" />, desc: 'Proxy and import-balance estimates only' },
          { label: 'No official data', count: 193 - COUNTRIES_DATA.length, total: 193, color: '#64748b', bg: '#f8fafc', icon: <HelpCircle size={20} color="#64748b" />, desc: 'No recognized national battery-waste statistics' },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: stat.bg, border: `1px solid ${stat.color}30`,
            borderLeft: `4px solid ${stat.color}`,
            borderRadius: '8px', padding: '1rem'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.count}</div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: stat.color, marginTop: '0.1rem' }}>{stat.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{stat.desc}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              {((stat.count / stat.total) * 100).toFixed(1)}% of 193 countries
            </div>
          </div>
        ))}
      </div>

      {/* Data Gaps by Country */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Confidence by Country
        </h2>

        {/* Countries with detailed profiles */}
        {['High', 'Medium', 'Low'].map(level => {
          const countries = COUNTRIES_DATA.filter(c => c.confidence === level);
          const conf = CONFIDENCE_MAP.find(m => m.level === level);
          return (
            <div key={level} style={{ marginBottom: '1.25rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.75rem', paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border-light)'
              }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '2px',
                  backgroundColor: conf?.color, flexShrink: 0
                }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: conf?.color }}>
                  {conf?.label} ({countries.length} countries)
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {countries.map(c => (
                  <div key={c.id} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.3rem 0.65rem',
                    backgroundColor: conf?.bg,
                    border: `1px solid ${conf?.border}`,
                    borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 600
                  }}>
                    {c.flag} {c.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* No official data block */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border-light)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#64748b', flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#64748b' }}>
              No official data ({noDataCount} remaining nations — representative examples)
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, backgroundColor: 'var(--color-bg-subtle)', padding: '0.85rem', borderRadius: '4px', border: '1px solid var(--color-border-light)' }}>
            <p>Countries without established national battery waste collection/reporting systems include many Sub-Saharan African, Pacific Island, and Central Asian nations. 
            For the purposes of this demonstration, {noDataCount} additional UN member states are estimated to have modeled or partial coverage only.</p>
            <p style={{ marginTop: '0.5rem' }}>
              Examples: Democratic Republic of Congo, Ethiopia, Myanmar, Yemen, Laos, Papua New Guinea, and many smaller island states.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology: Why data gaps exist */}
      <div className="card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Why data gaps persist
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'No mandatory national registry', desc: 'Many countries lack legislation requiring producers and recyclers to report battery volumes. Without legal mandates, no systematic data is collected.' },
            { title: 'Informal sector opacity', desc: 'A large proportion of end-of-life batteries are processed by informal dismantlers and scrap traders who operate outside formal reporting systems.' },
            { title: 'Mixed battery definitions', desc: 'Different statistical agencies use incompatible product category codes for batteries, making cross-country comparison difficult without harmonization.' },
            { title: 'Lack of technical capacity', desc: 'Smaller nations may not have the institutional capacity to design and implement battery waste tracking systems without external technical support.' },
            { title: 'Confidential commercial data', desc: 'Some battery recycling volumes are commercially sensitive trade secrets that producers are unwilling to disclose publicly.' },
            { title: 'Delayed publication', desc: 'Even where data is collected, national statistics agencies can take 2–4 years to publish, creating temporal gaps in any real-time platform.' },
          ].map(item => (
            <div key={item.title} style={{
              backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-main)',
              borderRadius: '6px', padding: '1rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--color-text-primary)' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
