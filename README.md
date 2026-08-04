# Mara Quibble and the Missing Minute — Foundation Build v1.0

This is the first stable production baseline for the point-and-click adventure.

Included:

- Shared Vite/React adventure engine.
- Scrollable scenes with logical 2400–2900 px worlds.
- Walk polygons, perspective scaling and polygon-based actor depth.
- Clean vector background plates with no characters or stateful props baked in.
- Individually named transparent vector layers and stateful object sprites.
- Live scene-layer editor with JSON export.
- Six illustrated action-button sprites.
- Twenty-four illustrated inventory sprites.
- Dialogue trees, Mara thoughts, objectives and pickup popups.
- Complete Office and Gannet’s End Harbor puzzle chains.
- Local autosave, responsive controls and GitHub Pages/Vercel configuration.

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm test
npm run build
```

## Controls

1. Choose an action.
2. Click a room hotspot.
3. Click an inventory item to select it; the game changes to **Use** automatically.
4. Click a second inventory item to combine them.
5. Double-click an inventory item to examine or operate it directly.
6. Choose **Give** before giving an item to a character.

Use **Layers** to edit each room’s asset positions and z-order live. Use **Show hotspots** when tuning walk targets and interaction bounds.
