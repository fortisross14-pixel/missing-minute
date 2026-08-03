# Mara Quibble Layer Engine v0.3

This package replaces the single foreground image with a scene-owned, data-driven z-order system.

## Where to edit each room

- Office: `src/scenes/office.scene.js`
- Harbor: `src/scenes/harbor.scene.js`

Each file contains:

- room dimensions and camera scale
- walkable area
- perspective scaling
- depth bands for Mara
- every named visual layer
- every hotspot and its walk-to point

## Depth logic

Each room currently uses three actor bands:

| Feet position | Mara z | Result |
|---|---:|---|
| Back path | 10 | Layer 1 and Layer 2 cover Mara |
| Middle path | 30 | Mara covers Layer 1; Layer 2 covers Mara |
| Front path | 50 | Mara covers both prop layers |

Layer 1 props normally use z `20`; Layer 2 props use z `40`.

The actor sprite never changes or gets erased. Only its CSS z-index changes according to the Y coordinate of Mara's feet.

## Live layer editor

Run the game and press **Layers** in the top-right toolbar.

For each named layer you can edit:

- z-order
- x position
- y position
- width
- visibility

The changes save locally in the browser. Press **Export JSON** to download the current room overrides. Copy the final values into the matching room scene file.

## Stateful object sprites

The office demonstrates state-driven visual assets:

- `handle-in-bowl` is hidden after `handleTaken`
- `alarm-broken` is hidden after `alarmRepaired`
- `alarm-repaired` appears after `alarmRepaired`
- `package-in-terminal` disappears after `packageOpened`

The harbor demonstrates:

- the gull disappears after `birdLured`
- `captain-hat-on-dock` appears after `birdLured`
- the hat disappears after `hatTaken`

## Adding a new sprite

1. Put a transparent PNG or SVG under the room's `public/assets/scenes/<room>/props/` folder.
2. Add a named entry to `layers` in the scene file.
3. Set its z-value relative to the actor bands.

Example:

```js
{
  id: 'front-desk-lamp',
  kind: 'sprite',
  asset: 'assets/scenes/office/props/front-desk-lamp.png',
  x: 18,
  y: 62,
  width: 8,
  z: 40
}
```

## Installing over v0.2

The full package is already ready to run. To patch an existing copy, merge/overwrite these paths:

- `src/main.jsx`
- `src/styles.css`
- `src/gameLogic.js`
- `src/sceneEngine/`
- `src/scenes/`
- `public/assets/scenes/`

Then run:

```bash
npm install
npm test
npm run dev
```
