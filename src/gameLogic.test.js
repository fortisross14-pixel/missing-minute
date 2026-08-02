import { describe, expect, it } from 'vitest';
import { combineInventory, canMakeTongs, canMakeFoghorn } from './gameLogic';

describe('inventory puzzle recipes', () => {
  it('builds evidence tongs when all three office components exist', () => {
    const inventory = ['short-ruler', 'long-ruler', 'rubber-band', 'peppermint'];
    expect(canMakeTongs(inventory)).toBe(true);
    const result = combineInventory(inventory, 'short-ruler', 'rubber-band');
    expect(result.result).toBe('tongs');
    expect(result.inventory).toContain('tongs');
    expect(result.inventory).not.toContain('short-ruler');
  });

  it('builds the foghorn from the harbor components', () => {
    const inventory = ['glove', 'duck-call', 'funnel', 'watch'];
    expect(canMakeFoghorn(inventory)).toBe(true);
    const result = combineInventory(inventory, 'glove', 'funnel');
    expect(result.result).toBe('foghorn');
    expect(result.inventory).toContain('foghorn');
  });

  it('rejects unrelated combinations', () => {
    expect(combineInventory(['watch', 'peppermint'], 'watch', 'peppermint')).toBeNull();
  });
});
