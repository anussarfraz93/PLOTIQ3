# PLOTIQ (Expo / React Native)

A faithful port of `prototype/index.html` (the artifact) into a real
Android/iOS app: same colors, same fonts, same layout, same flows — running
as an installable app instead of a browser tab, talking to a real backend
(with a real database) instead of computing everything inline. Implements
the PLOTIQ SRS's Sections 4.1, 4.2, 4.4, 4.5 (minus map view), 4.8, and 5's
localization requirement.

## Run it — in the browser (fastest way to see it)

```bash
cd app
npm install
npx expo start --web
```

Opens at `http://localhost:8081` (or the next free port). react-native-web
renders the exact same components a phone would get.

## Run it — on your own phone (the real thing)

1. Install **Expo Go** from the Play Store / App Store.
2. `cd app && npx expo start`
3. Scan the QR code Expo prints with the Expo Go app.
4. **Important:** update `LAN_BACKEND` in `src/lib/api.ts` to your
   computer's current LAN IP (find it with `ipconfig`, look for IPv4
   Address) if it's changed, and make sure the backend is running and your
   phone is on the same Wi-Fi network. Without this, the app still works —
   it falls back to computing recommendations on-device.

## Get a real installable app (no dev server, no QR code, no URL)

1. Make a free account at [expo.dev](https://expo.dev) (this step needs to
   be you — account creation isn't something I can do).
2. `npx eas-cli login` — log in with that account (interactive).
3. `npx eas-cli build --platform android --profile preview` — builds a real
   `.apk` on Expo's servers, gives you a download link.
4. Download and install it on your phone. Real app icon, no PC needed after
   that — except to reach the backend, until it's hosted somewhere real.

## Run the backend alongside it

```bash
cd backend
npm install
npm run dev
```

See `backend/README.md` — it now has a real SQLite database, a matching
engine with SRS-specified scoring factors, and an admin panel at
`http://localhost:4000/admin.html`.

## What's ported, and how

- **Colors / fonts**: `src/theme/tokens.ts` — the exact hex values from the
  artifact's CSS, switched by `useColorScheme()`. Fonts via
  `@expo-google-fonts/*` — Fraunces (headings), IBM Plex Sans (body), IBM
  Plex Mono (numbers), Noto Nastaliq Urdu (Urdu text).
- **Icons**: `src/components/Icon.tsx` — every artifact SVG path ported
  1:1 into `react-native-svg`, plus two new ones (phone, whatsapp) for the
  Contact Agent feature, drawn in the same style.
- **Data + scoring**: `src/data/*` and `src/lib/scoring.ts` mirror the
  backend's database and `scoring.js` — same weights, same new SRS 4.4
  factors (development status, NOC clearance), used as an on-device
  fallback when the backend is unreachable.
- **The whole state machine**: `src/state/useAppState.ts` — the four-step
  questionnaire (SRS 4.1/4.2) with per-purpose branching, the
  checkpoint-based Back button, Saved, Compare, and Market Insights.
- **Localization** (SRS Section 5): `src/i18n/` — a full English/Urdu
  toggle (drawer menu), proper Nastaliq-script rendering, not just
  translated strings in the wrong font. Layout stays LTR (icons/rail/drawer
  positions unchanged) even in Urdu — full RTL mirroring risked breaking
  the exact design this is meant to preserve; Urdu text itself renders
  right-to-left and right-aligned correctly.
- **Contact Agent** (SRS 4.8): each match card shows the agent's name with
  Call and WhatsApp buttons (`Linking.openURL` with `tel:`/`wa.me` links) —
  no external service needed, works today.

## What's NOT built yet (see backend/README.md for the full list)

User accounts/login, map view, AI/NLP free-text input — all explicitly
deferred per the SRS's own Section 8 phasing or blocked on an API key that
hasn't been provided.
