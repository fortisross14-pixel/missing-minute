# Mara Quibble and the Missing Minute — Layered POC v0.2

A two-room point-and-click adventure proof of concept built with Vite and React.

## What changed in this revision

- Rebuilt the interface with illustrated wooden/brass verb buttons.
- Replaced the placeholder inventory icons with individual illustrated item sprites.
- Added item-acquisition cards such as **YOU PICKED UP: SHORT RULER** and **YOU MADE: REGULATION-ISH FOGHORN**.
- Separated room rendering into background, environmental repair/decor, actor/prop, foreground occlusion and weather layers.
- Replaced the harbor boat with a transparent independent vector sprite.
- Cleaned Mara and the mechanical gull into transparent actor/prop images so they no longer carry rectangular scenery while moving.
- Added wide-room camera scrolling that follows Mara.
- Added a cinematic opening, richer first-room conversations, Mara's objective thoughts, full Captain Nib and Madame Brine dialogue trees and a longer departure cutscene.
- Reworked the GitHub workflow and package scripts to avoid the recurring `vite: Permission denied` issue.

## Included gameplay

- Department of Lost Causes opening chapter.
- Gannet's End Harbor chapter.
- Click-to-walk movement with a following camera.
- Animated rain, mechanical gull, ferry rocking, fog, clock and parcel.
- Six classic verbs and inventory combinations.
- Complete office and harbor puzzle chains.
- Dialogue choices, cinematic sequences, hints, synthesized sound and local autosave.
- Responsive desktop, tablet and mobile interface.

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

The production output is generated in `dist/`.

## Deploy to Vercel

Import the repository into Vercel. The included `vercel.json` uses:

- Build command: `npm run build`
- Output directory: `dist`

## Deploy to GitHub Pages

1. Push the project to GitHub.
2. Open **Settings → Pages**.
3. Select **GitHub Actions** as the source.
4. Push to `main`.

The included workflow installs dependencies, runs the dependency-free Node tests, builds the Vite project and deploys `dist/`.

## Art and scene architecture

Each room is assembled as multiple independent layers:

1. Base painted background.
2. Background repair/decor layer.
3. Animated props.
4. Mara and other actor sprites.
5. Foreground occlusion layer.
6. Rain, fog and cinematic overlays.
7. Hotspots and interface.

This structure allows future larger backgrounds, proper walk-cycle sheets and additional occlusion masks without rewriting the puzzle logic.
