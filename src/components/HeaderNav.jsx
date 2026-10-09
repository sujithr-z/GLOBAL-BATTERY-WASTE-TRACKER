import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Download, 
  Info, 
  ShieldCheck, 
  FileText, 
  ChevronDown,
  BookOpen
} from 'lucide-react';

export default function HeaderNav({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenDownload, 
  onOpenMethodology, 
  language, 
  setLanguage 
}) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'map',       label: 'Global Map' },
    { id: 'countries', label: 'Countries' },
    { id: 'eurostat',  label: '🇪🇺 EU Data', badge: 'REAL' },
    { id: 'materials', label: 'Materials' },
    { id: 'policy',    label: 'Policy' },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'data',      label: 'Data' },
    { id: 'explained', label: 'Explained' },
    { id: 'gaps',      label: 'Data Gaps' }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'ZH', name: '中文' }
  ];

  return (
    <header className="global-header">
      <div className="nav-top-bar">
        {/* Brand Left */}
        <div 
          className="brand-title" 
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('overview')}
        >
          <Globe className="brand-icon" />
          <span>GLOBAL BATTERY WASTE TRACKER</span>
        </div>

        {/* Center Tabs */}
        <nav className="nav-center-tabs" aria-label="Main Navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ position: 'relative' }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-4px',
                  fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.04em',
                  backgroundColor: '#4ade80', color: '#0a2e23',
                  padding: '1px 4px', borderRadius: '3px', lineHeight: 1.5
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="nav-right-actions">
          <button 
            className="btn-nav-action" 
            onClick={onOpenSearch}
            title="Search dataset"
          >
            <Search size={14} />
            <span style={{ display: 'none', mdDisplay: 'inline' }}>Search</span>
          </button>

          <button 
            className="btn-nav-action" 
            onClick={onOpenDownload}
            title="Download data"
          >
            <Download size={14} />
            <span>Download</span>
          </button>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-nav-action"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              <span>{language}</span>
              <ChevronDown size={12} />
            </button>

            {langDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.25rem',
                  backgroundColor: '#0d3b2e',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 200,
                  minWidth: '100px'
                }}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem 0.75rem',
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      cursor: 'pointer'
                    }}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="btn-nav-action" 
            onClick={onOpenMethodology}
            title="About and methodology"
          >
            <BookOpen size={14} />
            <span>About / Methodology</span>
          </button>
        </div>
      </div>

      <div className="status-sub-bar">
        <div className="status-sub-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status-dot"></span>
            <span style={{ fontWeight: 600 }}>EU Data: Eurostat env_waspb · 2009–2023</span>
            <span style={{ opacity: 0.6, marginLeft: '0.5rem' }}>| Institutional Observatory v2026.2 · Extracted 09 Oct 2026</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onOpenMethodology}
            >
              Open Data License (CC BY 4.0)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
