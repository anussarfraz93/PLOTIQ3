// Seed data for the plots table — same 19 Islamabad sectors used throughout
// the project, now carrying the full field set from the PLOTIQ SRS
// (Section 4.3): block, development status, amenities, legal/NOC status,
// agent contact, and lat/lng placeholders for a future map view.
//
// Legal/NOC status here is illustrative demo data, not verified fact about
// real developments — the admin panel lets real status be entered once real
// listings replace these. "Developing" sectors (already tagged that way in
// `vibe`) show NOC Pending to make the feature meaningful; everything else
// shows Approved. Always verify with CDA/RDA directly before any real
// transaction — the app says so in the UI too.
const RAW = [
  // residential
  { sector: "DHA Phase 2", block: "Block C", type: "residential", sizes: [5, 7, 10, 14], pricePerMarlaLac: 22, vibe: ["gated", "quiet"], distanceLabel: "20 min from city center", distanceMinutes: 20, devStatus: "developed", amenities: ["school", "mosque", "market"], agent: { name: "Ahmed Raza", phone: "+923001112201", whatsapp: "923001112201" } },
  { sector: "G-13", block: "Block A", type: "residential", sizes: [5, 7], pricePerMarlaLac: 14, vibe: ["affordable"], distanceLabel: "15 min from city center", distanceMinutes: 15, devStatus: "semi-developed", amenities: ["mosque"], agent: { name: "Bilal Khan", phone: "+923001112202", whatsapp: "923001112202" } },
  { sector: "F-11", block: "Block B", type: "residential", sizes: [10, 14, 20], pricePerMarlaLac: 45, vibe: ["central", "gated"], distanceLabel: "5 min from city center", distanceMinutes: 5, devStatus: "developed", amenities: ["school", "hospital", "market", "mosque"], agent: { name: "Sana Malik", phone: "+923001112203", whatsapp: "923001112203" } },
  { sector: "Bahria Town Phase 8", block: "Block D", type: "residential", sizes: [5, 7, 10, 14], pricePerMarlaLac: 16, vibe: ["gated", "affordable"], distanceLabel: "35 min from city center", distanceMinutes: 35, devStatus: "developed", amenities: ["school", "market", "mosque"], agent: { name: "Usman Tariq", phone: "+923001112204", whatsapp: "923001112204" } },
  { sector: "B-17 Multi Gardens", block: "Block E", type: "residential", sizes: [5, 7, 10], pricePerMarlaLac: 11, vibe: ["affordable"], distanceLabel: "30 min from city center", distanceMinutes: 30, devStatus: "undeveloped", amenities: [], agent: { name: "Hassan Iqbal", phone: "+923001112205", whatsapp: "923001112205" } },
  { sector: "E-11", block: "Block F", type: "residential", sizes: [10, 14, 20], pricePerMarlaLac: 38, vibe: ["quiet", "central"], distanceLabel: "10 min from city center", distanceMinutes: 10, devStatus: "developed", amenities: ["school", "hospital", "mosque"], agent: { name: "Ayesha Noor", phone: "+923001112206", whatsapp: "923001112206" } },
  { sector: "Top City-1", block: "Block A", type: "residential", sizes: [5, 7, 10], pricePerMarlaLac: 13, vibe: ["affordable"], distanceLabel: "25 min from city center", distanceMinutes: 25, devStatus: "semi-developed", amenities: ["market"], agent: { name: "Fahad Sheikh", phone: "+923001112207", whatsapp: "923001112207" } },
  { sector: "PWD Housing", block: "Block G", type: "residential", sizes: [5, 7, 10], pricePerMarlaLac: 15, vibe: ["affordable", "quiet"], distanceLabel: "20 min from city center", distanceMinutes: 20, devStatus: "developed", amenities: ["school", "mosque"], agent: { name: "Zara Ahmed", phone: "+923001112208", whatsapp: "923001112208" } },
  // commercial
  { sector: "Blue Area", block: null, type: "commercial", sizes: [3, 5, 7, 10], pricePerMarlaLac: 120, vibe: ["central", "high-traffic", "established"], distanceLabel: "0 min · city center", distanceMinutes: 0, devStatus: "developed", amenities: ["market", "hospital"], agent: { name: "Kamran Aziz", phone: "+923001112209", whatsapp: "923001112209" } },
  { sector: "I-8 Markaz", block: null, type: "commercial", sizes: [3, 5, 7], pricePerMarlaLac: 60, vibe: ["established", "near-residential"], distanceLabel: "12 min from city center", distanceMinutes: 12, devStatus: "developed", amenities: ["market", "mosque"], agent: { name: "Nadia Farooq", phone: "+923001112210", whatsapp: "923001112210" } },
  { sector: "F-10 Markaz", block: null, type: "commercial", sizes: [3, 5], pricePerMarlaLac: 90, vibe: ["central", "established", "high-traffic"], distanceLabel: "8 min from city center", distanceMinutes: 8, devStatus: "developed", amenities: ["market", "hospital", "mosque"], agent: { name: "Waqas Butt", phone: "+923001112211", whatsapp: "923001112211" } },
  { sector: "Bahria Town Commercial", block: "Block D", type: "commercial", sizes: [3, 5, 7], pricePerMarlaLac: 25, vibe: ["near-residential", "affordable"], distanceLabel: "35 min from city center", distanceMinutes: 35, devStatus: "semi-developed", amenities: ["market"], agent: { name: "Usman Tariq", phone: "+923001112204", whatsapp: "923001112204" } },
  // industrial
  { sector: "I-9 Industrial Area", block: null, type: "industrial", sizes: [20, 30, 40], pricePerMarlaLac: 9, vibe: ["established", "utilities", "logistics"], distanceLabel: "18 min from city center", distanceMinutes: 18, devStatus: "developed", amenities: [], agent: { name: "Imran Sattar", phone: "+923001112212", whatsapp: "923001112212" } },
  { sector: "I-10 Industrial Area", block: null, type: "industrial", sizes: [20, 35, 50], pricePerMarlaLac: 10, vibe: ["established", "utilities"], distanceLabel: "20 min from city center", distanceMinutes: 20, devStatus: "developed", amenities: [], agent: { name: "Imran Sattar", phone: "+923001112212", whatsapp: "923001112212" } },
  { sector: "Hattar Economic Zone", block: null, type: "industrial", sizes: [40, 80, 150, 200], pricePerMarlaLac: 4, vibe: ["affordable", "logistics", "utilities"], distanceLabel: "55 min from city center", distanceMinutes: 55, devStatus: "semi-developed", amenities: [], agent: { name: "Rashid Mehmood", phone: "+923001112213", whatsapp: "923001112213" } },
  { sector: "Tarnol Industrial Triangle", block: null, type: "industrial", sizes: [30, 60, 100], pricePerMarlaLac: 6, vibe: ["logistics", "affordable"], distanceLabel: "30 min from city center", distanceMinutes: 30, devStatus: "undeveloped", amenities: [], agent: { name: "Rashid Mehmood", phone: "+923001112213", whatsapp: "923001112213" } },
  // farmhouse
  { sector: "Bani Gala", block: null, type: "farmhouse", sizes: [20, 40, 80], pricePerMarlaLac: 9, vibe: ["quiet", "scenic"], distanceLabel: "25 min from city center", distanceMinutes: 25, devStatus: "undeveloped", amenities: [], agent: { name: "Faisal Chaudhry", phone: "+923001112214", whatsapp: "923001112214" } },
  { sector: "Gulberg Greens", block: "Block B", type: "farmhouse", sizes: [20, 40, 80, 150], pricePerMarlaLac: 12, vibe: ["farmhouse-gated", "quiet"], distanceLabel: "40 min from city center", distanceMinutes: 40, devStatus: "developed", amenities: ["mosque"], agent: { name: "Mariam Yousaf", phone: "+923001112215", whatsapp: "923001112215" } },
  { sector: "Chak Shahzad", block: null, type: "farmhouse", sizes: [10, 20, 40], pricePerMarlaLac: 14, vibe: ["scenic", "quiet"], distanceLabel: "22 min from city center", distanceMinutes: 22, devStatus: "semi-developed", amenities: [], agent: { name: "Faisal Chaudhry", phone: "+923001112214", whatsapp: "923001112214" } },
];

const SEED = RAW.map((p) => ({
  ...p,
  legalStatus: p.vibe.includes("affordable") || p.devStatus === "undeveloped" ? "NOC Pending — verify before purchase" : "CDA Approved · NOC Verified",
  nocApproved: !(p.vibe.includes("affordable") || p.devStatus === "undeveloped"),
}));

module.exports = { SEED };
