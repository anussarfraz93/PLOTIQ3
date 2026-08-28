// English → Urdu lookup for every static UI string in the app, plus
// small template functions for strings with interpolated values (counts,
// prices, ranges). English strings (from src/data/*) are the lookup keys,
// so the data files stay the single source of truth and don't need a
// separate key system.

export type Lang = "en" | "ur";

export const STRINGS: Record<string, string> = {
  // Topbar / footer / drawer
  "LAND INTELLIGENCE · ISLAMABAD": "لینڈ انٹیلیجنس · اسلام آباد",
  "PLOTIQ Advisor · matches scored against Islamabad plot data": "PLOTIQ مشیر · اسلام آباد پلاٹ ڈیٹا کے مطابق اسکور کیے گئے",
  "Menu": "مینو",
  "Everything PLOTIQ can do": "PLOTIQ کی تمام خصوصیات",
  "New search": "نئی تلاش",
  "Saved plots": "محفوظ شدہ پلاٹس",
  "Market insights": "مارکیٹ کی معلومات",
  "Compare plots": "پلاٹس کا موازنہ",
  "Find land for a house": "گھر کے لیے زمین تلاش کریں",
  "Find land for a factory": "فیکٹری کے لیے زمین تلاش کریں",
  "Find land for a shop": "دکان کے لیے زمین تلاش کریں",
  "Find land for a farmhouse": "فارم ہاؤس کے لیے زمین تلاش کریں",
  "PLOTIQ · rule-based demo logic": "PLOTIQ · اصول پر مبنی ڈیمو منطق",
  "Admin Panel": "ایڈمن پینل",

  // Rail / nav accessibility labels
  "Land Finder": "لینڈ فائنڈر",
  "Saved Plots": "محفوظ پلاٹس",
  "Market Insights": "مارکیٹ کی معلومات",
  "Compare Plots": "پلاٹس کا موازنہ",
  "Back": "پیچھے",
  "Home": "ہوم",
  "Close menu": "مینو بند کریں",
  "Save plot": "پلاٹ محفوظ کریں",
  "Remove from saved": "محفوظ سے ہٹائیں",

  // Purpose step
  "Salam! I'm PLOTIQ 🧭. Tell me what you're building and I'll match you to the right land in Islamabad.":
    "السلام علیکم! میں PLOTIQ ہوں 🧭۔ بتائیں آپ کیا تعمیر کر رہے ہیں اور میں آپ کو اسلام آباد میں صحیح زمین بتاؤں گا۔",
  "A family home": "رہائشی گھر",
  "To live in": "رہنے کے لیے",
  "Rental / investment": "کرایہ / سرمایہ کاری",
  "Residential resale": "رہائشی دوبارہ فروخت",
  "A shop or plaza": "دکان یا پلازہ",
  "Retail / commercial": "ریٹیل / تجارتی",
  "A factory": "فیکٹری",
  "Industrial facility": "صنعتی سہولت",
  "A farmhouse": "فارم ہاؤس",
  "Weekend / estate": "ویک اینڈ / اسٹیٹ",

  // Scale step — residential
  "How many people will the house need to hold?": "گھر میں کتنے افراد رہیں گے؟",
  "Just me / a couple": "میں اکیلا / جوڑا",
  "1–2 people": "1–2 افراد",
  "Small family": "چھوٹا خاندان",
  "3–4 people": "3–4 افراد",
  "Large family": "بڑا خاندان",
  "5–7 people": "5–7 افراد",
  "Joint family": "مشترکہ خاندان",
  "8+ people": "8+ افراد",

  // Scale step — commercial
  "What scale of commercial space are you planning?": "آپ کس پیمانے کی تجارتی جگہ چاہتے ہیں؟",
  "Kiosk / small shop": "کیوسک / چھوٹی دکان",
  "Single unit": "ایک یونٹ",
  "Showroom": "شو روم",
  "Mid-size retail": "درمیانہ ریٹیل",
  "Retail plaza": "ریٹیل پلازہ",
  "Multi-unit": "متعدد یونٹس",
  "Commercial plaza": "تجارتی پلازہ",
  "Multi-story": "کثیر المنزلہ",

  // Scale step — industrial
  "What scale of factory or industrial unit do you need?": "آپ کو کس پیمانے کی فیکٹری یا صنعتی یونٹ چاہیے؟",
  "Small workshop": "چھوٹی ورکشاپ",
  "Light manufacturing": "ہلکی صنعت",
  "Medium factory": "درمیانی فیکٹری",
  "Full production line": "مکمل پیداواری لائن",
  "Large plant": "بڑا پلانٹ",
  "Heavy industry": "بھاری صنعت",
  "Logistics hub": "لاجسٹکس ہب",
  "Warehousing / mega unit": "گودام / بڑی یونٹ",

  // Scale step — farmhouse
  "What scale of farmhouse are you picturing?": "آپ کس طرح کا فارم ہاؤس چاہتے ہیں؟",
  "Weekend getaway": "ویک اینڈ گیٹ وے",
  "Small retreat": "چھوٹا ریٹریٹ",
  "Family farmhouse": "خاندانی فارم ہاؤس",
  "Regular use": "باقاعدہ استعمال",
  "Estate farmhouse": "اسٹیٹ فارم ہاؤس",
  "Large grounds": "بڑا رقبہ",
  "Large estate": "بڑی اسٹیٹ",
  "Working land": "زرعی زمین",

  // Budget step
  "What's your budget for the plot itself, roughly?": "پلاٹ کے لیے آپ کا تخمینی بجٹ کیا ہے؟",
  "Under 1.5 crore": "1.5 کروڑ سے کم",
  "Entry level": "ابتدائی سطح",
  "1.5 – 3 crore": "1.5 – 3 کروڑ",
  "Mid range": "درمیانی رینج",
  "3 – 6 crore": "3 – 6 کروڑ",
  "Premium": "پریمیم",
  "6 – 12 crore": "6 – 12 کروڑ",
  "High end": "اعلیٰ سطح",

  // Vibe step
  "Any preference on location or vibe?": "مقام یا ماحول کے بارے میں کوئی ترجیح؟",
  "Close to city center": "شہر کے مرکز کے قریب",
  "Gated, family-friendly": "گیٹڈ، خاندان دوست",
  "Quiet, green, peaceful": "پرسکون، سرسبز، خاموش",
  "Affordable, developing": "سستا، ترقی پذیر",
  "High footfall, central": "زیادہ رش، مرکزی",
  "Established business hub": "قائم شدہ کاروباری مرکز",
  "Near residential catchment": "رہائشی علاقے کے قریب",
  "Highway / logistics access": "ہائی وے / لاجسٹکس رسائی",
  "Established industrial zone": "قائم شدہ صنعتی زون",
  "Utilities ready": "سہولیات دستیاب",
  "Scenic, riverside views": "خوبصورت، دریا کنارے کا منظر",
  "Gated farmhouse community": "گیٹڈ فارم ہاؤس کمیونٹی",

  // Recommendation flow
  "Crunching that against Islamabad land data...": "اسلام آباد کے زمین کے ڈیٹا کے ساتھ حساب لگایا جا رہا ہے...",
  "I couldn't find a plot matching all your criteria — try a higher budget or a different vibe.":
    "آپ کی تمام شرائط پر پورا اترنے والا پلاٹ نہیں ملا — زیادہ بجٹ یا مختلف ماحول آزمائیں۔",

  // Type labels
  "Residential": "رہائشی",
  "Commercial": "تجارتی",
  "Industrial": "صنعتی",
  "Farmhouse": "فارم ہاؤس",

  // Card rows / badges
  "Recommended size": "تجویز کردہ رقبہ",
  "Est. price": "تخمینی قیمت",
  "Why": "وجہ",
  "Size": "رقبہ",
  "Price/Marla": "قیمت فی مرلہ",
  "Total price": "کل قیمت",
  "Top Match": "بہترین مماثلت",
  "Match": "مماثلت",
  "Best price": "بہترین قیمت",
  "Closest": "قریب ترین",

  // Contact agent (SRS 4.8)
  "Contact Agent": "ایجنٹ سے رابطہ کریں",
  "Call": "کال کریں",
  "WhatsApp": "واٹس ایپ",
  "Legal status": "قانونی حیثیت",
  "Development": "ترقیاتی حیثیت",
  "Amenities nearby": "قریبی سہولیات",
  "CDA Approved · NOC Verified": "سی ڈی اے منظور شدہ · این او سی تصدیق شدہ",
  "NOC Pending — verify before purchase": "این او سی زیر التوا — خریداری سے پہلے تصدیق کریں",
  "developed": "تیار شدہ",
  "semi-developed": "نیم ترقی یافتہ",
  "undeveloped": "غیر ترقی یافتہ",
  "possession-available": "قبضہ دستیاب",
  "school": "اسکول",
  "hospital": "ہسپتال",
  "mosque": "مسجد",
  "market": "بازار",

  // Saved / Compare / Insights
  "No saved plots yet": "ابھی تک کوئی محفوظ پلاٹ نہیں",
  "Bookmark a match from the land finder and it'll show up here.": "لینڈ فائنڈر سے کوئی پلاٹ بک مارک کریں، یہ یہاں نظر آئے گا۔",
  "Save 2+ plots to compare": "موازنے کے لیے 2+ پلاٹس محفوظ کریں",
  "You haven't saved any plots yet.": "آپ نے ابھی تک کوئی پلاٹ محفوظ نہیں کیا۔",
  "You've saved 1 — save at least one more.": "آپ نے 1 محفوظ کیا ہے — کم از کم ایک اور محفوظ کریں۔",
  "Bookmark plots from the Land Finder, then come back here.": "لینڈ فائنڈر سے پلاٹس بک مارک کریں، پھر یہاں واپس آئیں۔",
  "Average price per Marla, by land type": "زمین کی قسم کے مطابق فی مرلہ اوسط قیمت",

  // Toasts
  "Saved to your list": "آپ کی فہرست میں محفوظ ہو گیا",
  "Removed from saved": "محفوظ شدہ سے ہٹا دیا گیا",
  "You're already at the start": "آپ پہلے ہی شروع میں ہیں",

  // Language toggle
  "English": "English",
  "Urdu": "اردو",
};

