// Institutional Dataset for Global Battery Waste Tracker
// Inspired by UNEP/UNITAR Global E-waste Monitor & World Economic Forum Circular Battery Alliance benchmarks

export const GLOBAL_SUMMARY = {
  dataUpdated: "09 Oct 2026",
  version: "v2026.2-RELEASE",
  referenceYear: 2025,
  kpis: {
    wasteGenerated: {
      value: "18.7",
      unit: "Mt",
      change: "+6.2%",
      direction: "up",
      period: "vs 2025",
      target: "14.0 Mt by 2030",
      confidence: "Medium",
      source: "UNEP/UNITAR E-waste Observatory (2026 model)",
      sparkline: [12.4, 13.8, 15.2, 16.5, 17.6, 18.7],
      narrative: "Annual end-of-life battery volume requiring safe management is expanding rapidly driven by EV fleet retirements."
    },
    formalCollection: {
      value: "42.8%",
      unit: "collected",
      change: "+3.8%",
      direction: "up",
      period: "vs 2025",
      target: "65.0% by 2030",
      confidence: "High",
      source: "Official country reporting & producer responsibility organisations",
      sparkline: [31.2, 34.0, 36.5, 39.0, 41.2, 42.8],
      narrative: "Recorded formal collection is a prerequisite for safe recycling, but 57.2% remains uncollected or in informal channels."
    },
    materialRecovery: {
      value: "4.2",
      unit: "Mt",
      change: "+12.1%",
      direction: "up",
      period: "vs 2025",
      target: "8.5 Mt potential",
      confidence: "Medium",
      source: "Global Secondary Material Yield Model",
      sparkline: [2.1, 2.6, 3.1, 3.5, 3.8, 4.2],
      narrative: "Key critical minerals (Lithium, Nickel, Cobalt, Copper) potentially recoverable if full closed-loop recycling is achieved."
    },
    countriesTracked: {
      value: "193",
      unit: "nations",
      change: "0",
      direction: "neutral",
      period: "100% UN membership",
      target: "Universal coverage",
      confidence: "High",
      source: "UN Statistics Division",
      sparkline: [193, 193, 193, 193, 193, 193],
      narrative: "Includes 48 countries with mandatory national battery reporting systems."
    },
    policyCoverage: {
      value: "68%",
      unit: "global pop.",
      change: "+5%",
      direction: "up",
      period: "vs 2024",
      target: "85% by 2030",
      confidence: "High",
      source: "Global Battery Policy Monitor",
      sparkline: [45, 52, 58, 62, 65, 68],
      narrative: "Population residing in jurisdictions with active Extended Producer Responsibility (EPR) or battery directives."
    },
    undocumentedPathways: {
      value: "7.8",
      unit: "Mt",
      change: "+4.1%",
      direction: "up",
      period: "vs 2025",
      target: "< 2.0 Mt by 2030",
      confidence: "Low",
      source: "Mass-balance residual estimation",
      sparkline: [6.1, 6.5, 6.9, 7.2, 7.5, 7.8],
      narrative: "Estimated volume lost to informal scrap trading, municipal solid waste, unrecorded exports, or stockpiling."
    }
  },

  regionalDistribution: [
    { name: "Asia", wasteMt: 6.00, percentage: 50, color: "#114b3e" },
    { name: "Europe", wasteMt: 2.40, percentage: 20, color: "#1b6b53" },
    { name: "Americas", wasteMt: 2.40, percentage: 20, color: "#2563eb" },
    { name: "Africa", wasteMt: 0.84, percentage: 7, color: "#d97706" },
    { name: "Oceania", wasteMt: 0.36, percentage: 3, color: "#64748b" }
  ],

  chemistries: [
    {
      name: "Lead-acid",
      share: 60,
      generatedMt: 7.20,
      collectedMt: 3.24,
      collectionRate: 45.0,
      recoveryFocus: "Lead · closed-loop recovery",
      color: "#114b3e",
      notes: "Established infrastructure, high intrinsic commercial scrap value."
    },
    {
      name: "Lithium-ion",
      share: 30,
      generatedMt: 3.60,
      collectedMt: 0.84,
      collectionRate: 23.3,
      recoveryFocus: "Lithium, nickel & cobalt",
      color: "#2563eb",
      notes: "Rapid growth due to EV uptake; 2.76 Mt outside documented collection."
    },
    {
      name: "Other chemistries",
      share: 10,
      generatedMt: 1.20,
      collectedMt: 0.12,
      collectionRate: 10.0,
      recoveryFocus: "Chemistry-specific treatment (NiMH, NiCd, Primary Alkaline)",
      color: "#d97706",
      notes: "Includes portable primary batteries and legacy industrial cells."
    }
  ],

  generationTrend: [
    { year: 2020, generated: 10.0, collected: 3.0, undocumented: 7.0, rate: 30 },
    { year: 2021, generated: 11.2, collected: 3.4, undocumented: 7.8, rate: 30.3 },
    { year: 2022, generated: 12.8, collected: 4.1, undocumented: 8.7, rate: 32 },
    { year: 2023, generated: 14.5, collected: 4.9, undocumented: 9.6, rate: 33.8 },
    { year: 2024, generated: 16.4, collected: 5.8, undocumented: 10.6, rate: 35.3 },
    { year: 2025, generated: 18.7, collected: 8.0, undocumented: 10.7, rate: 42.8 },
    { year: 2026, generated: 21.0, collected: 9.8, undocumented: 11.2, rate: 46.6 },
    { year: 2028, generated: 26.5, collected: 14.0, undocumented: 12.5, rate: 52.8 },
    { year: 2030, generated: 34.0, collected: 21.5, undocumented: 12.5, rate: 63.2 }
  ]
};

