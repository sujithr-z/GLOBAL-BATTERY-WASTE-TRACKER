import React, { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';

export default function ProvenanceModal({ provenance, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!provenance) return null;

  const { title, data } = provenance;

  const citation = `Global Battery Waste Tracker — "${title}" indicator: ${data.value} ${data.unit || ''}. Year: 2026. Source: ${data.source}. Retrieved: 09 Oct 2026. License: CC BY 4.0. URL: https://gbwt.org/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
              Data Provenance
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>{title}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Key metadata grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Value', value: `${data.value} ${data.unit || ''}` },
              { label: 'Year', value: '2026' },
              { label: 'Confidence', value: data.confidence },
              { label: 'Last Updated', value: '09 Oct 2026' },
            ].map(row => (
              <div key={row.label} style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '4px'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>{row.label}</div>
                <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* Source */}
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '4px', border: '1px solid var(--color-border-main)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>Source</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{data.source}</div>
          </div>

          {/* Narrative */}
          {data.narrative && (
            <div style={{ padding: '0.75rem', backgroundColor: '#f0f9f5', borderRadius: '4px', border: '1px solid var(--color-emerald-border)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-emerald-muted)', marginBottom: '0.3rem' }}>Interpretation</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{data.narrative}</div>
            </div>
          )}

          {/* Confidence explanation */}
          <div style={{
            padding: '0.75rem',
            backgroundColor: data.confidence === 'High' ? '#f0fdf4' : data.confidence === 'Medium' ? '#fffbeb' : '#fef2f2',
            borderRadius: '4px',
            border: `1px solid ${data.confidence === 'High' ? '#bbf7d0' : data.confidence === 'Medium' ? '#fde68a' : '#fecaca'}`
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>Confidence Level: {data.confidence}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {data.confidence === 'High' && 'Value is derived from official government statistics or mandatory producer reporting with audit trail.'}
              {data.confidence === 'Medium' && 'Value combines partial official reporting with modeled estimates. Use with appropriate caution in decision-making.'}
              {data.confidence === 'Low' && 'Value is a modeled proxy estimate only. Official data not available. Do not use as sole basis for policy decisions.'}
            </div>
          </div>

          {/* Citation */}
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '4px', border: '1px solid var(--color-border-main)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
              Suggested Citation
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'var(--color-text-secondary)', lineHeight: 1.5,
              padding: '0.5rem', backgroundColor: '#ffffff',
              border: '1px solid var(--color-border-light)', borderRadius: '3px'
            }}>
              {citation}
            </div>
            <button
              onClick={handleCopy}
              className="btn-secondary"
              style={{ marginTop: '0.5rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
            >
              {copied ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy Citation</>}
            </button>
          </div>

          {/* License */}
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            License: Creative Commons Attribution 4.0 International (CC BY 4.0) ·
            Free to use for research, policy, journalism with attribution.
          </div>
        </div>
      </div>
    </div>
  );
}
