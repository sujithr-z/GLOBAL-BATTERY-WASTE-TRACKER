# 🌍 Global Battery Waste Tracker

> **An institutional-grade environmental intelligence and decision-support platform for policymakers, regulators, manufacturers, researchers, NGOs, investors, and journalists.**

[![License: CC BY 4.0](https://img.shields.io/badge/Data%20License-CC%20BY%204.0-green.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Data: Eurostat](https://img.shields.io/badge/Real%20Data-Eurostat%20env__waspb-blue.svg)](https://ec.europa.eu/eurostat/databrowser/product/page/ENV_WASPB)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite%208-646CFF.svg)](https://vitejs.dev/)
[![MapLibre GL JS](https://img.shields.io/badge/Map-MapLibre%20GL%20JS-396CB2.svg)](https://maplibre.org/)

---

## Overview

The **Global Battery Waste Tracker** is a high-fidelity, data-driven web platform tracking battery waste generation, collection rates, recycling capacity, critical material recovery, and policy coverage across countries worldwide.

The central design principle is:

**DATA → CONTEXT → INSIGHT → ACTION**

Every statistic communicates: *what the number is · what year · where it came from · how confident we are · why it matters.*

This is **not a marketing site**. It is built to the usability and transparency standards of institutional environmental dashboards (UNEP, Eurostat, Global E-waste Monitor).

---

## ✨ Features

### Pages & Views

| Tab | Description |
|-----|-------------|
| **Overview** | KPI strip, regional distribution chart, EU27 collection trends, global insight cards |
| **Global Map** | Real interactive MapLibre choropleth — switch metrics, hover for tooltips, click for country detail |
| **Countries** | Searchable, sortable table of country profiles with collection progress bars and policy scorecard |
| **🇪🇺 EU Data** | **Real Eurostat data** — official battery market volumes (2009–2023) per EU/EEA country with trend charts, YoY indicators, per-capita analysis |
| **Materials** | Critical material (Li, Co, Ni, Cu) recovery projections, Sankey flow diagram |
| **Policy** | EPR legislation status, collection targets, battery passport and producer responsibility comparison across countries |
| **Scenarios** | Interactive outlook tool — adjust collection rate, recycling efficiency, second-life utilisation via sliders and compare against Business-as-Usual |
| **Data** | Full data explorer with AI-style natural-language queries, sortable table, CSV copy, source attribution |
| **Explained** | Public/simple mode — battery lifecycle story, recycling guidance, 3 key numbers |
| **Data Gaps** | Transparency layer — confidence coverage map, countries with no data, explanation of why gaps persist |

### Overlays & Modals

- **Country Drawer** — side panel with time-series chart, narrative context, policy scorecard, and links to full dashboard
- **Country Dashboard** — full-page deep-dive for any country with waste flow breakdown, material recovery bars, policy timeline
- **Data Provenance Modal** — click any number to see source, confidence level, methodology, and copy-ready citation
- **Methodology Modal** — complete data collection methods, uncertainty tiers, model assumptions, revision history, open data license

---

## 🗄️ Real Data

### Eurostat `env_waspb` Dataset

The `🇪🇺 EU Data` tab and **Global Map** (EU Market Volume metric) are powered by **official Eurostat data**:

| Field | Value |
|-------|-------|
| Dataset | `env_waspb__custom_4715687` |
| Title | Sales and collection of portable batteries and accumulators |
| Source | Eurostat |
| Coverage | EU-27 + Norway, Iceland, Liechtenstein, United Kingdom |
| Years | 2009–2023 |
| Unit | Tonnes |
| Metric | Products put on market (proxy for collection denominator) |
| Last updated | 27 November 2025 |
| Extracted | 09 October 2026 |
| License | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

**Key real figures (2023):**
- 🇩🇪 Germany: **55,197 t** (YoY −12.6%)
- 🇫🇷 France: **36,412 t** (YoY +0.4%)
- 🇮🇹 Italy: **27,985 t** (YoY −12.0%)
- 🇵🇱 Poland: **21,524 t** (YoY −1.5%)
- 🇪🇺 EU27 total: **230,637 t** (down from 2021 peak of 244,899 t)

To regenerate the data module from the source Excel file:
```bash
node parse_eurostat.cjs
```

---

## 🗺️ Interactive Map

The Global Map is built with **MapLibre GL JS v6** using **OpenFreeMap Liberty** tiles (free, open, no API key required).

Available choropleth metrics:
- **Collection rate** — % of batteries formally collected at end-of-life
- **Waste generated** — total battery waste in megatonnes
- **Recycling rate** — % of collected batteries formally recycled
- **Informal-sector share** — estimated % processed outside formal systems
- **Data confidence** — High / Medium / Low by country
- **🇪🇺 EU Market Volume (REAL)** — actual Eurostat tonnes on market, EU/EEA only

---

## 🏗️ Architecture

```
src/
├── App.jsx                    # Root: routing, global state, all modals
├── index.css                  # Design system — CSS variables, tokens, components
│
├── data/
│   ├── mockDatabase.js        # Illustrative dataset — 193 countries, materials, AI queries
│   └── eurostatData.js        # AUTO-GENERATED — real Eurostat env_waspb data (2009–2023)
│
└── components/
    ├── HeaderNav.jsx           # Persistent top nav, tabs, status bar
    ├── MobileNav.jsx           # Fixed bottom nav (mobile)
    ├── OverviewView.jsx        # Home dashboard — KPIs, charts, action cards
    ├── GlobalMapView.jsx       # MapLibre GL JS choropleth world map
    ├── CountriesView.jsx       # Searchable/sortable country table
    ├── EurostatView.jsx        # Real Eurostat data dashboard ← NEW
    ├── CountryDrawer.jsx       # Side panel — quick country detail
    ├── CountryDashboard.jsx    # Full country deep-dive page
    ├── MaterialsView.jsx       # Critical materials recovery analysis
    ├── PolicyView.jsx          # EPR & policy comparison table
    ├── ScenariosView.jsx       # Interactive scenario/outlook tool
    ├── DataView.jsx            # Data explorer + AI query interface
    ├── DataGapsView.jsx        # Transparency — data gaps & confidence
    ├── ExplainedView.jsx       # Public/simple educational mode
    ├── ProvenanceModal.jsx     # Per-number source/citation modal
    └── MethodologyModal.jsx    # Full methodology & revision history
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Mapping | MapLibre GL JS 6 + OpenFreeMap Liberty tiles |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Data parsing | xlsx (SheetJS) |
| Styling | Vanilla CSS with custom design system (CSS variables) |
| Linting | Oxlint |
| Data license | CC BY 4.0 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

### Regenerate Eurostat Data

If you have a new version of the Excel file, place it in `data/` and run:

```bash
node parse_eurostat.cjs
# Outputs: src/data/eurostatData.js
```

---

## 📐 Design System

The platform uses a purpose-built institutional design language:

**Palette:**
- Deep forest green `#0d3b2e` — primary brand
- Muted emerald `#1b6b53` — interactive elements
- Off-white `#f4f6f0` — page background
- Charcoal `#1c2b27` — primary text
- Slate gray `#4a5e57` — secondary text
- Amber `#d97706` — warnings / medium confidence
- Red `#dc2626` — alerts / low confidence / critical gaps

**Typography:** Inter (Google Fonts) · JetBrains Mono for data values

**Accessibility:** WCAG 2.1 AA — focus states, semantic HTML, ARIA labels

---

## 📊 Data Transparency

This platform distinguishes three data tiers everywhere:

| Tier | Label | Description |
|------|-------|-------------|
| **Observed** | `High` confidence badge | Official national statistics, mandatory producer reporting, Eurostat |
| **Modeled** | `Medium` confidence badge | Partial official data + modeled infill (±20–35% uncertainty) |
| **Estimated** | `Low` confidence badge | Proxy / import-balance estimates only (±50%+ uncertainty) |

> **Data absence ≠ zero waste.** Countries with no data still generate battery waste — it is simply not systematically measured.

---

## 📁 Source Data

| File | Description |
|------|-------------|
| `data/env_waspb__custom_4715687_spreadsheet.xlsx` | Official Eurostat download — EU portable battery market data |
| `src/data/eurostatData.js` | Parsed & structured version (auto-generated, do not edit manually) |
| `src/data/mockDatabase.js` | Illustrative global dataset for non-EU countries and all modeled views |
| `parse_eurostat.cjs` | Node.js parser script — converts Excel → JS module |

---

## 📜 License & Citation

**Data:** Open Data — Creative Commons Attribution 4.0 International (CC BY 4.0)

**Suggested citation:**
```
Global Battery Waste Tracker — Environmental Intelligence Platform, v2026.2.
GBWT Observatory, 09 October 2026.
EU data source: Eurostat env_waspb (env_waspb__custom_4715687), last updated 27 Nov 2025.
License: CC BY 4.0.
```

---

*Built with ❤️ for open environmental data.*
