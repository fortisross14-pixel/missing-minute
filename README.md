# Mara Quibble and the Missing Minute — POC

A two-room point-and-click adventure proof of concept built with Vite and React.

## Included

- Department of Lost Causes opening room
- Gannet's End Harbor room
- Click-to-walk character movement
- Animated rain, mechanical gull, ferry rocking, fog, clock and parcel
- Six classic verbs and an inventory-combination system
- Complete opening and harbor puzzle chains
- Dialogue choices, hints, synthesized sound effects and local autosave
- Responsive desktop, tablet and mobile layout
- GitHub Pages deployment workflow

## Run locally

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run build
```

The production site is generated in `dist/`.

## Deploy to Vercel

Import the repository. Vercel should detect Vite automatically.

- Build command: `npm run build`
- Output directory: `dist`

## Deploy to GitHub Pages

1. Push the project to GitHub.
2. Open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. Push to `main`. The included workflow builds and deploys the site.

`vite.config.js` uses `base: './'`, so the package works from a project subdirectory as well as a root domain.

## Art note

The POC uses the visual plates created during concept development and layers interactive characters, props, animation and hotspots above them. The architecture intentionally keeps scene art in `public/assets`, so future clean background plates and multi-frame sprite sheets can replace these assets without rewriting the puzzle engine.
