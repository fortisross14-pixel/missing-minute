# Scene layering

Each room owns its layer order in one readable file:

- `office.scene.js`
- `harbor.scene.js`

A layer is a named sprite with an asset, position and z-value. The player receives a dynamic z-value from `depthBands` based on the Y coordinate of her feet.

Office example:

- actor z 10: behind layer 1 and layer 2
- actor z 30: between layer 1 and layer 2
- actor z 50: in front of both
- layer 1 objects use z 20
- layer 2 objects use z 40

Interactive state sprites use `visibleWhen` and `hiddenWhen`. For example, `handle-in-bowl` disappears when `flags.handleTaken` becomes true, while `alarm-broken` swaps to `alarm-repaired` when `flags.alarmRepaired` becomes true.

Open the in-game **Layers** panel to move assets and change z-order live. Export the resulting JSON and copy the final values into the scene file.