export function t(lang: Lang, text: string): string {
  if (lang === "en") return text;
  return STRINGS[text] ?? text;
}

// ---- templated strings (interpolated values can't be plain lookups) ----

export function tResultsIntro(lang: Lang, typeLabel: string, lo: number, hi: number): string {
  if (lang === "en") return `You need a ${typeLabel} plot, roughly ${lo}-${hi} Marla. Here are your best matches:`;
  return `آپ کو ایک ${typeLabel} پلاٹ چاہیے، تقریباً ${lo}-${hi} مرلہ۔ یہ ہیں آپ کے بہترین مطابقت رکھنے والے پلاٹس:`;
}

export function tMatchBadge(lang: Lang, label: string, pct: number): string {
  if (lang === "en") return `${label} · ${pct}% fit`;
  return `${label} · ${pct}% موزوں`;
}

export function tSavedCount(lang: Lang, n: number): string {
  if (lang === "en") return `${n} plot${n > 1 ? "s" : ""} bookmarked on this device`;
  return `${n} پلاٹ اس ڈیوائس پر محفوظ ہیں`;
}

export function tCompareCount(lang: Lang, n: number): string {
  if (lang === "en") return `${n} saved plots, cheapest first`;
  return `${n} محفوظ پلاٹس، سب سے سستا پہلے`;
}