export const COUNTRIES_DATA = [
  {
    id: "IND",
    iso2: "IN",
    name: "India",
    region: "Asia",
    flag: "🇮🇳",
    population: "1.42B",
    wasteGenerated: 1.84, // Mt
    perCapita: 1.30, // kg
    collectionRate: 38.0, // %
    recyclingRate: 31.0, // %
    informalShare: 52.0, // %
    criticalRecovery: 185, // kt
    eprStatus: "Active",
    confidence: "Medium",
    confidenceDetails: "Battery Waste Management Rules (BWMR 2022) mandatory reporting in progress.",
    source: "Central Pollution Control Board (CPCB) / Modeled Estimate",
    lastUpdated: "09 Oct 2026",
    narrative: "Battery waste is increasing faster than formal recycling capacity, creating a growing recovery gap. Informal dismantling of lead-acid and e-rickshaw batteries remains widespread.",
    keyGaps: [
      "Collection infrastructure for consumer lithium-ion cells",
      "Hydrometallurgical material recovery capacity",
      "Informal-sector integration and safety protocols"
    ],
    timeSeries: [
      { year: 2018, historical: 0.95, projected: null, collection: 0.28 },
      { year: 2020, historical: 1.15, projected: null, collection: 0.37 },
      { year: 2022, historical: 1.40, projected: null, collection: 0.48 },
      { year: 2024, historical: 1.68, projected: null, collection: 0.61 },
      { year: 2025, historical: 1.84, projected: 1.84, collection: 0.70 },
      { year: 2026, historical: null, projected: 2.10, collection: 0.85 },
      { year: 2028, historical: null, projected: 2.75, collection: 1.30 },
      { year: 2030, historical: null, projected: 3.60, collection: 2.10 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 120, current: 28, potential: 110, unit: "kt" },
      cobalt: { recoverable: 32, current: 9, potential: 30, unit: "kt" },
      nickel: { recoverable: 210, current: 52, potential: 195, unit: "kt" },
      copper: { recoverable: 480, current: 165, potential: 440, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2022, source: "MoEFCC BWMR", explanation: "Mandatory extended producer responsibility targets set for 2024–2030." },
      { name: "Collection Target", status: "Active", year: 2026, source: "CPCB Directives", explanation: "Target: 60% collection of portable & EV batteries by 2030." },
      { name: "Battery Passport", status: "Implementation phase", year: 2025, source: "NITI Aayog Framework", explanation: "Digital traceability pilot for EV batteries ongoing." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2022, source: "CPCB Portal", explanation: "Producers must register on centralized CPCB portal." },
      { name: "Reporting Framework", status: "Partial", year: 2024, source: "CPCB Portal", explanation: "Formal recyclers registered; informal sector reporting unverified." }
    ]
  },
  {
    id: "USA",
    iso2: "US",
    name: "United States",
    region: "Americas",
    flag: "🇺🇸",
    population: "335M",
    wasteGenerated: 2.85,
    perCapita: 8.51,
    collectionRate: 54.2,
    recyclingRate: 48.0,
    informalShare: 8.5,
    criticalRecovery: 420,
    eprStatus: "Partial",
    confidence: "High",
    confidenceDetails: "EPA annual e-waste surveys combined with state-level EPR tracking.",
    source: "US EPA & Department of Energy (DOE) Circular Economy Lab",
    lastUpdated: "09 Oct 2026",
    narrative: "EV fleet retirements driving rapid volume growth. Federal Inflation Reduction Act (IRA) incentives are sparking large domestic recycling facility investments, but state-level EPR laws remain fragmented.",
    keyGaps: [
      "Harmonized federal battery EPR framework",
      "Standardized collection network for residential energy storage",
      "Interstate transport hazardous waste classification bottlenecks"
    ],
    timeSeries: [
      { year: 2018, historical: 1.80, projected: null, collection: 0.85 },
      { year: 2020, historical: 2.10, projected: null, collection: 1.05 },
      { year: 2022, historical: 2.45, projected: null, collection: 1.28 },
      { year: 2024, historical: 2.70, projected: null, collection: 1.42 },
      { year: 2025, historical: 2.85, projected: 2.85, collection: 1.54 },
      { year: 2026, historical: null, projected: 3.15, collection: 1.80 },
      { year: 2028, historical: null, projected: 3.90, collection: 2.45 },
      { year: 2030, historical: null, projected: 4.85, collection: 3.40 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 240, current: 95, potential: 220, unit: "kt" },
      cobalt: { recoverable: 65, current: 38, potential: 60, unit: "kt" },
      nickel: { recoverable: 410, current: 210, potential: 385, unit: "kt" },
      copper: { recoverable: 720, current: 410, potential: 680, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Partial", year: 2024, source: "State Laws (CA, WA, NY)", explanation: "Enacted in 12 states; no federal umbrella EPR statute." },
      { name: "Collection Target", status: "Planned", year: 2025, source: "DOE Secondary Supply Initiative", explanation: "Federal benchmark aiming for 90% Li-ion collection by 2035." },
      { name: "Battery Passport", status: "Planned", year: 2026, source: "US DOE Circularity Office", explanation: "Interoperable battery passport standard in development." },
      { name: "Producer Responsibility", status: "Partial", year: 2023, source: "Call2Recycle / State Regs", explanation: "Mandatory in select states; voluntary stewardship elsewhere." },
      { name: "Reporting Framework", status: "Active", year: 2024, source: "EPA Biennial Report", explanation: "Robust commercial hazardous waste tracking via EPA RCRA." }
    ]
  },
  {
    id: "CHN",
    iso2: "CN",
    name: "China",
    region: "Asia",
    flag: "🇨🇳",
    population: "1.41B",
    wasteGenerated: 4.10,
    perCapita: 2.91,
    collectionRate: 62.0,
    recyclingRate: 55.5,
    informalShare: 18.0,
    criticalRecovery: 890,
    eprStatus: "Active",
    confidence: "High",
    confidenceDetails: "National Traceability & Management Platform for EV Battery Recycling.",
    source: "Ministry of Ecology and Environment (MEE) & MIIT Registry",
    lastUpdated: "09 Oct 2026",
    narrative: "World's largest generator of EV battery waste. National digital traceability platform tracks battery packs from vehicle production to recycling 'Whitelisted' facilities.",
    keyGaps: [
      "Small workshop leakage outside Whitelisted recyclers",
      "LFP (Lithium Iron Phosphate) economic recycling margins",
      "Cross-province waste shipment transport efficiency"
    ],
    timeSeries: [
      { year: 2018, historical: 1.90, projected: null, collection: 0.95 },
      { year: 2020, historical: 2.50, projected: null, collection: 1.35 },
      { year: 2022, historical: 3.10, projected: null, collection: 1.80 },
      { year: 2024, historical: 3.75, projected: null, collection: 2.30 },
      { year: 2025, historical: 4.10, projected: 4.10, collection: 2.54 },
      { year: 2026, historical: null, projected: 4.70, collection: 3.05 },
      { year: 2028, historical: null, projected: 6.20, collection: 4.30 },
      { year: 2030, historical: null, projected: 8.40, collection: 6.30 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 380, current: 210, potential: 350, unit: "kt" },
      cobalt: { recoverable: 110, current: 78, potential: 102, unit: "kt" },
      nickel: { recoverable: 650, current: 410, potential: 610, unit: "kt" },
      copper: { recoverable: 1100, current: 750, potential: 1020, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2018, source: "MIIT EV Battery EPR Rules", explanation: "Mandatory automotive OEM responsibility since 2018." },
      { name: "Collection Target", status: "Active", year: 2025, source: "MIIT Circular Plan", explanation: "Targeting 85% collection rate for traction batteries." },
      { name: "Battery Passport", status: "Active", year: 2021, source: "National Traceability Code", explanation: "Unique ID QR code required on every domestic EV battery pack." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2018, source: "MEE Directives", explanation: "Strict penalties for non-registration with national portal." },
      { name: "Reporting Framework", status: "Active", year: 2022, source: "MIIT Whitelist System", explanation: "Over 150 official accredited battery recycling enterprises." }
    ]
  },
  {
    id: "DEU",
    iso2: "DE",
    name: "Germany",
    region: "Europe",
    flag: "🇩🇪",
    population: "84M",
    wasteGenerated: 0.62,
    perCapita: 7.38,
    collectionRate: 71.5,
    recyclingRate: 66.0,
    informalShare: 3.2,
    criticalRecovery: 115,
    eprStatus: "Active",
    confidence: "High",
    confidenceDetails: "Stiftung GRS Batterien & Federal Environment Agency (UBA) mandatory filings.",
    source: "Umweltbundesamt (UBA) & EU Battery Regulation Data Portal",
    lastUpdated: "09 Oct 2026",
    narrative: "Leading compliance under EU Battery Regulation (2023/1542). High collection rates for lead-acid and portable batteries, with scaling industrial hydrometallurgy facilities.",
    keyGaps: [
      "Second-life battery safety re-certification standards",
      "High energy costs for local pyrometallurgical refining",
      "Cross-border collection logistics within EU single market"
    ],
    timeSeries: [
      { year: 2018, historical: 0.42, projected: null, collection: 0.28 },
      { year: 2020, historical: 0.48, projected: null, collection: 0.33 },
      { year: 2022, historical: 0.54, projected: null, collection: 0.38 },
      { year: 2024, historical: 0.59, projected: null, collection: 0.42 },
      { year: 2025, historical: 0.62, projected: 0.62, collection: 0.44 },
      { year: 2026, historical: null, projected: 0.68, collection: 0.50 },
      { year: 2028, historical: null, projected: 0.82, collection: 0.63 },
      { year: 2030, historical: null, projected: 1.05, collection: 0.84 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 52, current: 31, potential: 48, unit: "kt" },
      cobalt: { recoverable: 16, current: 11, potential: 15, unit: "kt" },
      nickel: { recoverable: 92, current: 62, potential: 86, unit: "kt" },
      copper: { recoverable: 145, current: 105, potential: 138, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2023, source: "EU Battery Reg 2023/1542", explanation: "Direct enforcement of EU Extended Producer Responsibility." },
      { name: "Collection Target", status: "Active", year: 2025, source: "BattG Germany", explanation: "Targeting 63% portable collection & 100% EV battery collection." },
      { name: "Battery Passport", status: "Implementation phase", year: 2026, source: "EU Digital Battery Passport", explanation: "Mandatory implementation for batteries > 2kWh by Feb 2027." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2020, source: "EAR Register", explanation: "Centralized producer register with strict eco-fee modulation." },
      { name: "Reporting Framework", status: "Active", year: 2024, source: "UBA Annual Audit", explanation: "Audited material recovery yield verification." }
    ]
  },
  {
    id: "JPN",
    iso2: "JP",
    name: "Japan",
    region: "Asia",
    flag: "🇯🇵",
    population: "125M",
    wasteGenerated: 0.78,
    perCapita: 6.24,
    collectionRate: 68.0,
    recyclingRate: 62.4,
    informalShare: 4.1,
    criticalRecovery: 140,
    eprStatus: "Active",
    confidence: "High",
    confidenceDetails: "Ministry of the Environment (MOE) sound material-cycle society statistics.",
    source: "Japan Battery Recycling Association (JBRA) & METI",
    lastUpdated: "09 Oct 2026",
    narrative: "Mature domestic recycling ecosystem with high recovery yields for lead-acid and NiMH. Advanced closed-loop auto OEM collection networks.",
    keyGaps: [
      "Domestic lithium refining capacity constraints",
      "Collection of small secondary consumer electronics",
      "Aging specialized technician workforce for high-voltage disassembling"
    ],
    timeSeries: [
      { year: 2018, historical: 0.58, projected: null, collection: 0.38 },
      { year: 2020, historical: 0.64, projected: null, collection: 0.43 },
      { year: 2022, historical: 0.71, projected: null, collection: 0.48 },
      { year: 2024, historical: 0.75, projected: null, collection: 0.51 },
      { year: 2025, historical: 0.78, projected: 0.78, collection: 0.53 },
      { year: 2026, historical: null, projected: 0.83, collection: 0.58 },
      { year: 2028, historical: null, projected: 0.96, collection: 0.70 },
      { year: 2030, historical: null, projected: 1.15, collection: 0.88 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 58, current: 34, potential: 54, unit: "kt" },
      cobalt: { recoverable: 22, current: 15, potential: 20, unit: "kt" },
      nickel: { recoverable: 110, current: 75, potential: 102, unit: "kt" },
      copper: { recoverable: 180, current: 130, potential: 170, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2001, source: "Act on Promotion of Resource Recycling", explanation: "Established extended producer responsibility framework." },
      { name: "Collection Target", status: "Active", year: 2025, source: "METI Circular Roadmap", explanation: "Targeting 70% collection across all rechargeable chemistries." },
      { name: "Battery Passport", status: "Implementation phase", year: 2025, source: "MOE Battery Strategy", explanation: "Collaborating on global interoperability standard with EU." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2001, source: "JBRA Portal", explanation: "Mandatory take-back obligations for auto and electronics makers." },
      { name: "Reporting Framework", status: "Active", year: 2023, source: "MOE National Census", explanation: "Granular material balance reporting." }
    ]
  },
  {
    id: "BRA",
    iso2: "BR",
    name: "Brazil",
    region: "Americas",
    flag: "🇧🇷",
    population: "214M",
    wasteGenerated: 0.58,
    perCapita: 2.71,
    collectionRate: 32.5,
    recyclingRate: 26.0,
    informalShare: 45.0,
    criticalRecovery: 55,
    eprStatus: "Active",
    confidence: "Medium",
    confidenceDetails: "National Solid Waste Policy (PNRS) sectorial agreements reporting.",
    source: "Ibama / Ministry of Environment (MMA) & Green Eletron",
    lastUpdated: "09 Oct 2026",
    narrative: "Strong sectoral agreement for lead-acid batteries, but consumer lithium-ion collection remains fragmented across vast geographic territories.",
    keyGaps: [
      "Reverse logistics network outside major metropolitan areas (São Paulo, Rio)",
      "Hydrometallurgical facilities for EV battery black mass processing",
      "Formalization of catadores (waste pickers) for battery scrap"
    ],
    timeSeries: [
      { year: 2018, historical: 0.38, projected: null, collection: 0.11 },
      { year: 2020, historical: 0.44, projected: null, collection: 0.13 },
      { year: 2022, historical: 0.50, projected: null, collection: 0.15 },
      { year: 2024, historical: 0.55, projected: null, collection: 0.18 },
      { year: 2025, historical: 0.58, projected: 0.58, collection: 0.19 },
      { year: 2026, historical: null, projected: 0.64, collection: 0.22 },
      { year: 2028, historical: null, projected: 0.78, collection: 0.32 },
      { year: 2030, historical: null, projected: 0.98, collection: 0.48 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 28, current: 5, potential: 24, unit: "kt" },
      cobalt: { recoverable: 8, current: 1.5, potential: 7, unit: "kt" },
      nickel: { recoverable: 45, current: 9, potential: 39, unit: "kt" },
      copper: { recoverable: 120, current: 32, potential: 105, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2019, source: "Decree 10.240/2020 PNRS", explanation: "Mandatory sectoral reverse logistics agreements." },
      { name: "Collection Target", status: "Active", year: 2025, source: "MMA Reverse Logistics Agreement", explanation: "Progressive targets for electronics and batteries." },
      { name: "Battery Passport", status: "Planned", year: 2026, source: "ABINEE Taskforce", explanation: "Feasibility study underway." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2019, source: "MMA System", explanation: "Producers subject to national audit." },
      { name: "Reporting Framework", status: "Partial", year: 2024, source: "SINIR National System", explanation: "Self-reported data by sector compliance bodies." }
    ]
  },
  {
    id: "ZAF",
    iso2: "ZA",
    name: "South Africa",
    region: "Africa",
    flag: "🇿🇦",
    population: "60M",
    wasteGenerated: 0.21,
    perCapita: 3.50,
    collectionRate: 28.0,
    recyclingRate: 22.0,
    informalShare: 62.0,
    criticalRecovery: 18,
    eprStatus: "Active",
    confidence: "Medium",
    confidenceDetails: "National Environmental Management Waste Act (NEMWA) Section 18 filings.",
    source: "Department of Forestry, Fisheries and the Environment (DFFE) & ERA",
    lastUpdated: "09 Oct 2026",
    narrative: "Section 18 Regulations mandatory EPR scheme operational. High informal collection of automotive lead-acid batteries, with emerging lithium-ion storage risks.",
    keyGaps: [
      "Lithium-ion recycling facilities in Sub-Saharan Africa region",
      "Hazardous export clearance under Basel Convention",
      "Battery fire safety enforcement at informal scrap yards"
    ],
    timeSeries: [
      { year: 2018, historical: 0.14, projected: null, collection: 0.035 },
      { year: 2020, historical: 0.16, projected: null, collection: 0.042 },
      { year: 2022, historical: 0.18, projected: null, collection: 0.048 },
      { year: 2024, historical: 0.20, projected: null, collection: 0.054 },
      { year: 2025, historical: 0.21, projected: 0.21, collection: 0.059 },
      { year: 2026, historical: null, projected: 0.24, collection: 0.075 },
      { year: 2028, historical: null, projected: 0.31, collection: 0.12 },
      { year: 2030, historical: null, projected: 0.42, collection: 0.21 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 12, current: 1.2, potential: 10, unit: "kt" },
      cobalt: { recoverable: 3.5, current: 0.4, potential: 3.0, unit: "kt" },
      nickel: { recoverable: 18, current: 2.1, potential: 15, unit: "kt" },
      copper: { recoverable: 55, current: 12, potential: 46, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2021, source: "NEMWA Section 18", explanation: "Mandatory EPR regulations for lighting and electrical equipment." },
      { name: "Collection Target", status: "Active", year: 2026, source: "DFFE Targets", explanation: "Phase 1 target of 35% collection for portable batteries." },
      { name: "Battery Passport", status: "No data", year: 2026, source: "DFFE", explanation: "No national digital passport initiative currently registered." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2021, source: "PRO Registration", explanation: "Producers must belong to approved PRO (Producer Responsibility Org)." },
      { name: "Reporting Framework", status: "Partial", year: 2024, source: "SAWIS System", explanation: "Waste Information System self-reporting." }
    ]
  },
  {
    id: "GBR",
    iso2: "GB",
    name: "United Kingdom",
    region: "Europe",
    flag: "🇬🇧",
    population: "67M",
    wasteGenerated: 0.48,
    perCapita: 7.16,
    collectionRate: 58.0,
    recyclingRate: 52.0,
    informalShare: 5.0,
    criticalRecovery: 72,
    eprStatus: "Active",
    confidence: "High",
    confidenceDetails: "Environment Agency National Packaging and Battery Waste Database (NPWD).",
    source: "UK Environment Agency / DEFRA Battery Statistics",
    lastUpdated: "09 Oct 2026",
    narrative: "Reforms underway for the Waste Batteries and Accumulators Regulations. Strong baseline collection with UK-based gigafactory recycling partnerships forming.",
    keyGaps: [
      "Domestic black mass refining capacity",
      "Collection rate for small handheld lithium-ion cells",
      "Clear regulatory status for second-life stationary energy storage"
    ],
    timeSeries: [
      { year: 2018, historical: 0.35, projected: null, collection: 0.19 },
      { year: 2020, historical: 0.39, projected: null, collection: 0.22 },
      { year: 2022, historical: 0.43, projected: null, collection: 0.25 },
      { year: 2024, historical: 0.46, projected: null, collection: 0.27 },
      { year: 2025, historical: 0.48, projected: 0.48, collection: 0.28 },
      { year: 2026, historical: null, projected: 0.52, collection: 0.32 },
      { year: 2028, historical: null, projected: 0.63, collection: 0.42 },
      { year: 2030, historical: null, projected: 0.79, collection: 0.58 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 38, current: 18, potential: 34, unit: "kt" },
      cobalt: { recoverable: 11, current: 6.5, potential: 10, unit: "kt" },
      nickel: { recoverable: 62, current: 36, potential: 56, unit: "kt" },
      copper: { recoverable: 105, current: 65, potential: 96, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2009, source: "Waste Batteries Regs 2009 / Defra Review", explanation: "Undergoing modernization to align with high EV growth." },
      { name: "Collection Target", status: "Active", year: 2025, source: "Defra Directive", explanation: "45% portable battery collection target; higher EV targets proposed." },
      { name: "Battery Passport", status: "Planned", year: 2026, source: "UK Battery Strategy 2023", explanation: "Proposal to adopt compatible passport standards with EU." },
      { name: "Producer Responsibility", status: "Mandatory", year: 2009, source: "NPWD Portal", explanation: "Producers must join compliance scheme." },
      { name: "Reporting Framework", status: "Active", year: 2024, source: "Environment Agency Audit", explanation: "Quarterly PRN data audit." }
    ]
  },
  {
    id: "NGA",
    iso2: "NG",
    name: "Nigeria",
    region: "Africa",
    flag: "🇳🇬",
    population: "220M",
    wasteGenerated: 0.34,
    perCapita: 1.54,
    collectionRate: 19.5,
    recyclingRate: 12.0,
    informalShare: 78.0,
    criticalRecovery: 12,
    eprStatus: "Planned",
    confidence: "Low",
    confidenceDetails: "Data estimated using import balances and solar energy storage deployment proxy models.",
    source: "NESREA Baseline Survey & UNITAR E-waste Academy Estimate",
    lastUpdated: "09 Oct 2026",
    narrative: "Off-grid solar system growth (solar home systems, telecom tower batteries) is generating significant legacy lead-acid and second-life lithium waste with minimal formal collection.",
    keyGaps: [
      "No official national battery-waste statistics available",
      "High informal backyard lead smelting health risks",
      "Lack of hazardous waste containment infrastructure"
    ],
    timeSeries: [
      { year: 2018, historical: 0.18, projected: null, collection: 0.03 },
      { year: 2020, historical: 0.22, projected: null, collection: 0.04 },
      { year: 2022, historical: 0.27, projected: null, collection: 0.05 },
      { year: 2024, historical: 0.31, projected: null, collection: 0.06 },
      { year: 2025, historical: 0.34, projected: 0.34, collection: 0.066 },
      { year: 2026, historical: null, projected: 0.39, collection: 0.08 },
      { year: 2028, historical: null, projected: 0.52, collection: 0.13 },
      { year: 2030, historical: null, projected: 0.71, collection: 0.22 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 16, current: 0.8, potential: 13, unit: "kt" },
      cobalt: { recoverable: 4.2, current: 0.2, potential: 3.5, unit: "kt" },
      nickel: { recoverable: 24, current: 1.2, potential: 19, unit: "kt" },
      copper: { recoverable: 78, current: 9.0, potential: 62, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Planned", year: 2024, source: "NESREA Draft Guideline", explanation: "Draft National EPR Regulations for E-waste under review." },
      { name: "Collection Target", status: "No data", year: 2026, source: "NESREA", explanation: "No binding national collection quota enacted." },
      { name: "Battery Passport", status: "No data", year: 2026, source: "NESREA", explanation: "Not active." },
      { name: "Producer Responsibility", status: "Partial", year: 2023, source: "EPRON Voluntary Scheme", explanation: "Voluntary PRO initiatives by select importers." },
      { name: "Reporting Framework", status: "Partial", year: 2024, source: "Customs Import Manifests", explanation: "Import volume tracking only; EOL fate unmonitored." }
    ]
  },
  {
    id: "AUS",
    iso2: "AU",
    name: "Australia",
    region: "Oceania",
    flag: "🇦🇺",
    population: "26M",
    wasteGenerated: 0.28,
    perCapita: 10.76,
    collectionRate: 46.0,
    recyclingRate: 41.0,
    informalShare: 6.0,
    criticalRecovery: 45,
    eprStatus: "Active",
    confidence: "High",
    confidenceDetails: "B-cycle Scheme (BSCS) & Department of Climate Change, Energy, the Environment and Water.",
    source: "Battery Stewardship Council (BSC) & DCCEEW",
    lastUpdated: "09 Oct 2026",
    narrative: "Nationwide battery stewardship scheme (B-cycle) expanding rapidly. High rooftop solar battery storage adoption is creating a localized surge in residential battery waste.",
    keyGaps: [
      "Long-distance transport costs from remote mining/regional centers",
      "Onshore black mass refining scaling",
      "Consistent state regulation for handheld vs industrial storage packs"
    ],
    timeSeries: [
      { year: 2018, historical: 0.17, projected: null, collection: 0.05 },
      { year: 2020, historical: 0.20, projected: null, collection: 0.07 },
      { year: 2022, historical: 0.23, projected: null, collection: 0.09 },
      { year: 2024, historical: 0.26, projected: null, collection: 0.11 },
      { year: 2025, historical: 0.28, projected: 0.28, collection: 0.13 },
      { year: 2026, historical: null, projected: 0.32, collection: 0.16 },
      { year: 2028, historical: null, projected: 0.42, collection: 0.24 },
      { year: 2030, historical: null, projected: 0.56, collection: 0.36 }
    ],
    materialsBreakdown: {
      lithium: { recoverable: 24, current: 8.5, potential: 21, unit: "kt" },
      cobalt: { recoverable: 6.8, current: 2.8, potential: 6.0, unit: "kt" },
      nickel: { recoverable: 42, current: 18.0, potential: 37, unit: "kt" },
      copper: { recoverable: 68, current: 31.0, potential: 61, unit: "kt" }
    },
    policyScorecard: [
      { name: "EPR Legislation", status: "Active", year: 2022, source: "B-cycle Stewardship", explanation: "Industry-led voluntary scheme co-designed with federal government." },
      { name: "Collection Target", status: "Active", year: 2025, source: "BSC Targets", explanation: "Targeting 60% collection of loose handheld batteries." },
      { name: "Battery Passport", status: "Planned", year: 2026, source: "National Battery Strategy 2024", explanation: "Tracing battery supply chains from mine to end-of-life." },
      { name: "Producer Responsibility", status: "Active", year: 2022, source: "B-cycle Industry Levy", explanation: "Levy on battery imports funding collection rebates." },
      { name: "Reporting Framework", status: "Active", year: 2024, source: "BSC Annual Report", explanation: "Audited collection point data." }
    ]
  }
];

export const MATERIALS_DATA = {
  materials: [
    { id: "lithium", name: "Lithium", symbol: "Li", color: "#2563eb", unit: "kt" },
    { id: "cobalt", name: "Cobalt", symbol: "Co", color: "#114b3e", unit: "kt" },
    { id: "nickel", name: "Nickel", symbol: "Ni", color: "#d97706", unit: "kt" },
    { id: "copper", name: "Copper", symbol: "Cu", color: "#b91c1c", unit: "kt" },
    { id: "manganese", name: "Manganese", symbol: "Mn", color: "#64748b", unit: "kt" },
    { id: "graphite", name: "Graphite", symbol: "C", color: "#334155", unit: "kt" }
  ],
  
  recoverableProjection: [
    { year: 2020, lithium: 85, cobalt: 35, nickel: 160, copper: 420, manganese: 90, graphite: 210 },
    { year: 2022, lithium: 130, cobalt: 48, nickel: 230, copper: 580, manganese: 135, graphite: 310 },
    { year: 2024, lithium: 210, cobalt: 65, nickel: 360, copper: 820, manganese: 210, graphite: 480 },
    { year: 2025, lithium: 275, cobalt: 78, nickel: 440, copper: 980, manganese: 260, graphite: 620 },
    { year: 2026, lithium: 360, cobalt: 92, nickel: 540, copper: 1180, manganese: 320, graphite: 790 },
    { year: 2028, lithium: 580, cobalt: 125, nickel: 820, copper: 1650, manganese: 470, graphite: 1240 },
    { year: 2030, lithium: 920, cobalt: 175, nickel: 1280, copper: 2400, manganese: 710, graphite: 1950 },
    { year: 2035, lithium: 1850, cobalt: 280, nickel: 2450, copper: 4100, manganese: 1280, graphite: 3600 },
    { year: 2040, lithium: 3100, cobalt: 390, nickel: 4100, copper: 6500, manganese: 2100, graphite: 5800 }
  ],

  sankeyStages: [
    { id: "production", name: "Battery Production", value: "24.5 Mt", detail: "Global cell manufacturing output (EV, ESS, Consumer)" },
    { id: "in_use", name: "In-Use Batteries", value: "112.0 Mt", detail: "Active energy storage installed base in vehicles & grid" },
    { id: "eol", name: "End-of-Life Batteries", value: "18.7 Mt", detail: "Reached end of functional service life" },
    { id: "collection", name: "Formal Collection", value: "8.0 Mt (42.8%)", detail: "Safely gathered via accredited take-back networks" },
    { id: "recycling", name: "Recycling Facilities", value: "6.2 Mt", detail: "Processed through shredding, black mass, pyro/hydrometallurgy" },
    { id: "recovery", name: "Secondary Material Recovery", value: "4.2 Mt", detail: "Battery-grade refined lithium, cobalt, nickel, copper returned to supply chain" }
  ],

  insightDetails: {
    lithium: {
      recoverableTonnes: "275,000 tonnes",
      currentRecovery: "98,000 tonnes (35.6%)",
      theoreticalPotential: "261,250 tonnes (95% process limit)",
      recoveryGap: "163,250 tonnes lost to landfill or unrecovered black mass",
      narrative: "Improving collection rates to 80% and scaling closed-loop hydrometallurgical recycling could supply over 28% of global battery-grade lithium demand by 2030."
    },
    cobalt: {
      recoverableTonnes: "78,000 tonnes",
      currentRecovery: "42,000 tonnes (53.8%)",
      theoreticalPotential: "76,440 tonnes (98% process limit)",
      recoveryGap: "34,440 tonnes lost",
      narrative: "High intrinsic commercial value drives relatively efficient cobalt recovery, but cathode chemistry shifts (LFP, sodium-ion) alter future revenue balances."
    },
    nickel: {
      recoverableTonnes: "440,000 tonnes",
      currentRecovery: "215,000 tonnes (48.8%)",
      theoreticalPotential: "431,200 tonnes",
      recoveryGap: "216,200 tonnes lost",
      narrative: "Secondary nickel recovery avoids energy-intensive Class 1 nickel smelting and reduces lifecycle carbon emissions by up to 70%."
    },
    copper: {
      recoverableTonnes: "980,000 tonnes",
      currentRecovery: "520,000 tonnes (53.0%)",
      theoreticalPotential: "960,400 tonnes",
      recoveryGap: "440,400 tonnes lost",
      narrative: "High collection and recovery rates across current collector foil and busbar recycling, essential for circular electronics."
    },
    manganese: {
      recoverableTonnes: "260,000 tonnes",
      currentRecovery: "85,000 tonnes (32.6%)",
      theoreticalPotential: "247,000 tonnes",
      recoveryGap: "162,000 tonnes lost",
      narrative: "Often slagged in pyrometallurgical processing; hydrometallurgical recycling is required to unlock high-purity manganese sulphate."
    },
    graphite: {
      recoverableTonnes: "620,000 tonnes",
      currentRecovery: "95,000 tonnes (15.3%)",
      theoreticalPotential: "558,000 tonnes",
      recoveryGap: "463,000 tonnes lost",
      narrative: "Synthetic and natural graphite anode recycling faces technical challenges; purified secondary graphite is emerging for re-anode synthesis."
    }
  }
};

export const AI_SAMPLE_QUERIES = [
  {
    query: "Which countries have the largest battery recycling gap?",
    response: {
      observedData: "India (1.27 Mt uncollected/unrecycled), United States (1.31 Mt gap), Brazil (0.39 Mt gap), and Nigeria (0.27 Mt gap) account for over 3.2 Mt of uncollected end-of-life battery volume in 2025.",
      modeledEstimate: "Mass-balance modeling projects that without mandated collection quotas, uncollected battery waste across non-EU G20 economies will expand to 7.4 Mt annually by 2030.",
      aiInterpretation: "The collection gap is primarily structural rather than technological. While high-yield recycling technologies exist, collection infrastructure, economic transport incentives, and informal sector leakage prevent waste from reaching accredited recyclers."
    }
  },
  {
    query: "Show me lithium recovery potential in Europe",
    response: {
      observedData: "In 2025, Europe generated approximately 2.40 Mt of battery waste containing 52,000 tonnes of recoverable lithium (led by Germany, France, and Nordic countries).",
      modeledEstimate: "Under the EU Battery Regulation mandatory recovery targets (80% lithium recovery yield by 2031), European secondary lithium output will reach 185,000 tonnes per annum by 2035.",
      aiInterpretation: "Europe is positioned to achieve the highest localized secondary material autonomy globally, potentially offsetting 22% of total European battery manufacturing lithium demand from domestic recycling by 2030."
    }
  },
  {
    query: "What is the policy compliance status of Extended Producer Responsibility (EPR)?",
    response: {
      observedData: "Currently 68% of the global population resides in jurisdictions with active battery EPR regulations, covering 48 nations including EU members, China, India, Japan, South Korea, and select US states.",
      modeledEstimate: "If proposed draft EPR regulations in ASEAN, LATAM, and ECOWAS regions are enacted by 2028, global policy coverage will reach 82%.",
      aiInterpretation: "Having an EPR law on paper does not guarantee compliance. Nations with centralized digital reporting registries (e.g. China's MIIT platform or EU EAR systems) exhibit collection rates 2.4x higher than jurisdictions relying on unverified producer self-reporting."
    }
  }
];
