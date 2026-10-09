import React from 'react';
import { Home, Map, Flag, Cpu, Sliders, Database } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'countries', label: 'Countries', icon: Flag },
    { id: 'materials', label: 'Materials', icon: Cpu },
    { id: 'scenarios', label: 'Scenarios', icon: Sliders },
    { id: 'data', label: 'Data', icon: Database }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
