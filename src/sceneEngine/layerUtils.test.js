import test from 'node:test';
import assert from 'node:assert/strict';
import { actorDepthFor, clampToWalkArea, conditionMatches } from './layerUtils.js';

const scene = {
  walkArea: { minX: 10, maxX: 90, minY: 60, maxY: 92 },
  depthBands: [
    { id: 'back', minY: 60, maxY: 70, actorZ: 10 },
    { id: 'middle', minY: 70.1, maxY: 82, actorZ: 30 },
    { id: 'front', minY: 82.1, maxY: 92, actorZ: 50 }
  ]
};

test('actor depth changes with the feet position', () => {
  assert.equal(actorDepthFor(scene, 65).actorZ, 10);
  assert.equal(actorDepthFor(scene, 78).actorZ, 30);
  assert.equal(actorDepthFor(scene, 88).actorZ, 50);
});

test('walk destinations stay inside the room walk area', () => {
  assert.deepEqual(clampToWalkArea(scene, -20, 120), { x: 10, y: 92 });
});

test('layer state conditions use game flags', () => {
  assert.equal(conditionMatches('handleTaken', { handleTaken: true }), true);
  assert.equal(conditionMatches({ not: 'handleTaken' }, { handleTaken: true }), false);
});
