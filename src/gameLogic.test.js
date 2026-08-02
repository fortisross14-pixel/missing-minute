import test from 'node:test';
import assert from 'node:assert/strict';
import { canMakeFoghorn, canMakeTongs, combineInventory, START_STATE } from './gameLogic.js';

test('starts with the three office items', () => {
  assert.deepEqual(START_STATE.inventory, ['id-card', 'peppermint', 'complaint']);
  assert.equal(START_STATE.scene, 'office');
});

test('combines both rulers and the rubber band into evidence tongs', () => {
  const inventory = ['short-ruler', 'long-ruler', 'rubber-band', 'id-card'];
  assert.equal(canMakeTongs(inventory), true);
  const result = combineInventory(inventory, 'short-ruler', 'long-ruler');
  assert.equal(result.result, 'tongs');
  assert.deepEqual(result.inventory.sort(), ['id-card', 'tongs'].sort());
});

test('combines the harbor components into the regulation-ish foghorn', () => {
  const inventory = ['glove', 'duck-call', 'funnel', 'watch'];
  assert.equal(canMakeFoghorn(inventory), true);
  const result = combineInventory(inventory, 'glove', 'funnel');
  assert.equal(result.result, 'foghorn');
  assert.deepEqual(result.inventory.sort(), ['foghorn', 'watch'].sort());
});

test('does not combine unrelated inventory objects', () => {
  assert.equal(combineInventory(['peppermint', 'watch'], 'peppermint', 'watch'), null);
});
