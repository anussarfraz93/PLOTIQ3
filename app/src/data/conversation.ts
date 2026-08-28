import { BudgetOption, LandType, PurposeOption, ScaleOption, VibeOption } from "./types";

// Ported 1:1 from prototype/index.html's STEP1 / SCALE_BY_TYPE / BUDGET_STEP /
// VIBE_BY_TYPE — same copy, same values, same branching. This is the SRS's
// Section 4.1 "guided multi-step questionnaire" and Section 4.2 "land
// classification engine" (the branching itself maps answers to a type/size/
// budget/zone profile).

export const STEP1: { bot: string; options: PurposeOption[] } = {
  bot: "Salam! I'm PLOTIQ 🧭. Tell me what you're building and I'll match you to the right land in Islamabad.",
  options: [
    { label: "A family home", sub: "To live in", value: "residential", tag: "family", icon: "house" },
    { label: "Rental / investment", sub: "Residential resale", value: "residential", tag: "investment", icon: "coins" },
    { label: "A shop or plaza", sub: "Retail / commercial", value: "commercial", tag: "business", icon: "shop" },
    { label: "A factory", sub: "Industrial facility", value: "industrial", tag: "production", icon: "factory" },
    { label: "A farmhouse", sub: "Weekend / estate", value: "farmhouse", tag: "weekend", icon: "tree" },
  ],
};

export const SCALE_BY_TYPE: Record<LandType, { bot: string; options: ScaleOption[] }> = {
  residential: {
    bot: "How many people will the house need to hold?",
    options: [
      { label: "Just me / a couple", sub: "1–2 people", range: [5, 7] },
      { label: "Small family", sub: "3–4 people", range: [7, 10] },
      { label: "Large family", sub: "5–7 people", range: [10, 14] },
      { label: "Joint family", sub: "8+ people", range: [14, 20] },
    ],
  },
  commercial: {
    bot: "What scale of commercial space are you planning?",
    options: [
      { label: "Kiosk / small shop", sub: "Single unit", range: [3, 5] },
      { label: "Showroom", sub: "Mid-size retail", range: [5, 7] },
      { label: "Retail plaza", sub: "Multi-unit", range: [7, 10] },
      { label: "Commercial plaza", sub: "Multi-story", range: [10, 16] },
    ],
  },
  industrial: {
    bot: "What scale of factory or industrial unit do you need?",
    options: [
      { label: "Small workshop", sub: "Light manufacturing", range: [20, 35] },
      { label: "Medium factory", sub: "Full production line", range: [35, 60] },
      { label: "Large plant", sub: "Heavy industry", range: [60, 100] },
      { label: "Logistics hub", sub: "Warehousing / mega unit", range: [100, 200] },
    ],
  },
  farmhouse: {
    bot: "What scale of farmhouse are you picturing?",
    options: [
      { label: "Weekend getaway", sub: "Small retreat", range: [10, 20] },
      { label: "Family farmhouse", sub: "Regular use", range: [20, 40] },
      { label: "Estate farmhouse", sub: "Large grounds", range: [40, 80] },
      { label: "Large estate", sub: "Working land", range: [80, 150] },
    ],
  },
};

export const BUDGET_STEP: { bot: string; options: BudgetOption[] } = {
  bot: "What's your budget for the plot itself, roughly?",
  options: [
    { label: "Under 1.5 crore", sub: "Entry level", value: 150 },
    { label: "1.5 – 3 crore", sub: "Mid range", value: 300 },
    { label: "3 – 6 crore", sub: "Premium", value: 600 },
    { label: "6 – 12 crore", sub: "High end", value: 1200 },
  ],
};

export const VIBE_BY_TYPE: Record<LandType, VibeOption[]> = {
  residential: [
    { label: "Close to city center", tag: "central", icon: "mapPin" },
    { label: "Gated, family-friendly", tag: "gated", icon: "shield" },
    { label: "Quiet, green, peaceful", tag: "quiet", icon: "leaf" },
    { label: "Affordable, developing", tag: "affordable", icon: "tag" },
  ],
  commercial: [
    { label: "High footfall, central", tag: "high-traffic", icon: "trendingUp" },
    { label: "Established business hub", tag: "established", icon: "building" },
    { label: "Near residential catchment", tag: "near-residential", icon: "mapPin" },
    { label: "Affordable, developing", tag: "affordable", icon: "tag" },
  ],
  industrial: [
    { label: "Highway / logistics access", tag: "logistics", icon: "truck" },
    { label: "Established industrial zone", tag: "established", icon: "building" },
    { label: "Utilities ready", tag: "utilities", icon: "bolt" },
    { label: "Affordable, developing", tag: "affordable", icon: "tag" },
  ],
  farmhouse: [
    { label: "Quiet, green, peaceful", tag: "quiet", icon: "leaf" },
    { label: "Scenic, riverside views", tag: "scenic", icon: "mountain" },
    { label: "Gated farmhouse community", tag: "farmhouse-gated", icon: "shield" },
    { label: "Affordable, developing", tag: "affordable", icon: "tag" },
  ],
};