export function tInsightsIntro(lang: Lang, n: number): string {
  if (lang === "en")
    return `Computed live from PLOTIQ's ${n} tracked Islamabad sectors. Use this to sanity-check a budget before you search.`;
  return `PLOTIQ کے ${n} ٹریک شدہ اسلام آباد سیکٹرز سے لائیو حساب کیا گیا۔ تلاش سے پہلے بجٹ کا اندازہ لگانے کے لیے استعمال کریں۔`;
}

export function tSectorsTracked(lang: Lang, n: number): string {
  if (lang === "en") return `${n} sector${n > 1 ? "s" : ""} tracked — this average`;
  return `${n} سیکٹرز ٹریک کیے گئے — یہ اوسط`;
}

export function tAvgPrice(lang: Lang, avg: string): string {
  if (lang === "en") return `~${avg} lac/Marla`;
  return `~${avg} لاکھ/مرلہ`;
}

export function tMarla(lang: Lang, size: number): string {
  return lang === "en" ? `${size} Marla` : `${size} مرلہ`;
}

export function tEstPrice(lang: Lang, pricePerMarla: number, totalCostLac: number): string {
  if (lang === "en") return `~${pricePerMarla} lac/Marla (${totalCostLac} lac total)`;
  return `~${pricePerMarla} لاکھ/مرلہ (کل ${totalCostLac} لاکھ)`;
}
