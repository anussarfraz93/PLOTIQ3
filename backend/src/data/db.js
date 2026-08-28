// Real persistent database for PLOTIQ — SQLite via Node's built-in
// node:sqlite (no server process, no native compilation, ships with
// Node 22+). Chosen over the SRS's suggested PostgreSQL for this stage:
// same "structured database" requirement, same SQL, far less to keep
// running reliably on this machine. The data-access layer here is the
// only place that knows it's SQLite — swapping to Postgres later means
// rewriting this file, not the routes or scoring logic that use it.
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { SEED } = require("./seed");

const DB_PATH = path.join(__dirname, "plotiq.db");
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS plots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sector TEXT NOT NULL,
    block TEXT,
    type TEXT NOT NULL,
    sizes TEXT NOT NULL,
    price_per_marla_lac REAL NOT NULL,
    vibe TEXT NOT NULL,
    distance_label TEXT NOT NULL,
    distance_minutes INTEGER NOT NULL,
    development_status TEXT,
    amenities TEXT,
    legal_status TEXT,
    noc_approved INTEGER,
    agent_name TEXT,
    agent_phone TEXT,
    agent_whatsapp TEXT,
    image_url TEXT,
    lat REAL,
    lng REAL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

function rowCount() {
  return db.prepare("SELECT COUNT(*) AS n FROM plots").get().n;
}

function seedIfEmpty() {
  if (rowCount() > 0) return;
  const insert = db.prepare(`
    INSERT INTO plots
      (sector, block, type, sizes, price_per_marla_lac, vibe, distance_label, distance_minutes,
       development_status, amenities, legal_status, noc_approved, agent_name, agent_phone, agent_whatsapp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of SEED) {
    insert.run(
      p.sector,
      p.block ?? null,
      p.type,
      JSON.stringify(p.sizes),
      p.pricePerMarlaLac,
      JSON.stringify(p.vibe),
      p.distanceLabel,
      p.distanceMinutes,
      p.devStatus,
      JSON.stringify(p.amenities),
      p.legalStatus,
      p.nocApproved ? 1 : 0,
      p.agent.name,
      p.agent.phone,
      p.agent.whatsapp
    );
  }
  console.log(`Seeded ${SEED.length} plots into ${DB_PATH}`);
}

seedIfEmpty();

// Row shape from SQLite -> the plain object shape the rest of the backend
// (scoring.js, routes) already expects, same field names as before plus
// the new SRS fields.
function toPlot(row) {
  return {
    id: row.id,
    sector: row.sector,
    block: row.block,
    type: row.type,
    sizes: JSON.parse(row.sizes),
    pricePerMarlaLac: row.price_per_marla_lac,
    vibe: JSON.parse(row.vibe),
    distance: row.distance_label,
    distanceMinutes: row.distance_minutes,
    developmentStatus: row.development_status,
    amenities: row.amenities ? JSON.parse(row.amenities) : [],
    legalStatus: row.legal_status,
    nocApproved: !!row.noc_approved,
    agent: { name: row.agent_name, phone: row.agent_phone, whatsapp: row.agent_whatsapp },
    imageUrl: row.image_url,
    lat: row.lat,
    lng: row.lng,
  };
}

function getAllPlots() {
  return db.prepare("SELECT * FROM plots ORDER BY id").all().map(toPlot);
}

function getPlotById(id) {
  const row = db.prepare("SELECT * FROM plots WHERE id = ?").get(id);
  return row ? toPlot(row) : null;
}

function createPlot(p) {
  const insert = db.prepare(`
    INSERT INTO plots
      (sector, block, type, sizes, price_per_marla_lac, vibe, distance_label, distance_minutes,
       development_status, amenities, legal_status, noc_approved, agent_name, agent_phone, agent_whatsapp, image_url, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insert.run(
    p.sector,
    p.block ?? null,
    p.type,
    JSON.stringify(p.sizes ?? []),
    p.pricePerMarlaLac,
    JSON.stringify(p.vibe ?? []),
    p.distance ?? "",
    p.distanceMinutes ?? 0,
    p.developmentStatus ?? null,
    JSON.stringify(p.amenities ?? []),
    p.legalStatus ?? null,
    p.nocApproved ? 1 : 0,
    p.agent?.name ?? null,
    p.agent?.phone ?? null,
    p.agent?.whatsapp ?? null,
    p.imageUrl ?? null,
    p.lat ?? null,
    p.lng ?? null
  );
  return getPlotById(Number(result.lastInsertRowid));
}

function updatePlot(id, p) {
  const existing = getPlotById(id);
  if (!existing) return null;
  const merged = { ...existing, ...p, agent: { ...existing.agent, ...(p.agent ?? {}) } };
  db.prepare(`
    UPDATE plots SET
      sector = ?, block = ?, type = ?, sizes = ?, price_per_marla_lac = ?, vibe = ?,
      distance_label = ?, distance_minutes = ?, development_status = ?, amenities = ?,
      legal_status = ?, noc_approved = ?, agent_name = ?, agent_phone = ?, agent_whatsapp = ?,
      image_url = ?, lat = ?, lng = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    merged.sector,
    merged.block ?? null,
    merged.type,
    JSON.stringify(merged.sizes),
    merged.pricePerMarlaLac,
    JSON.stringify(merged.vibe),
    merged.distance,
    merged.distanceMinutes,
    merged.developmentStatus ?? null,
    JSON.stringify(merged.amenities ?? []),
    merged.legalStatus ?? null,
    merged.nocApproved ? 1 : 0,
    merged.agent?.name ?? null,
    merged.agent?.phone ?? null,
    merged.agent?.whatsapp ?? null,
    merged.imageUrl ?? null,
    merged.lat ?? null,
    merged.lng ?? null,
    id
  );
  return getPlotById(id);
}

function deletePlot(id) {
  const result = db.prepare("DELETE FROM plots WHERE id = ?").run(id);
  return result.changes > 0;
}

module.exports = { db, getAllPlots, getPlotById, createPlot, updatePlot, deletePlot };
