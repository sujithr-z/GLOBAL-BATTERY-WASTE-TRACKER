import React, { useState } from 'react';
import './index.css';

// Navigation
import HeaderNav from './components/HeaderNav';
import MobileNav from './components/MobileNav';

// Page Views
import OverviewView from './components/OverviewView';
import GlobalMapView from './components/GlobalMapView';
import CountriesView from './components/CountriesView';
import CountryDashboard from './components/CountryDashboard';
import MaterialsView from './components/MaterialsView';
import PolicyView from './components/PolicyView';
import ScenariosView from './components/ScenariosView';
import DataView from './components/DataView';
import DataGapsView from './components/DataGapsView';
import ExplainedView from './components/ExplainedView';
import EurostatView from './components/EurostatView';

// Overlays
import CountryDrawer from './components/CountryDrawer';
import ProvenanceModal from './components/ProvenanceModal';
import MethodologyModal from './components/MethodologyModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [language, setLanguage] = useState('EN');

  // Country drawer state
  const [drawerCountryId, setDrawerCountryId] = useState(null);

  // Country dashboard state  
  const [dashboardCountryId, setDashboardCountryId] = useState(null);

  // Modals
  const [provenance, setProvenance] = useState(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenDrawer = (countryId) => {
    setDrawerCountryId(countryId);
  };

  const handleOpenDashboard = (countryId) => {
    setDashboardCountryId(countryId);
    setDrawerCountryId(null);
    setActiveTab('countries'); // ensure we're on countries tab
  };

  const handleBackFromDashboard = () => {
    setDashboardCountryId(null);
  };

  const handleSelectProvenance = (title, data) => {
    setProvenance({ title, data });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setDashboardCountryId(null); // reset dashboard when switching tabs
  };

  // Determine main content to render
  const renderContent = () => {
    // If a country dashboard is open (only shows on countries tab context)
    if (dashboardCountryId && activeTab === 'countries') {
      return (
        <CountryDashboard
          countryId={dashboardCountryId}
          onBack={handleBackFromDashboard}
        />
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            setActiveTab={handleTabChange}
            onSelectProvenance={handleSelectProvenance}
            onOpenMethodology={() => setMethodologyOpen(true)}
            onOpenCountryDrawer={handleOpenDrawer}
          />
        );
      case 'map':
        return (
          <GlobalMapView
            onOpenDrawer={handleOpenDrawer}
          />
        );
      case 'countries':
        return (
          <CountriesView
            onOpenDrawer={handleOpenDrawer}
            onOpenDashboard={handleOpenDashboard}
          />
        );
      case 'materials':
        return <MaterialsView />;
      case 'policy':
        return <PolicyView onOpenDrawer={handleOpenDrawer} />;
      case 'scenarios':
        return <ScenariosView />;
      case 'data':
        return <DataView />;
      case 'gaps':
        return <DataGapsView />;
      case 'explained':
        return <ExplainedView setActiveTab={handleTabChange} />;
      case 'eurostat':
        return <EurostatView onOpenDrawer={handleOpenDrawer} />;
      default:
        return (
          <OverviewView
            setActiveTab={handleTabChange}
            onSelectProvenance={handleSelectProvenance}
            onOpenMethodology={() => setMethodologyOpen(true)}
            onOpenCountryDrawer={handleOpenDrawer}
          />
        );
    }
  };

  return (
    <div className="app-container">

      {/* Fixed Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenDownload={() => handleTabChange('data')}
        onOpenMethodology={() => setMethodologyOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Scrollable Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Country Drawer Overlay */}
      {drawerCountryId && (
        <CountryDrawer
          countryId={drawerCountryId}
          onClose={() => setDrawerCountryId(null)}
          onOpenDashboard={handleOpenDashboard}
        />
      )}

      {/* Data Provenance Modal */}
      {provenance && (
        <ProvenanceModal
          provenance={provenance}
          onClose={() => setProvenance(null)}
        />
      )}

      {/* Methodology Modal */}
      {methodologyOpen && (
        <MethodologyModal
          onClose={() => setMethodologyOpen(false)}
        />
      )}

      {/* Simple Search Modal (navigates to data view) */}
      {searchOpen && (
        <div className="modal-overlay" onClick={() => setSearchOpen(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '560px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ fontWeight: 700 }}>Search the Dataset</div>
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Use the Data Explorer for full search, filtering, and AI-powered queries.
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { handleTabChange('data'); setSearchOpen(false); }}
              >
                Open Data Explorer →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer style={{
        backgroundColor: 'var(--color-forest-dark)',
        color: 'rgba(255,255,255,0.65)',
        padding: '1rem 1.5rem',
        fontSize: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <span style={{ fontWeight: 700, color: '#ffffff' }}>GLOBAL BATTERY WASTE TRACKER</span>
          {' '}· Environmental Intelligence Platform · v2026.2
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setMethodologyOpen(true)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            Methodology
          </button>
          <button
            onClick={() => handleTabChange('data')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            Open Data (CC BY 4.0)
          </button>
          <span>Data: 09 Oct 2026</span>
        </div>
      </footer>
    </div>
  );
}
