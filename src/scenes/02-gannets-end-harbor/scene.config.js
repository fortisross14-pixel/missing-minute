import { assetUrl } from '../../game/assetUrl.js';
const A = 'assets/';

export const harborScene = {
  id: '02-gannets-end-harbor',
  name: 'Gannet’s End Harbor',
  world: { width: 2600, height: 1000 },
  start: { x: 340, y: 860 },
  actor: {
    asset: assetUrl(`${A}characters/mara/idle.svg`),
    walkAsset: assetUrl(`${A}characters/mara/walk.svg`),
    width: 195
  },
  camera: { startX: 0, deadZoneLeft: .32, deadZoneRight: .67 },
  perspective: { nearY: 570, farY: 930, nearScale: .74, farScale: 1.06 },
  walkPolygons: [
    [[65, 650], [2470, 650], [2570, 965], [30, 965]],
    [[420, 560], [1840, 560], [1970, 720], [340, 720]]
  ],
  depthZones: [
    { id: 'rear', actorZ: 20, polygon: [[55, 540], [2510, 540], [2470, 680], [80, 680]] },
    { id: 'middle', actorZ: 40, polygon: [[40, 675], [2540, 675], [2550, 825], [35, 825]] },
    { id: 'front', actorZ: 60, polygon: [[25, 820], [2570, 820], [2590, 990], [15, 990]] }
  ],
  background: assetUrl(`${A}scenes/02-gannets-end-harbor/background-flat.svg`),
  layers: [
    { id: 'water-shimmer', kind: 'effect', x: 0, y: 0, w: 2600, h: 1000, z: 5, className: 'water-shimmer', locked: true },
    { id: 'tavern', hotspotId: 'tavern', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/tavern.svg`), x: 20, y: 265, w: 470, h: 430, z: 16 },
    { id: 'lighthouse', hotspotId: 'lighthouse', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/lighthouse.svg`), x: 650, y: 95, w: 185, h: 420, z: 10 },
    { id: 'boat', hotspotId: 'boat', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/boat.svg`), x: 795, y: 300, w: 700, h: 430, z: 22, className: 'boat-rock' },
    { id: 'captain-no-hat', syncGroup: 'captain', hotspotId: 'captain', asset: assetUrl(`${A}characters/nib/no-hat.svg`), x: 1370, y: 390, w: 300, h: 490, z: 42, className: 'npc-breathe', hiddenWhen: 'hatGiven' },
    { id: 'captain-with-hat', syncGroup: 'captain', hotspotId: 'captain', asset: assetUrl(`${A}characters/nib/with-hat.svg`), x: 1370, y: 390, w: 300, h: 490, z: 42, className: 'npc-breathe', visibleWhen: 'hatGiven' },
    { id: 'fish-stall', hotspotId: 'fish', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/fish-stall.svg`), x: 1870, y: 525, w: 650, h: 365, z: 35 },
    { id: 'brine', hotspotId: 'brine', asset: assetUrl(`${A}characters/brine/idle.svg`), x: 1960, y: 365, w: 295, h: 485, z: 43, className: 'npc-breathe' },
    { id: 'sign-up', syncGroup: 'sign', hotspotId: 'sign', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/swordfish-sign-up.svg`), x: 1990, y: 65, w: 470, h: 235, z: 18, hiddenWhen: 'photoShown' },
    { id: 'sign-down', syncGroup: 'sign', hotspotId: 'sign', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/swordfish-sign-down.svg`), x: 2130, y: 525, w: 330, h: 210, z: 46, visibleWhen: 'photoShown' },
    { id: 'gull-with-hat', hotspotId: 'gull', asset: assetUrl(`${A}characters/mechanical-gull/with-hat.svg`), x: 525, y: 145, w: 190, h: 180, z: 24, className: 'gull-idle', hiddenWhen: 'gullLured' },
    { id: 'gull-bucket', asset: assetUrl(`${A}characters/mechanical-gull/in-bucket.svg`), x: 635, y: 650, w: 150, h: 145, z: 37, className: 'bucket-rattle', visibleWhen: 'gullLured', hiddenWhen: 'harborComplete' },
    { id: 'bucket', hotspotId: 'bucket', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/bucket.svg`), x: 620, y: 685, w: 150, h: 125, z: 34, hiddenWhen: 'gullLured' },
    { id: 'hat-on-dock', hotspotId: 'hat', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/captains-hat.svg`), x: 800, y: 690, w: 135, h: 82, z: 39, visibleWhen: 'gullLured', hiddenWhen: 'hatTaken' },
    { id: 'pump-with-funnel', syncGroup: 'pump', hotspotId: 'pump', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/pump-with-funnel.svg`), x: 1080, y: 690, w: 210, h: 170, z: 36, hiddenWhen: 'funnelTaken' },
    { id: 'pump-empty', syncGroup: 'pump', hotspotId: 'pump', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/pump-empty.svg`), x: 1080, y: 690, w: 210, h: 170, z: 36, visibleWhen: 'funnelTaken' },
    { id: 'foreground-crates', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/foreground-crates.svg`), x: 0, y: 745, w: 470, h: 255, z: 70 },
    { id: 'foreground-nets', asset: assetUrl(`${A}scenes/02-gannets-end-harbor/props/foreground-nets.svg`), x: 2260, y: 720, w: 340, h: 280, z: 70 },
    { id: 'rain', kind: 'effect', x: 0, y: 0, w: 2600, h: 1000, z: 75, className: 'rain-effect', locked: true },
    { id: 'fog', kind: 'effect', x: 0, y: 0, w: 2600, h: 1000, z: 76, className: 'fog-effect', locked: true }
  ],
  hotspots: [
    { id: 'tavern', label: 'The Rusty Kettle', x: 10, y: 245, w: 500, h: 480, walk: { x: 480, y: 790 } },
    { id: 'lighthouse', label: 'abandoned lighthouse', x: 625, y: 70, w: 240, h: 475, walk: { x: 750, y: 680 } },
    { id: 'gull', label: 'mechanical gull', x: 490, y: 110, w: 270, h: 260, walk: { x: 650, y: 735 }, hiddenWhen: 'gullLured' },
    { id: 'bucket', label: 'empty fish bucket', x: 585, y: 650, w: 230, h: 205, walk: { x: 700, y: 860 }, hiddenWhen: 'gullLured' },
    { id: 'hat', label: 'ceremonial captain’s hat', x: 765, y: 660, w: 215, h: 150, walk: { x: 880, y: 865 }, visibleWhen: 'gullLured', hiddenWhen: 'hatTaken' },
    { id: 'pump', label: 'broken bilge pump', x: 1040, y: 650, w: 290, h: 250, walk: { x: 1180, y: 870 } },
    { id: 'boat', label: 'The Misty Minnow', x: 775, y: 275, w: 745, h: 485, walk: { x: 1320, y: 790 } },
    { id: 'captain', label: 'Captain Nib', x: 1330, y: 355, w: 380, h: 560, walk: { x: 1320, y: 875 } },
    { id: 'brine', label: 'Madame Brine', x: 1915, y: 330, w: 390, h: 560, walk: { x: 1840, y: 875 } },
    { id: 'fish', label: 'luxury sardines', x: 1840, y: 505, w: 710, h: 410, walk: { x: 1840, y: 900 } },
    { id: 'sign', label: 'hanging swordfish sign', x: 1950, y: 35, w: 540, h: 300, walk: { x: 2050, y: 740 } }
  ]
};
