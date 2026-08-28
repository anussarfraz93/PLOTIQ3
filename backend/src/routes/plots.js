const express = require("express");
const { getAllPlots, getPlotById, createPlot, updatePlot, deletePlot } = require("../data/db");

const router = express.Router();

// SRS 4.7 Admin Panel — add/edit/remove land listings. No auth yet (see
// backend/README.md) — fine for a single-operator local admin page, not
// for a public deployment.

// GET /api/plots — list everything (admin table + potential future public browse)
router.get("/", (req, res) => {
  res.json({ plots: getAllPlots() });
});

// GET /api/plots/:id
router.get("/:id", (req, res) => {
  const plot = getPlotById(Number(req.params.id));
  if (!plot) return res.status(404).json({ error: "not_found" });
  res.json({ plot });
});

// POST /api/plots — create
router.post("/", (req, res) => {
  const body = req.body || {};
  if (!body.sector || !body.type || !Array.isArray(body.sizes) || typeof body.pricePerMarlaLac !== "number") {
    return res.status(400).json({ error: "invalid_request", message: "Required: sector, type, sizes[], pricePerMarlaLac" });
  }
  const plot = createPlot(body);
  res.status(201).json({ plot });
});

// PUT /api/plots/:id — update (partial)
router.put("/:id", (req, res) => {
  const plot = updatePlot(Number(req.params.id), req.body || {});
  if (!plot) return res.status(404).json({ error: "not_found" });
  res.json({ plot });
});

// DELETE /api/plots/:id
router.delete("/:id", (req, res) => {
  const ok = deletePlot(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "not_found" });
  res.json({ ok: true });
});

module.exports = router;
