# Auto-start scripts

Makes the backend and app web preview start automatically every time you
log into Windows — no need to run `npm run dev` / `npx expo start` by hand.

## How it works

- `start-backend.ps1` / `start-app-web.ps1` — the actual startup logic
  (set PATH, cd into the right folder, run the server). Output/errors go
  to `backend/backend.log` and `app/app.log` respectively, so you can
  check what happened if something doesn't come up.
- `start-backend.bat` / `start-app-web.bat` — thin wrappers that launch the
  `.ps1` scripts hidden (no window popping up on login).
- Copies of the two `.bat` files live in your Windows **Startup folder**
  (`shell:startup` — `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`),
  which Windows runs automatically at every login. This was used instead of
  Task Scheduler because this session didn't have permission to register
  scheduled tasks.

## Servers this starts

- Backend API: `http://localhost:4000` (and the admin panel at
  `http://localhost:4000/admin.html`)
- App web preview: `http://localhost:8090`

## Turning it off

Delete `start-backend.bat` and `start-app-web.bat` from the Startup folder
(open it by pressing Win+R, typing `shell:startup`, Enter) — or just delete
them from here in `scripts/` too if you want to remove the feature
entirely, not just the auto-start.

## If you move the PLOTIQ folder

The scripts have the current folder path (`...\Desktop\PLOTIQ\...`) written
into them directly. If you move the project, update the paths in
`start-backend.bat`, `start-app-web.bat`, and the two `.ps1` files, then
re-copy the `.bat` files into the Startup folder.
