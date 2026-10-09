import React from 'react';
import { ArrowRight, Battery, Recycle, Globe2 } from 'lucide-react';

export default function ExplainedView({ setActiveTab }) {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '2rem 0 1rem 0' }}>
        <div className="section-tag" style={{ textAlign: 'center', justifyContent: 'center' }}>
          Battery Waste · Public Mode
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.35rem', lineHeight: 1.15 }}>
          Battery Waste, Explained
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
          A simple guide to understanding the global battery waste challenge — no technical background needed.
        </p>
      </div>

      {/* 3 Big Numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          {
            icon: '🔋', number: '18.7 million tonnes',
            label: 'How much waste?',
            desc: 'of battery waste could be generated globally in 2025 — equivalent to roughly 18,700 Eiffel Towers in weight.'
          },
          {
            icon: '🌍', number: '57% uncollected',
            label: 'Where is it going?',
            desc: 'More than half of all end-of-life batteries are not reaching safe formal collection and recycling systems.'
          },
          {
            icon: '💎', number: '4.2 million tonnes',
            label: 'What can we recover?',
            desc: 'of valuable critical minerals — lithium, cobalt, nickel, copper — could be recovered each year if collection improves.'
          },
        ].map(card => (
          <div key={card.label} style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-main)',
            borderRadius: '8px', padding: '1.5rem', textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{card.icon}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-emerald-muted)', marginBottom: '0.35rem' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-forest-main)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
              {card.number}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Battery Journey Story */}
      <div className="card">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          What happens to a battery at end of life?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { step: 1, emoji: '🔋', title: 'Battery reaches end-of-life', desc: 'When a battery can no longer hold enough charge — in your EV, phone, or solar storage system — it becomes waste.' },
            { step: 2, emoji: '📦', title: 'Collection', desc: 'The battery needs to be safely collected — returned to a dealer, dropped at a collection point, or picked up by a reverse logistics service.' },
            { step: 3, emoji: '🔧', title: 'Sorting & Safety Testing', desc: 'Batteries are sorted by chemistry (lithium-ion, lead-acid, etc.), discharged safely, and assessed for second-life potential.' },
            { step: 4, emoji: '♻️', title: 'Recycling Process', desc: 'Batteries are shredded or disassembled. Pyrometallurgical (smelting) or hydrometallurgical (chemical dissolution) processes separate valuable materials.' },
            { step: 5, emoji: '💎', title: 'Material Recovery', desc: 'Lithium, cobalt, nickel, copper, and graphite are extracted, refined, and returned to battery manufacturers — closing the loop.' },
          ].map((step, i, arr) => (
            <div key={step.step}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                padding: '1rem', backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-main)', borderRadius: '6px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: 'var(--color-forest-main)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.15rem', flexShrink: 0
                }}>
                  {step.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{step.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ textAlign: 'center', padding: '0.3rem 0', color: 'var(--color-emerald-muted)', fontSize: '1.2rem' }}>↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* What can I do? */}
      <div className="card">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
          What can I do?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { emoji: '🗑️', title: 'Never put batteries in general waste', desc: 'Batteries in landfill can leach toxic chemicals into soil and water, and cause fires. Always use designated battery collection points.' },
            { emoji: '🏪', title: 'Find your local collection point', desc: 'Most electronics retailers, supermarkets, and recycling centres accept used batteries for free. Look for the "crossed-out wheelie bin" symbol on your battery packaging.' },
            { emoji: '📱', title: 'Choose long-lasting products', desc: 'Extend battery life through proper charging habits (avoid 0% and 100% extremes). Longer-lasting batteries mean less waste.' },
            { emoji: '🔄', title: 'Consider repair before replacement', desc: 'Battery replacement is often cheaper than buying a new device. Check if your device supports battery servicing.' },
            { emoji: '📢', title: 'Advocate for better policy', desc: 'Support mandatory take-back schemes, EPR legislation, and transparent battery recycling reporting in your country.' },
          ].map(item => (
            <div key={item.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
              padding: '0.85rem', backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: '6px', border: '1px solid var(--color-border-light)'
            }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to professional view */}
      <div style={{
        backgroundColor: 'var(--color-forest-main)', color: '#ffffff',
        borderRadius: '8px', padding: '1.5rem 2rem', textAlign: 'center'
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Want the full data?
        </h3>
        <p style={{ fontSize: '0.875rem', opacity: 0.85, marginBottom: '1rem' }}>
          Switch to the professional analytics view to explore country data, policy comparisons, and future scenarios.
        </p>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            backgroundColor: '#4ade80', color: '#0a2e23', border: 'none',
            padding: '0.65rem 1.5rem', borderRadius: '4px',
            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          Open Professional Dashboard <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
