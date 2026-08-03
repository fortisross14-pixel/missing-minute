export const officeScene = {
  id: 'office',
  name: 'Department of Lost Causes',
  worldScale: 1.22,
  actor: { asset: 'assets/mara-clean.png' },
  walkArea: { minX: 7, maxX: 93, minY: 65, maxY: 91 },
  perspective: { minY: 65, maxY: 91, minScale: 0.72, maxScale: 1.03 },
  depthBands: [
    { id: 'behind-layer-1-and-2', minY: 65, maxY: 72.9, actorZ: 10 },
    { id: 'between-layer-1-and-2', minY: 73, maxY: 82.9, actorZ: 30 },
    { id: 'in-front-of-all', minY: 83, maxY: 91, actorZ: 50 }
  ],
  layers: [
    { id: 'office-background', kind: 'background', asset: 'assets/scenes/office/background.jpg', fullScene: true, z: 0 },
    { id: 'clock-hand', kind: 'sprite', asset: 'assets/scenes/office/props/clock-hand.svg', x: 55.15, y: 10.6, width: 0.35, height: 9, z: 4, className: 'clock-hand-layer' },
    { id: 'pindle', kind: 'sprite', asset: 'assets/scenes/office/props/pindle.png', x: 9.1, y: 31.5, width: 16.4, z: 12, className: 'pindle-layer' },
    { id: 'package-in-terminal', kind: 'sprite', asset: 'assets/scenes/office/props/package.svg', x: 27.2, y: 64.3, width: 5.2, z: 8, hiddenWhen: 'packageOpened', className: 'package-layer' },

    { id: 'center-shelf-layer-1', kind: 'sprite', asset: 'assets/scenes/office/props/center-shelf-layer.png', x: 34.4, y: 37.1, width: 24.6, z: 20 },
    { id: 'fishbowl-furniture-layer-1', kind: 'sprite', asset: 'assets/scenes/office/props/fishbowl-furniture-layer.png', x: 64.1, y: 52.3, width: 18.4, z: 20 },
    { id: 'handle-in-bowl', kind: 'sprite', asset: 'assets/scenes/office/props/handle-in-bowl.svg', x: 71.25, y: 66.2, width: 2.7, z: 22, hiddenWhen: 'handleTaken' },
    { id: 'alarm-broken', kind: 'sprite', asset: 'assets/scenes/office/props/alarm-broken.svg', x: 66.2, y: 33.4, width: 4.3, z: 22, hiddenWhen: 'alarmRepaired' },
    { id: 'alarm-repaired', kind: 'sprite', asset: 'assets/scenes/office/props/alarm-repaired.svg', x: 66.2, y: 33.4, width: 4.3, z: 22, visibleWhen: 'alarmRepaired' },

    { id: 'left-desk-layer-2', kind: 'sprite', asset: 'assets/scenes/office/props/left-desk-layer.png', x: 0, y: 53.1, width: 38.1, z: 40 },
    { id: 'right-newsstand-layer-2', kind: 'sprite', asset: 'assets/scenes/office/props/right-newsstand-layer.png', x: 78.1, y: 60.9, width: 21.9, z: 40 },
    { id: 'screen-rain-dust', kind: 'effect', fullScene: true, z: 70, className: 'office-dust-effect', opacity: 0.25 }
  ],
  hotspots: [
    { id: 'pindle', label: 'Mr. Pindle', x: 17, y: 37, w: 19, h: 29, walkX: 28, walkY: 78 },
    { id: 'terminal', label: 'pneumatic terminal', x: 22, y: 66, w: 16, h: 20, walkX: 31, walkY: 82 },
    { id: 'poster', label: 'emergency procedure', x: 35, y: 18, w: 9, h: 28, walkX: 40, walkY: 72 },
    { id: 'clock', label: 'official municipal clock', x: 50, y: 2, w: 14, h: 24, walkX: 55, walkY: 70 },
    { id: 'door', label: 'staff-only door', x: 51, y: 28, w: 12, h: 47, walkX: 55, walkY: 73 },
    { id: 'fishbowl', label: 'Mr. Ledger’s fishbowl', x: 66, y: 44, w: 14, h: 31, walkX: 69, walkY: 78 },
    { id: 'alarm', label: 'fire alarm', x: 65, y: 31, w: 7, h: 18, walkX: 68, walkY: 72 },
    { id: 'shelf', label: 'lost-property shelf', x: 79, y: 33, w: 20, h: 48, walkX: 81, walkY: 78 },
    { id: 'forms', label: 'complaint forms', x: 1, y: 65, w: 19, h: 25, walkX: 22, walkY: 86 },
    { id: 'map', label: 'city map', x: 72, y: 2, w: 23, h: 37, walkX: 73, walkY: 70 },
    { id: 'lamp', label: 'desk lamp', x: 17, y: 63, w: 10, h: 15, walkX: 26, walkY: 82 }
  ]
};
