export type LandType = "residential" | "commercial" | "industrial" | "farmhouse";

// Ported 1:1 from prototype/index.html's ICONS object keys.
export type IconName =
  | "compass"
  | "menu"
  | "arrowLeft"
  | "close"
  | "search"
  | "bookmark"
  | "bookmarkFill"
  | "chart"
  | "layers"
  | "house"
  | "coins"
  | "shop"
  | "factory"
  | "tree"
  | "mapPin"
  | "shield"
  | "leaf"
  | "tag"
  | "trendingUp"
  | "building"
  | "truck"
  | "bolt"
  | "mountain"
  | "info"
  | "phone"
  | "whatsapp"
  | "settings";

export type Agent = { name: string | null; phone: string | null; whatsapp: string | null };

// Matches the backend's plot shape (backend/src/data/db.js toPlot()) — the
// SRS Section 4.3 field set: block, development status, amenities,
// legal/NOC status, agent contact, lat/lng for a future map view.
export type Plot = {
  id: number;
  sector: string;
  block: string | null;
  type: LandType;
  sizes: number[];
  pricePerMarlaLac: number;
  vibe: string[];
  distance: string;
  distanceMinutes: number;
  developmentStatus: string | null;
  amenities: string[];
  legalStatus: string | null;
  nocApproved: boolean;
  agent: Agent;
  imageUrl: string | null;
  lat: number | null;
  lng: number | null;
};

export type PurposeOption = {
  label: string;
  sub: string;
  value: LandType;
  tag: "family" | "investment" | "business" | "production" | "weekend";
  icon: IconName;
};

export type ScaleOption = {
  label: string;
  sub: string;
  range: [number, number];
};

export type BudgetOption = {
  label: string;
  sub: string;
  value: number;
};

export type VibeOption = {
  label: string;
  tag: string;
  icon: IconName;
};

export type Answers = {
  purpose?: PurposeOption;
  scale?: ScaleOption;
  budget?: BudgetOption;
  vibe?: VibeOption;
};

export type Match = {
  plot: Plot;
  score: number;
  bestSize: number;
  reasons: string[];
  totalCostLac: number;
};

export type SavedEntry = { plotId: number; size: number; savedAt: number };
