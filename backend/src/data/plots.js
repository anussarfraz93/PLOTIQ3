// Plot records themselves now live in the SQLite database (db.js) —
// this file just keeps the one small constant shared across scoring,
// routes, and the admin page.
const TYPE_LABEL = { residential: "Residential", commercial: "Commercial", industrial: "Industrial", farmhouse: "Farmhouse" };

module.exports = { TYPE_LABEL };
