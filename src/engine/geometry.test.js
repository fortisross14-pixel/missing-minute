import test from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon, clampToPolygons, resolveDepth } from './geometry.js';

test('point in polygon', () => {
  const box = [[0,0],[10,0],[10,10],[0,10]];
  assert.equal(pointInPolygon({x:5,y:5}, box), true);
  assert.equal(pointInPolygon({x:15,y:5}, box), false);
});

test('clamps to walk polygon', () => {
  const box = [[0,0],[10,0],[10,10],[0,10]];
  const p = clampToPolygons({x:15,y:5}, [box]);
  assert.equal(Math.round(p.x), 10);
});

test('depth uses matching polygon', () => {
  const scene = { depthZones: [
    { id:'back', actorZ:20, polygon:[[0,0],[10,0],[10,5],[0,5]] },
    { id:'front', actorZ:60, polygon:[[0,5],[10,5],[10,10],[0,10]] }
  ]};
  assert.equal(resolveDepth(scene, {x:5,y:8}).id, 'front');
});
