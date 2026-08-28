const path = require("node:path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const recommendRoute = require("./routes/recommend");
const insightsRoute = require("./routes/insights");
const plotsRoute = require("./routes/plots");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "plotiq-backend" }));
app.use("/api/recommend", recommendRoute);
app.use("/api/insights", insightsRoute);
app.use("/api/plots", plotsRoute);

// SRS 4.7 — minimal admin panel: a single static page that talks to the
// /api/plots CRUD routes above. No login (see README) — anyone who can
// reach this server can use it, same as a local dev tool.
app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res) => res.status(404).json({ error: "not_found" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PLOTIQ backend listening on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
