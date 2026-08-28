const express = require("express");
const { recommend } = require("../services/scoring");

const router = express.Router();

// POST /api/recommend
// body: { purpose: {value, tag, label}, scale: {range:[lo,hi], label}, budget: {value, label}, vibe: {tag, label} }
router.post("/", (req, res) => {
  const { purpose, scale, budget, vibe } = req.body || {};

  if (!purpose || !purpose.value || !scale || !Array.isArray(scale.range) || !budget || typeof budget.value !== "number" || !vibe || !vibe.tag) {
    return res.status(400).json({
      error: "invalid_request",
      message: "Expected { purpose:{value,tag,label}, scale:{range:[lo,hi],label}, budget:{value,label}, vibe:{tag,label} }",
    });
  }

  const result = recommend({ purpose, scale, budget, vibe });
  res.json(result);
});

module.exports = router;
