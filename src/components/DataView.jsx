import React, { useState } from 'react';
import { COUNTRIES_DATA, AI_SAMPLE_QUERIES } from '../data/mockDatabase';
import { Search, Download, Copy, Filter, Info, AlertTriangle } from 'lucide-react';

const TABLE_DATA = COUNTRIES_DATA.map(c => ({
  country: c.name,
  flag: c.flag,
  year: 2025,
  batteryType: 'All chemistries',
  wasteGenerated: c.wasteGenerated,
  collectionRate: c.collectionRate,
  recyclingRate: c.recyclingRate,
  materialRecovered: c.criticalRecovery,
  confidence: c.confidence,
  source: c.source.split(' & ')[0]
}));

export default function DataView() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [filters, setFilters] = useState({
    region: 'All',
    confidence: 'All',
    year: 'All',
    chemistry: 'All'
  });
  const [sortKey, setSortKey] = useState('wasteGenerated');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = TABLE_DATA
    .filter(d => !search || d.country.toLowerCase().includes(search.toLowerCase()))
    .filter(d => filters.confidence === 'All' || d.confidence === filters.confidence)
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const handleAiQuery = (q) => {
    const match = AI_SAMPLE_QUERIES.find(s => s.query === q);
    if (match) {
      setIsAiLoading(true);
      setTimeout(() => {
        setActiveQuery(match);
        setIsAiLoading(false);
      }, 800);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleCopyCSV = () => {
    const headers = 'Country,Year,Type,Waste (Mt),Collection (%),Recycling (%),Material (kt),Confidence,Source';
    const rows = filtered.map(d =>
      `${d.country},${d.year},${d.batteryType},${d.wasteGenerated},${d.collectionRate},${d.recyclingRate},${d.materialRecovered},${d.confidence},${d.source}`
    );
    navigator.clipboard.writeText([headers, ...rows].join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <div className="section-tag">Data Explorer · Raw Dataset Access</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Data Explorer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Query, filter, sort, and download the underlying dataset. All values include source attribution.
        </p>
      </div>

      {/* AI Query Interface */}
      <div className="card" style={{ borderLeft: '4px solid var(--color-forest-accent)' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          Ask the data
        </h3>
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Which countries have the largest battery recycling gap?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAiQuery(query)}
            style={{
              width: '100%', paddingLeft: '2.25rem', paddingRight: '4.5rem',
              paddingTop: '0.6rem', paddingBottom: '0.6rem',
              border: '1px solid var(--color-border-main)', borderRadius: '4px',
              fontSize: '0.875rem', outline: 'none', backgroundColor: 'var(--color-bg-subtle)'
            }}
          />
          <button
            onClick={() => handleAiQuery(query)}
            className="btn-primary"
            style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            Query
          </button>
        </div>

        {/* Sample Queries */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>Try:</span>
          {AI_SAMPLE_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuery(q.query); handleAiQuery(q.query); }}
              style={{
                fontSize: '0.75rem', padding: '0.25rem 0.6rem',
                backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border-main)',
                borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text-secondary)',
                fontWeight: 500
              }}
            >
              {q.query}
            </button>
          ))}
        </div>

        {/* AI Response */}
        {isAiLoading && (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Analyzing dataset...
          </div>
        )}
        {activeQuery && !isAiLoading && (
          <div style={{
            backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-main)',
            borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-forest-main)' }}>
              "{activeQuery.query}"
            </div>
            {[
              { label: 'Observed Data', content: activeQuery.response.observedData, color: '#15803d', bg: '#f0fdf4' },
              { label: 'Modeled Estimate', content: activeQuery.response.modeledEstimate, color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'AI Interpretation', content: activeQuery.response.aiInterpretation, color: '#92400e', bg: '#fffbeb' },
            ].map(section => (
              <div key={section.label} style={{
                backgroundColor: section.bg, borderRadius: '4px', padding: '0.75rem',
                borderLeft: `3px solid ${section.color}`
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: section.color, marginBottom: '0.35rem' }}>
                  {section.label}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                  {section.content}
                </div>
              </div>
            ))}
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.5rem' }}>
              AI-generated insights clearly distinguish Observed Data, Modeled Estimates, and AI Interpretations. This is not a black box.
            </div>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="filter-row">
        <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '280px' }}>
          <Search size={13} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Filter countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '1.9rem', paddingRight: '0.75rem',
              paddingTop: '0.35rem', paddingBottom: '0.35rem',
              border: '1px solid var(--color-border-main)', borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem', outline: 'none', backgroundColor: 'var(--color-bg-subtle)'
            }}
          />
        </div>
        <div className="filter-group">
          <span className="filter-label">Confidence:</span>
          <select className="filter-select" value={filters.confidence} onChange={e => setFilters(f => ({ ...f, confidence: e.target.value }))}>
            {['All', 'High', 'Medium', 'Low'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={handleCopyCSV} style={{ fontSize: '0.8rem' }}>
            <Copy size={13} />
            {copied ? 'Copied!' : 'Copy CSV'}
          </button>
          <button className="btn-primary" style={{ fontSize: '0.8rem' }}>
            <Download size={13} />
            Download JSON
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {[
                { label: 'Country', key: 'country' },
                { label: 'Year', key: 'year' },
                { label: 'Battery Type', key: 'batteryType' },
                { label: 'Waste (Mt)', key: 'wasteGenerated' },
                { label: 'Collection %', key: 'collectionRate' },
                { label: 'Recycling %', key: 'recyclingRate' },
                { label: 'Material (kt)', key: 'materialRecovered' },
                { label: 'Confidence', key: 'confidence' },
                { label: 'Source', key: 'source' },
              ].map(col => (
                <th key={col.key}>
                  <button
                    onClick={() => handleSort(col.key)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: '0.7rem', color: sortKey === col.key ? 'var(--color-forest-main)' : 'var(--color-text-secondary)',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}
                  >
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>
                  <span style={{ fontSize: '1rem', marginRight: '0.4rem' }}>{row.flag}</span>
                  <strong>{row.country}</strong>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{row.year}</td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{row.batteryType}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.wasteGenerated.toFixed(2)}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{row.collectionRate}%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{row.recyclingRate}%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{row.materialRecovered.toLocaleString()}</td>
                <td>
                  <span className={`badge ${row.confidence === 'High' ? 'badge-confidence-high' : row.confidence === 'Medium' ? 'badge-confidence-medium' : 'badge-confidence-low'}`}>
                    {row.confidence}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '180px' }}>
                  {row.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Provenance Note */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        padding: '0.75rem 1rem', backgroundColor: 'var(--color-amber-bg)',
        border: '1px solid var(--color-amber-border)', borderRadius: '6px',
        fontSize: '0.8125rem', color: 'var(--color-amber-text)'
      }}>
        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          All values are from the demonstration dataset. Cite as: "Global Battery Waste Tracker — Illustrative Dataset v2026.2, GBWT Observatory, 09 Oct 2026."
          License: CC BY 4.0 — open data for research and policy use.
        </span>
      </div>
    </div>
  );
}
