import { PLOTS, TYPE_LABEL } from "../data/plots";
import { Answers, Match, Plot } from "../data/types";

// On-device fallback — mirrors backend/src/services/scoring.js exactly
// (including the SRS 4.4 development-status and NOC-clearance factors) so
// results agree whether or not the backend is reachable (see lib/api.ts).
function scorePlot(plot: Plot, answers: Required<Answers>): Match | null {
  if (plot.type !== answers.purpose.value) return null;

  let score = 0;
  const reasons: string[] = [];

  const minSize = Math.min(...plot.sizes);
  const minCost = minSize * plot.pricePerMarlaLac;
  if (minCost > answers.budget.value * 1.2) return null;
  score += Math.max(0, 28 - Math.abs(minCost - answers.budget.value) / 12);

  const [lo, hi] = answers.scale.range;
  const mid = (lo + hi) / 2;
  const bestSize =
    plot.sizes.find((s) => s >= lo && s <= hi) ??
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

  if (plot.developmentStatus === "developed") score += 6;
  else if (plot.developmentStatus === "semi-developed") score += 2;
  if (plot.nocApproved) {
    score += 6;
    reasons.push("CDA approved, NOC verified");
  }

  score += 10;
  return { plot, score, bestSize, reasons, totalCostLac: 0 };
}

export function recommendLocally(answers: Required<Answers>) {
  const results = PLOTS.map((p) => scorePlot(p, answers))
    .filter((r): r is Match => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => ({
      ...r,
      score: Math.min(99, Math.round(r.score)),
      totalCostLac: Number((r.bestSize * r.plot.pricePerMarlaLac).toFixed(0)),
    }));

  return {
    typeLabel: TYPE_LABEL[answers.purpose.value],
    scaleRange: answers.scale.range,
    matches: results,
  };
}

export function insightsLocally() {
  const types = ["residential", "commercial", "industrial", "farmhouse"] as const;
  return types.map((t) => {
    const plots = PLOTS.filter((p) => p.type === t).sort((a, b) => a.pricePerMarlaLac - b.pricePerMarlaLac);
    const avg = plots.reduce((s, p) => s + p.pricePerMarlaLac, 0) / plots.length;
    return {
      type: t,
      typeLabel: TYPE_LABEL[t],
      avgPricePerMarlaLac: Number(avg.toFixed(1)),
      count: plots.length,
      sectors: plots.map((p) => ({ sector: p.sector, pricePerMarlaLac: p.pricePerMarlaLac })),
    };
  });
}
