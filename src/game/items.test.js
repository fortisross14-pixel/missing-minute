import test from 'node:test';
import assert from 'node:assert/strict';
import { recipeFor } from './items.js';

test('ruler recipe is order independent', () => {
  assert.equal(recipeFor('short-ruler','long-ruler').create, 'ruler-pair');
  assert.equal(recipeFor('long-ruler','short-ruler').create, 'ruler-pair');
});

test('foghorn can be completed from partial combination', () => {
  assert.equal(recipeFor('amplified-duck-call','rubber-glove').create, 'foghorn');
});
