# Incremental scene patching

The project is designed so future requests can be delivered as small additive patches.

## Existing scene package pattern

```text
src/scenes/03-lighthouse-exterior/
  scene.config.js
  scene.logic.js
  scene.dialogue.js

public/assets/scenes/03-lighthouse-exterior/
  background.svg
  layers/
  props/
```

A normal new-scene patch changes only:

```text
src/scenes/03-lighthouse-exterior/**
public/assets/scenes/03-lighthouse-exterior/**
src/scenes/index.js
src/game/items.js                 # only when new inventory items are added
public/assets/inventory/**         # only new item sprites
```

Shared engine files should change only when a scene genuinely requires a new reusable capability.

## Layer rules

- Background: static architecture only.
- Z 5–15: wall decorations and rear scenery.
- Z 20: actor behind normal furniture.
- Z 25–35: middle furniture and NPCs.
- Z 40: actor between middle and foreground layers.
- Z 45–55: counters, hull fronts, posts and other occluders.
- Z 60: actor in front of normal scenery.
- Z 70+: extreme foreground and atmosphere.

The Mara sprite is never modified to simulate occlusion. Her feet determine the active depth polygon and therefore her z-index.

## Stateful art

Any object that moves, disappears or changes must have separate assets or separate state layers. Example:

```js
{ id:'alarm-broken', hiddenWhen:'alarmRepaired', ... }
{ id:'alarm-repaired', visibleWhen:'alarmRepaired', ... }
```

Do not paint pickable items permanently into the background.
