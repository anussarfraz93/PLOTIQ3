const { TYPE_LABEL } = require("../data/plots");
const { getAllPlots } = require("../data/db");

// Ported from prototype/index.html's scorePlot() and extended per the SRS
// Section 4.4 scoring factors: budget fit, size fit, location/vibe match
// (existing), plus development status and legal/NOC clearance (new).
function scorePlot(plot, answers) {
  if (plot.type !== answers.purpose.value) return null;

  let score = 0;
  const reasons = [];

  const minSize = Math.min(...plot.sizes);
  const minCost = minSize * plot.pricePerMarlaLac;
  if (minCost > answers.budget.value * 1.2) return null;
  score += Math.max(0, 28 - Math.abs(minCost - answers.budget.value) / 12);

  const [lo, hi] = answers.scale.range;
  const mid = (lo + hi) / 2;
  const bestSize =
    plot.sizes.find((s) => s >= lo && s <= hi) ||
    plot.sizes.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  const sizeDelta = Math.min(...plot.sizes.map((s) => Math.abs(s - mid)));
  score += Math.max(0, 27 - sizeDelta / 2);
  if (plot.sizes.some((s) => s >= lo && s <= hi)) reasons.push(`has ${bestSize}-Marla plots in your scale`);

  if (plot.vibe.includes(answers.vibe.tag)) {
    score += 25;
    reasons.push(`matches "${answers.vibe.label}"`);
  }

  if (answers.purpose.tag === "investment" && plot.vibe.includes("affordable")) {
    score += 10;
    reasons.push("developing area, strong resale upside");
  }
  if (answers.purpose.tag === "business" && plot.vibe.includes("high-traffic")) {
    score += 10;
    reasons.push("high footfall for business");
  }
  if (answers.purpose.tag === "weekend" && plot.vibe.includes("scenic")) {
    score += 10;
    reasons.push("scenic weekend setting");
  }
  if (answers.purpose.tag === "production" && plot.vibe.includes("logistics")) {
    score += 10;
    reasons.push("strong logistics access");
  }

  // SRS 4.4: development status and legal/NOC clearance as scoring factors
  if (plot.developmentStatus === "developed") {
    score += 6;
  } else if (plot.developmentStatus === "semi-developed") {
    score += 2;
  }
  if (plot.nocApproved) {
    score += 6;
    reasons.push("CDA approved, NOC verified");
  }

  score += 10;
  return { plot, score, bestSize, reasons };
}

function recommend(answers) {
  const results = getAllPlots()
    .map((p) => scorePlot(p, answers))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => ({
      plot: r.plot,
      score: Math.min(99, Math.round(r.score)),
      bestSize: r.bestSize,
      reasons: r.reasons,
      totalCostLac: Number((r.bestSize * r.plot.pricePerMarlaLac).toFixed(0)),
    }));

  return {
    typeLabel: TYPE_LABEL[answers.purpose.value],
    scaleRange: answers.scale.range,
    matches: results,
  };
}

// Ported from renderInsightsView() — average price/Marla and the sorted
// sector list per land type, computed live from the database.
function insights() {
  const all = getAllPlots();
  const types = ["residential", "commercial", "industrial", "farmhouse"];
  return types.map((t) => {
    const plots = all.filter((p) => p.type === t).sort((a, b) => a.pricePerMarlaLac - b.pricePerMarlaLac);
    const avg = plots.length ? plots.reduce((s, p) => s + p.pricePerMarlaLac, 0) / plots.length : 0;
    return {
      type: t,
      typeLabel: TYPE_LABEL[t],
      avgPricePerMarlaLac: Number(avg.toFixed(1)),
      count: plots.length,
      sectors: plots.map((p) => ({ sector: p.sector, pricePerMarlaLac: p.pricePerMarlaLac })),
    };
  });
}

module.exports = { scorePlot, recommend, insights };
