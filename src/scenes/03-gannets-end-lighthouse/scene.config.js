import { assetUrl } from '../../game/assetUrl.js';
const A = 'assets/';

export const lighthouseScene = {
  id: '03-gannets-end-lighthouse',
  name: 'Gannet’s End Lighthouse',
  world: { width: 3000, height: 1000 },
  start: { x: 300, y: 850 },
  actor: {
    asset: assetUrl(`${A}characters/mara/idle.svg`),
    walkAsset: assetUrl(`${A}characters/mara/walk.svg`),
    width: 195
  },
  camera: { startX: 0, deadZoneLeft: .31, deadZoneRight: .67 },
  perspective: { nearY: 585, farY: 940, nearScale: .75, farScale: 1.06 },
  walkPolygons: [
    [[40, 650], [2940, 650], [2980, 975], [20, 975]],
    [[300, 560], [2740, 560], [2850, 725], [220, 725]]
  ],
  depthZones: [
    { id: 'rear', actorZ: 20, polygon: [[35, 545], [2960, 545], [2940, 690], [50, 690]] },
    { id: 'middle', actorZ: 40, polygon: [[25, 685], [2970, 685], [2970, 830], [25, 830]] },
    { id: 'front', actorZ: 60, polygon: [[15, 825], [2985, 825], [2995, 995], [10, 995]] }
  ],
  background: assetUrl(`${A}scenes/03-gannets-end-lighthouse/background-flat.svg`),
  layers: [
    { id: 'sea-shimmer', kind: 'effect', x: 0, y: 0, w: 3000, h: 1000, z: 4, className: 'water-shimmer', locked: true },
    { id: 'misty-minnow', hotspotId: 'boat', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/misty-minnow.svg`), x: 20, y: 470, w: 520, h: 330, z: 28, className: 'boat-rock' },
    { id: 'captain-nib', hotspotId: 'captain', asset: assetUrl(`${A}characters/nib/with-hat.svg`), x: 430, y: 430, w: 265, h: 440, z: 42, className: 'npc-breathe' },
    { id: 'service-door-locked', syncGroup: 'service-door', hotspotId: 'service-door', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/service-door-locked.svg`), x: 820, y: 275, w: 360, h: 535, z: 24, hiddenWhen: 'lighthouseUnlocked' },
    { id: 'service-door-open', syncGroup: 'service-door', hotspotId: 'service-door', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/service-door-open.svg`), x: 820, y: 275, w: 360, h: 535, z: 24, visibleWhen: 'lighthouseUnlocked' },
    { id: 'department-crate-closed', syncGroup: 'lighthouse-crate', hotspotId: 'crate', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/department-crate-closed.svg`), x: 1260, y: 630, w: 330, h: 235, z: 38, visibleWhen: 'lighthouseUnlocked', hiddenWhen: 'crateOpened' },
    { id: 'department-crate-open', syncGroup: 'lighthouse-crate', hotspotId: 'crate', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/department-crate-open.svg`), x: 1260, y: 590, w: 330, h: 275, z: 38, visibleWhen: 'crateOpened' },
    { id: 'shipping-ledger', hotspotId: 'ledger', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/shipping-ledger.svg`), x: 1585, y: 570, w: 250, h: 185, z: 36, visibleWhen: 'lighthouseUnlocked' },
    { id: 'frequency-board', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/frequency-board.svg`), x: 1750, y: 230, w: 340, h: 225, z: 18, visibleWhen: 'manifestRead' },
    { id: 'beacon-empty', syncGroup: 'beacon', hotspotId: 'beacon', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/beacon-empty.svg`), x: 2140, y: 170, w: 500, h: 560, z: 26, visibleWhen: 'lighthouseUnlocked', hiddenWhen: 'prismInstalled' },
    { id: 'beacon-prism-installed', syncGroup: 'beacon', hotspotId: 'beacon', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/beacon-prism-installed.svg`), x: 2140, y: 170, w: 500, h: 560, z: 26, visibleWhen: 'prismInstalled' },
    { id: 'beacon-controls', hotspotId: 'controls', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/beacon-controls.svg`), x: 1940, y: 650, w: 420, h: 245, z: 43, visibleWhen: 'lighthouseUnlocked' },
    { id: 'beacon-glow', kind: 'effect', x: 2210, y: 120, w: 650, h: 560, z: 72, className: 'beacon-glow', visibleWhen: 'shipRevealed', locked: true },
    { id: 'never-was', hotspotId: 'ship', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/never-was-fog.svg`), x: 2510, y: 250, w: 450, h: 390, z: 14, visibleWhen: 'shipRevealed', className: 'ship-emerge' },
    { id: 'foreground-rocks', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/foreground-rocks.svg`), x: 0, y: 760, w: 780, h: 240, z: 70 },
    { id: 'foreground-machinery', asset: assetUrl(`${A}scenes/03-gannets-end-lighthouse/props/foreground-machinery.svg`), x: 2440, y: 735, w: 560, h: 265, z: 70 },
    { id: 'rain', kind: 'effect', x: 0, y: 0, w: 3000, h: 1000, z: 75, className: 'rain-effect', locked: true },
    { id: 'fog', kind: 'effect', x: 0, y: 0, w: 3000, h: 1000, z: 76, className: 'fog-effect lighthouse-fog', hiddenWhen: 'shipRevealed', locked: true }
  ],
  hotspots: [
    { id: 'boat', label: 'The Misty Minnow', x: 0, y: 430, w: 570, h: 400, walk: { x: 430, y: 845 } },
    { id: 'captain', label: 'Captain Nib', x: 390, y: 390, w: 345, h: 510, walk: { x: 760, y: 870 } },
    { id: 'service-door', label: 'lighthouse service door', x: 790, y: 245, w: 420, h: 595, walk: { x: 1040, y: 870 } },
    { id: 'crate', label: 'Department shipping crate', x: 1220, y: 560, w: 420, h: 330, walk: { x: 1450, y: 890 }, visibleWhen: 'lighthouseUnlocked' },
    { id: 'ledger', label: 'shipping ledger', x: 1545, y: 520, w: 330, h: 260, walk: { x: 1710, y: 875 }, visibleWhen: 'lighthouseUnlocked' },
    { id: 'beacon', label: 'lighthouse beacon assembly', x: 2100, y: 130, w: 580, h: 640, walk: { x: 2240, y: 870 }, visibleWhen: 'lighthouseUnlocked' },
    { id: 'controls', label: 'beacon control console', x: 1900, y: 610, w: 500, h: 315, walk: { x: 2030, y: 900 }, visibleWhen: 'lighthouseUnlocked' },
    { id: 'ship', label: 'The Never Was', x: 2470, y: 210, w: 510, h: 460, walk: { x: 2650, y: 840 }, visibleWhen: 'shipRevealed' }
  ]
};
