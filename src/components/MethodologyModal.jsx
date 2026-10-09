import React from 'react';
import { X, BookOpen, Database, FileText, Scale } from 'lucide-react';

export default function MethodologyModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={18} style={{ color: 'var(--color-forest-main)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>About & Methodology</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Data sources, methods, and uncertainty</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>

          {/* About the platform */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={15} /> About this platform
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              The Global Battery Waste Tracker is an institutional-grade environmental intelligence platform for policymakers, regulators, manufacturers, researchers, and investors.
              It aggregates national battery waste statistics, producer responsibility registry data, and modeled estimates into a single comparable dataset.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>
              This demonstration dataset is provided for educational and system development purposes only. Values are illustrative and should not be used for regulatory enforcement or investment decisions without verification against primary sources.
            </p>
          </div>

          {/* Data collection */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={15} /> Data collection methods
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {[
                { level: 'Primary', desc: 'National environmental agencies (e.g. Germany UBA, India CPCB, US EPA), mandatory producer responsibility organization (PRO) filings, UN Comtrade import/export statistics.' },
                { level: 'Secondary', desc: 'UNEP/UNITAR E-waste Observatory modeled estimates, IEA Global EV Outlook battery volumes, World Bank economic proxy indicators.' },
                { level: 'Modeled infill', desc: 'Mass-balance estimation methodology: Battery waste = [Battery sales - [Batteries in use] - [Exports]] × Chemistry-specific lifetime factors.' },
              ].map(row => (
                <div key={row.level} style={{
                  display: 'flex', gap: '0.75rem', padding: '0.65rem',
                  backgroundColor: 'var(--color-bg-subtle)', borderRadius: '4px',
                  border: '1px solid var(--color-border-light)'
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-forest-main)', flexShrink: 0, width: '90px' }}>
                    {row.level}
                  </span>
                  <span style={{ lineHeight: 1.5 }}>{row.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Uncertainty */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Uncertainty quantification</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Confidence levels (High / Medium / Low) reflect data pedigree:
            </p>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
              <li><strong>High:</strong> Official national statistics with audited producer reporting (±5–10% uncertainty)</li>
              <li><strong>Medium:</strong> Partial official data + modeled infill (±20–35% uncertainty)</li>
              <li><strong>Low:</strong> Proxy/import balance estimates only (±50% or greater uncertainty)</li>
            </ul>
          </div>

          {/* Model assumptions */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Scenario model assumptions</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              <p>Battery market growth: +8.5%/yr (IEA 2025 Global Battery Alliance). Chemistry split: Li-ion 30%, Lead-acid 60%, Other 10%.</p>
              <p style={{ marginTop: '0.4rem' }}>GHG abatement factor: 2.1 tCO₂e per tonne recycled vs primary production (UNEP LCA Reference Database 2024).</p>
              <p style={{ marginTop: '0.4rem' }}>Secondary material value: $1.45B per Mt recycled (market-weighted average 2025 spot prices for Li, Co, Ni, Cu).</p>
            </div>
          </div>

          {/* Data gaps */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Known data gaps</h3>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li>Informal sector dismantling volumes are systematically underestimated globally</li>
              <li>Second-life battery reuse flows are not tracked in most national systems</li>
              <li>Cross-border battery exports to lower-income countries for refurbishment/informal processing are partially captured by UN Comtrade, but re-processing volumes are untracked</li>
              <li>Many Sub-Saharan African, Pacific Island, and South/Southeast Asian nations have no official national battery waste registry</li>
            </ul>
          </div>

          {/* Revision history */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Revision history</h3>
            <div className="table-container">
              <table className="data-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Date</th>
                    <th>Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { v: 'v2026.2', date: '09 Oct 2026', change: 'Updated 2025 baseline figures, added 3 new country profiles, revised informal sector estimates.' },
                    { v: 'v2026.1', date: '01 Jul 2026', change: 'Added EU Battery Regulation compliance status, updated China MIIT data.' },
                    { v: 'v2025.3', date: '15 Jan 2026', change: 'Revised India CPCB collection rate estimates, added Nigeria NESREA data.' },
                  ].map(row => (
                    <tr key={row.v}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.v}</td>
                      <td>{row.date}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>{row.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* License */}
          <div style={{
            padding: '0.75rem', backgroundColor: '#f0f9f5',
            border: '1px solid var(--color-emerald-border)',
            borderRadius: '4px', display: 'flex', alignItems: 'flex-start', gap: '0.6rem'
          }}>
            <Scale size={16} style={{ color: 'var(--color-forest-main)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <strong>Open Data License: CC BY 4.0</strong><br />
              Data is freely available for use in research, policy, journalism, and education with attribution to the Global Battery Waste Tracker Observatory.
              Commercial use permitted with citation. See full license at creativecommons.org/licenses/by/4.0
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
