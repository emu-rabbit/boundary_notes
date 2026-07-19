import { describe, expect, it } from 'vitest';
import {
  findCategoryVisualUrl,
  getCategoryVisualUrl,
} from './categoryVisuals';

describe('category visual lookup', () => {
  it('returns the mapped asset for a current category', () => {
    const visualUrl = findCategoryVisualUrl('impact_spanking');

    expect(visualUrl).toBeTruthy();
    expect(getCategoryVisualUrl('impact_spanking')).toBe(visualUrl);
  });

  it('allows historical unknown categories to be skipped safely', () => {
    expect(findCategoryVisualUrl('retired_historical_category')).toBeNull();
    expect(() => getCategoryVisualUrl('retired_historical_category')).toThrow(
      'Missing category visual for retired_historical_category.',
    );
  });
});
