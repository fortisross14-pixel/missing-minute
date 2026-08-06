import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { officeScene } from './01-department-office/scene.config.js';
import { harborScene } from './02-gannets-end-harbor/scene.config.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function assetPath(url) {
  const clean = String(url).replace(/^\.\//, '').replace(/^\//, '');
  return path.join(projectRoot, 'public', clean);
}

function validateScene(scene, requiredHotspots) {
  assert.ok(scene.background, `${scene.id} has a background`);
  assert.ok(scene.actor?.asset, `${scene.id} has an actor asset`);
  assert.ok(scene.layers.length >= 10, `${scene.id} has calibrated visual layers`);
  assert.ok(scene.hotspots.length >= requiredHotspots.length, `${scene.id} has interactive hotspots`);
  const hotspotIds = new Set(scene.hotspots.map((entry) => entry.id));
  requiredHotspots.forEach((id) => assert.ok(hotspotIds.has(id), `${scene.id} includes hotspot ${id}`));

  const assets = [scene.background, scene.actor.asset, scene.actor.walkAsset, ...scene.layers.map((entry) => entry.asset).filter(Boolean)];
  assets.forEach((asset) => {
    assert.match(asset, /\.svg$/, `${asset} stays lightweight and editable`);
    assert.ok(existsSync(assetPath(asset)), `asset exists: ${asset}`);
  });
}

test('office scene has all puzzle-critical schematic objects', () => {
  validateScene(officeScene, ['pindle', 'terminal', 'poster', 'clock', 'alarm', 'rulers', 'handle', 'fishbowl', 'gus', 'map-exit']);
});

test('harbor scene has all puzzle-critical schematic objects', () => {
  validateScene(harborScene, ['captain', 'brine', 'gull', 'bucket', 'hat', 'pump', 'boat', 'lighthouse', 'fish', 'sign']);
});
