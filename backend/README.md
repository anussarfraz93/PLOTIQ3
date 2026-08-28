# PLOTIQ backend

Express API that scores Islamabad plots against a user's answers, backed by
a real SQLite database — implements Sections 4.3, 4.4, and 4.7 of the
PLOTIQ SRS (land database, matching engine, admin panel).

## Run it

```bash
cd backend
npm install
npm run dev
```

Starts on `http://localhost:4000`. The database file (`src/data/plotiq.db`)
is created and seeded automatically on first run — nothing else to set up.

## Endpoints

- `GET /health` — liveness check.
- `POST /api/recommend` — body `{ purpose, scale, budget, vibe }` (see
  `src/routes/recommend.js` for the exact shape) → top 3 ranked matches.
- `GET /api/insights` — average price/Marla and sector breakdown per land
  type.
- `GET /api/plots`, `GET /api/plots/:id`, `POST /api/plots`,
  `PUT /api/plots/:id`, `DELETE /api/plots/:id` — full CRUD on listings.
- `GET /admin.html` — the admin panel (add/edit/delete listings through a
  form, backed by the routes above).

## Why SQLite, not the PostgreSQL the SRS suggested

Same "structured database" requirement (Section 4.3), same SQL, but no
server process to install, configure, or keep running — it's Node's
built-in `node:sqlite` module (Node 22+), a single file on disk. The
data-access layer (`src/data/db.js`) is the only place that knows it's
SQLite; moving to Postgres later means rewriting that one file, not the
routes or scoring logic. Worth revisiting once there's a real hosting target
and concurrent-write needs that justify a server-based database (Section 5,
scalability).

## What's NOT built yet (see the SRS's own Phase 2 list)

- **User accounts / login** — the SRS's Section 8 MVP scope explicitly
  defers this. Saved/Compare stay device-local in the app.
- **Map view** — needs a Google Maps or Mapbox API key that hasn't been
  provided. `lat`/`lng` columns exist in the schema, ready for it.
- **AI/NLP free-text input** — optional per the SRS, needs an LLM API key
  (same open item discussed earlier in this project for a real Claude API
  integration).
- **Admin auth** — `/admin.html` has no login. Fine for local/single-operator
  use; add auth before exposing this publicly.
- **Web scraping / portal partnerships** — the SRS flags this as legally
  risky (most portals' ToS prohibit scraping). Listings are manually seeded
  (`src/data/seed.js`) or entered via the admin panel — the SRS's
  recommended safer path.

## Legal/NOC data disclaimer

The seeded `legalStatus`/`nocApproved` values are illustrative demo data,
not verified research into real developments' actual legal status. Replace
them with real, verified information (or leave genuinely unverified ones
marked "Pending") before this is ever used for a real decision — the SRS
(Section 6) flags this as a major real trust factor for actual users.
