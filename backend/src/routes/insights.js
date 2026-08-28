const express = require("express");
const { insights } = require("../services/scoring");
const { getAllPlots } = require("../data/db");

const router = express.Router();

// GET /api/insights
router.get("/", (req, res) => {
  res.json({ totalSectors: getAllPlots().length, byType: insights() });
});

module.exports = router;
