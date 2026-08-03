export const harborScene = {
  id: 'harbor',
  name: 'Gannet’s End Harbor',
  worldScale: 1.42,
  actor: { asset: 'assets/mara-clean.png' },
  walkArea: { minX: 6, maxX: 94, minY: 65, maxY: 92 },
  perspective: { minY: 65, maxY: 92, minScale: 0.68, maxScale: 1.04 },
  depthBands: [
    { id: 'behind-dock-furniture', minY: 65, maxY: 73.9, actorZ: 10 },
    { id: 'middle-dock', minY: 74, maxY: 84.9, actorZ: 30 },
    { id: 'front-dock', minY: 85, maxY: 92, actorZ: 50 }
  ],
  layers: [
    { id: 'harbor-background', kind: 'background', asset: 'assets/scenes/harbor/background.jpg', fullScene: true, z: 0 },
    { id: 'water-ripples', kind: 'effect', fullScene: true, z: 5, className: 'harbor-ripple-effect' },
    { id: 'boat', kind: 'sprite', asset: 'assets/boat-rock-layer.png', x: 38.6, y: 2.2, width: 22.2, z: 18, className: 'boat-layer' },
    { id: 'mechanical-gull', kind: 'sprite', asset: 'assets/gull-clean.png', x: 25.9, y: 1.7, width: 12.8, z: 24, className: 'gull-layer', hiddenWhen: 'birdLured' },
    { id: 'captain-nib', kind: 'sprite', asset: 'assets/scenes/harbor/props/captain-nib.png', x: 55.2, y: 31.5, width: 18, z: 28, className: 'captain-layer' },
    { id: 'madame-brine', kind: 'sprite', asset: 'assets/scenes/harbor/props/madame-brine.png', x: 76.3, y: 31.5, width: 23.7, z: 18, className: 'brine-layer' },
    { id: 'captain-hat-on-dock', kind: 'sprite', asset: 'assets/scenes/harbor/props/captain-hat.svg', x: 31.4, y: 71, width: 5.8, z: 26, visibleWhen: 'birdLured', hiddenWhen: 'hatTaken' },

    { id: 'middle-dock-posts-layer-1', kind: 'sprite', asset: 'assets/scenes/harbor/props/middle-dock-posts-layer.png', x: 20.1, y: 31.5, width: 27.8, z: 20 },
    { id: 'fish-stall-counter-layer-1', kind: 'sprite', asset: 'assets/scenes/harbor/props/fish-stall-counter-layer.png', x: 71.1, y: 56.9, width: 28.9, z: 20 },
    { id: 'left-rope-crates-layer-2', kind: 'sprite', asset: 'assets/scenes/harbor/props/left-rope-crates-layer.png', x: 0, y: 58.2, width: 36.6, z: 40 },
    { id: 'right-front-crates-layer-2', kind: 'sprite', asset: 'assets/scenes/harbor/props/right-front-crates-layer.png', x: 75.6, y: 72.6, width: 24.4, z: 40 },
    { id: 'rain', kind: 'effect', fullScene: true, z: 70, className: 'rain-layer' },
    { id: 'fog', kind: 'effect', fullScene: true, z: 72, className: 'ambient-fog-layer', opacity: 0.18 }
  ],
  hotspots: [
    { id: 'brine', label: 'Madame Brine', x: 78, y: 33, w: 20, h: 43, walkX: 75, walkY: 80 },
    { id: 'captain', label: 'Captain Nib', x: 59, y: 34, w: 16, h: 48, walkX: 58, walkY: 81 },
    { id: 'bird', label: 'mechanical gull', x: 24, y: 3, w: 15, h: 27, walkX: 31, walkY: 74 },
    { id: 'bucket', label: 'empty fish bucket', x: 24, y: 68, w: 12, h: 18, walkX: 34, walkY: 86 },
    { id: 'fish', label: 'sardines', x: 79, y: 62, w: 16, h: 20, walkX: 75, walkY: 83 },
    { id: 'pump', label: 'broken bilge pump', x: 48, y: 65, w: 10, h: 20, walkX: 49, walkY: 84 },
    { id: 'boat', label: 'The Misty Minnow', x: 39, y: 22, w: 30, h: 54, walkX: 50, walkY: 76 },
    { id: 'lighthouse', label: 'abandoned lighthouse', x: 36, y: 7, w: 9, h: 27, walkX: 43, walkY: 71 },
    { id: 'hat', label: 'ceremonial captain’s hat', x: 31, y: 70, w: 9, h: 12, walkX: 36, walkY: 85, conditional: 'birdLured' },
    { id: 'tavern', label: 'The Rusty Kettle', x: 0, y: 12, w: 17, h: 62, walkX: 17, walkY: 79 }
  ]
};
