import { assetUrl } from '../../game/assetUrl.js';
const A = 'assets/';

export const officeScene = {
  id: '01-department-office',
  name: 'Department of Lost Causes',
  world: { width: 4096, height: 1152 },
  start: { x: 1710, y: 1020 },
  actor: {
    asset: assetUrl(`${A}characters/mara/idle.svg`),
    walkAsset: assetUrl(`${A}characters/mara/walk.svg`),
    width: 210
  },
  camera: { startX: 420, deadZoneLeft: .35, deadZoneRight: .62 },
  perspective: { nearY: 690, farY: 1100, nearScale: .78, farScale: 1.08 },
  walkPolygons: [
    [[80, 760], [4010, 760], [4060, 1135], [35, 1135]],
    [[760, 665], [3160, 665], [3290, 825], [690, 825]]
  ],
  depthZones: [
    { id: 'rear', actorZ: 20, polygon: [[55, 660], [4040, 660], [4010, 830], [90, 830]] },
    { id: 'middle', actorZ: 40, polygon: [[40, 825], [4050, 825], [4050, 975], [40, 975]] },
    { id: 'front', actorZ: 60, polygon: [[25, 970], [4065, 970], [4065, 1148], [25, 1148]] }
  ],
  background: assetUrl(`${A}scenes/01-department-office/background-flat.svg`),
  artSlots: {
    background: 'assets/scenes/01-department-office/final/background.png',
    actor: 'assets/characters/mara/final/scene-01-idle.png',
    layers: {
      pindle: 'assets/characters/pindle/final/scene-01-idle.png',
      gus: 'assets/characters/gus/final/scene-01-folded.png',
      desk: 'assets/scenes/01-department-office/final/desk.png',
      forms: 'assets/scenes/01-department-office/final/forms.png',
      rulers: 'assets/scenes/01-department-office/final/rulers.png',
      terminal: 'assets/scenes/01-department-office/final/terminal.png',
      parcel: 'assets/scenes/01-department-office/final/parcel.png',
      poster: 'assets/scenes/01-department-office/final/emergency-poster.png',
      'clock-normal': 'assets/scenes/01-department-office/final/clock-normal.png',
      'clock-tomorrow': 'assets/scenes/01-department-office/final/clock-tomorrow.png',
      fishbowl: 'assets/scenes/01-department-office/final/fishbowl.png',
      handle: 'assets/scenes/01-department-office/final/alarm-handle.png',
      'alarm-broken': 'assets/scenes/01-department-office/final/alarm-broken.png',
      'alarm-repaired': 'assets/scenes/01-department-office/final/alarm-repaired.png',
      'lost-shelf': 'assets/scenes/01-department-office/final/lost-shelf.png',
      'city-map': 'assets/scenes/01-department-office/final/city-map.png'
    }
  },
  layers: [
    { id: 'office-window-rain', kind: 'effect', x: 0, y: 0, w: 4096, h: 1152, z: 4, className: 'office-window-rain', locked: true },
    { id: 'desk', hotspotId: 'desk', asset: assetUrl(`${A}scenes/01-department-office/props/desk.svg`), x: 25, y: 735, w: 790, h: 345, z: 48 },
    { id: 'forms', hotspotId: 'forms', asset: assetUrl(`${A}scenes/01-department-office/props/forms.svg`), x: 100, y: 815, w: 245, h: 120, z: 52 },
    { id: 'rulers', hotspotId: 'rulers', asset: assetUrl(`${A}scenes/01-department-office/props/rulers.svg`), x: 365, y: 860, w: 270, h: 74, z: 53, hiddenWhen: 'rulersTaken' },
    { id: 'pindle', hotspotId: 'pindle', asset: assetUrl(`${A}characters/pindle/idle.svg`), x: 185, y: 415, w: 430, h: 470, z: 34, className: 'npc-breathe' },
    { id: 'terminal', hotspotId: 'terminal', asset: assetUrl(`${A}scenes/01-department-office/props/terminal.svg`), x: 1030, y: 345, w: 355, h: 485, z: 30 },
    { id: 'parcel', asset: assetUrl(`${A}scenes/01-department-office/props/parcel.svg`), x: 1110, y: 650, w: 190, h: 120, z: 35, visibleWhen: 'drillTriggered', hiddenWhen: 'packageOpened' },
    { id: 'poster', hotspotId: 'poster', asset: assetUrl(`${A}scenes/01-department-office/props/emergency-poster.svg`), x: 1460, y: 170, w: 305, h: 245, z: 12 },
    { id: 'clock-normal', syncGroup: 'clock', hotspotId: 'clock', asset: assetUrl(`${A}scenes/01-department-office/props/clock-normal.svg`), x: 2050, y: 78, w: 270, h: 270, z: 12, hiddenWhen: 'drillTriggered' },
    { id: 'clock-tomorrow', syncGroup: 'clock', hotspotId: 'clock', asset: assetUrl(`${A}scenes/01-department-office/props/clock-tomorrow.svg`), x: 2050, y: 78, w: 270, h: 270, z: 12, visibleWhen: 'drillTriggered' },
    { id: 'official-date-board', kind: 'split-flap-date', hotspotId: 'calendar', x: 2335, y: 105, w: 360, h: 255, z: 12, baseDate: '1934-10-14', advanceFlag: 'drillTriggered', advanceDays: 1, baseStatus: 'TODAY', advancedStatus: 'TOMORROW' },
    { id: 'fishbowl', hotspotId: 'fishbowl', asset: assetUrl(`${A}scenes/01-department-office/props/fishbowl.svg`), x: 2500, y: 500, w: 420, h: 535, z: 35 },
    { id: 'handle', hotspotId: 'handle', asset: assetUrl(`${A}scenes/01-department-office/props/alarm-handle.svg`), x: 2675, y: 765, w: 75, h: 90, z: 38, hiddenWhen: 'handleTaken' },
    { id: 'alarm-broken', syncGroup: 'alarm', hotspotId: 'alarm', asset: assetUrl(`${A}scenes/01-department-office/props/alarm-broken.svg`), x: 2970, y: 225, w: 135, h: 210, z: 15, hiddenWhen: 'alarmRepaired' },
    { id: 'alarm-repaired', syncGroup: 'alarm', hotspotId: 'alarm', asset: assetUrl(`${A}scenes/01-department-office/props/alarm-repaired.svg`), x: 2970, y: 225, w: 135, h: 210, z: 15, visibleWhen: 'alarmRepaired' },
    { id: 'lost-shelf', hotspotId: 'shelf', asset: assetUrl(`${A}scenes/01-department-office/props/lost-shelf.svg`), x: 3260, y: 305, w: 680, h: 760, z: 33 },
    { id: 'gus', hotspotId: 'gus', asset: assetUrl(`${A}characters/gus/folded.svg`), x: 3525, y: 570, w: 150, h: 360, z: 39, hiddenWhen: 'gusTaken' },
    { id: 'city-map', hotspotId: 'map-exit', asset: assetUrl(`${A}scenes/01-department-office/props/city-map.svg`), x: 3370, y: 75, w: 470, h: 300, z: 11 },
    { id: 'emergency-flash', kind: 'effect', x: 0, y: 0, w: 4096, h: 1152, z: 74, className: 'emergency-flash', visibleWhen: 'drillTriggered', locked: true }
  ],
  hotspots: [
    { id: 'pindle', label: 'Mr. Pindle', x: 145, y: 380, w: 520, h: 530, walk: { x: 760, y: 920 } },
    { id: 'terminal', label: 'pneumatic delivery terminal', x: 1010, y: 330, w: 395, h: 520, walk: { x: 1230, y: 930 } },
    { id: 'poster', label: 'emergency continuity procedure', x: 1450, y: 150, w: 330, h: 285, walk: { x: 1585, y: 805 } },
    { id: 'clock', label: 'official municipal clock', x: 2025, y: 55, w: 320, h: 315, walk: { x: 2200, y: 835 } },
    { id: 'calendar', label: 'split-flap official date board', x: 2315, y: 85, w: 400, h: 295, walk: { x: 2470, y: 835 } },
    { id: 'alarm', label: 'fire alarm', x: 2945, y: 200, w: 185, h: 255, walk: { x: 3010, y: 925 } },
    { id: 'rulers', label: 'matched ruler pair', x: 340, y: 835, w: 315, h: 115, walk: { x: 730, y: 1005 }, hiddenWhen: 'rulersTaken' },
    { id: 'handle', label: 'missing fire-alarm handle', x: 2640, y: 725, w: 145, h: 155, walk: { x: 2690, y: 1000 }, hiddenWhen: 'handleTaken' },
    { id: 'fishbowl', label: 'Mr. Ledger’s fishbowl', x: 2480, y: 485, w: 455, h: 570, walk: { x: 2670, y: 1010 } },
    { id: 'gus', label: 'disapproving umbrella', x: 3485, y: 535, w: 225, h: 415, walk: { x: 3400, y: 1010 }, hiddenWhen: 'gusTaken' },
    { id: 'shelf', label: 'lost-property shelf', x: 3235, y: 285, w: 720, h: 800, walk: { x: 3500, y: 1010 } },
    { id: 'map-exit', label: 'route to Gannet’s End Harbor', x: 3340, y: 50, w: 530, h: 350, walk: { x: 3330, y: 920 }, visibleWhen: 'officeComplete' },
    { id: 'forms', label: 'complaint form stack', x: 70, y: 790, w: 310, h: 180, walk: { x: 650, y: 1000 } },
    { id: 'desk', label: 'Mara’s desk', x: 20, y: 715, w: 820, h: 380, walk: { x: 875, y: 1010 } }
  ]
};
