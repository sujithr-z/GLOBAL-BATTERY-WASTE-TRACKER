import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../data/mockDatabase';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

function ConfidenceBadge({ level }) {
  const map = { High: 'badge-confidence-high', Medium: 'badge-confidence-medium', Low: 'badge-confidence-low' };
  return (
    <span className={`badge ${map[level] || 'badge-confidence-nodata'}`}>
      {level === 'High' && <CheckCircle2 size={9} />}
      {level === 'Medium' && <Clock size={9} />}
      {level === 'Low' && <AlertTriangle size={9} />}
      {level}
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

export default function CountriesView({ onOpenDrawer, onOpenDashboard }) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [sortKey, setSortKey] = useState('wasteGenerated');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedConfidence, setSelectedConfidence] = useState('All');

  const regions = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
  const confidenceLevels = ['All', 'High', 'Medium', 'Low'];

  const filtered = COUNTRIES_DATA
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.region.toLowerCase().includes(search.toLowerCase());
      const matchRegion = region === 'All' || c.region === region;
      const matchConf = selectedConfidence === 'All' || c.confidence === selectedConfidence;
      return matchSearch && matchRegion && matchConf;
    })
    .sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortHeader = ({ label, colKey }) => (
    <button
      onClick={() => handleSort(colKey)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontWeight: 700, fontSize: '0.7rem', color: sortKey === colKey ? 'var(--color-forest-main)' : 'var(--color-text-secondary)',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: '4px'
      }}
    >
      {label}
      <ArrowUpDown size={11} style={{ opacity: sortKey === colKey ? 1 : 0.4 }} />
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div>
        <div className="section-tag">Countries</div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
          Country Profiles
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Compare battery waste, collection rates, recycling capacity and policy coverage across 193 nations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-row">
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.35rem', paddingBottom: '0.35rem',
              border: '1px solid var(--color-border-main)', borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem', outline: 'none', backgroundColor: 'var(--color-bg-subtle)'
            }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Region:</span>
          <select className="filter-select" value={region} onChange={e => setRegion(e.target.value)}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Confidence:</span>
          <select className="filter-select" value={selectedConfidence} onChange={e => setSelectedConfidence(e.target.value)}>
            {confidenceLevels.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
          {filtered.length} of {COUNTRIES_DATA.length} countries shown
        </div>
      </div>

      {/* Countries Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '180px' }}>
                <SortHeader label="Country" colKey="name" />
              </th>
              <th><SortHeader label="Region" colKey="region" /></th>
              <th><SortHeader label="Waste Generated (Mt)" colKey="wasteGenerated" /></th>
              <th><SortHeader label="Per Capita (kg)" colKey="perCapita" /></th>
              <th><SortHeader label="Collection %" colKey="collectionRate" /></th>
              <th><SortHeader label="Recycling %" colKey="recyclingRate" /></th>
              <th><SortHeader label="Informal %" colKey="informalShare" /></th>
              <th><SortHeader label="EPR Status" colKey="eprStatus" /></th>
              <th>Confidence</th>
              <th style={{ width: '80px' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(country => (
              <tr key={country.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{country.flag}</span>
                    <span style={{ fontWeight: 700 }}>{country.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{country.region}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {country.wasteGenerated.toFixed(2)}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{country.perCapita.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      width: '50px', height: '6px', backgroundColor: 'var(--color-border-main)',
                      borderRadius: '3px', overflow: 'hidden', flexShrink: 0
                    }}>
                      <div style={{
                        width: `${country.collectionRate}%`, height: '100%',
                        backgroundColor: country.collectionRate >= 60 ? '#15803d' : country.collectionRate >= 40 ? '#d97706' : '#dc2626',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{country.collectionRate}%</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{country.recyclingRate}%</td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                    color: country.informalShare > 50 ? '#dc2626' : country.informalShare > 20 ? '#d97706' : 'var(--color-text-secondary)'
                  }}>
                    {country.informalShare}%
                  </span>
                </td>
                <td><PolicyStatusBadge status={country.eprStatus} /></td>
                <td><ConfidenceBadge level={country.confidence} /></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => onOpenDrawer(country.id)}
                      className="btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                      title="Quick view"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onOpenDashboard(country.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-emerald-muted)', padding: '0.25rem'
                      }}
                      title="Open full dashboard"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note on data coverage */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-subtle)',
        border: '1px solid var(--color-border-main)', borderRadius: '6px',
        fontSize: '0.8125rem', color: 'var(--color-text-muted)'
      }}>
        <AlertTriangle size={14} style={{ flexShrink: 0, color: 'var(--color-amber-icon)', marginTop: '1px' }} />
        <span>
          This table shows {COUNTRIES_DATA.length} detailed country profiles. Full 193-country coverage includes modeled estimates with lower confidence levels.
          Absence of data should never be interpreted as zero waste.
        </span>
      </div>
    </div>
  );
}
