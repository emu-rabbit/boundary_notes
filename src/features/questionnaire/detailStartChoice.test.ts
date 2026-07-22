import { describe, expect, it } from 'vitest';
import { shouldOfferDetailStartChoice } from './detailStartChoice';

describe('detail question start choice', () => {
  it('offers unanswered-only mode for a partially answered other category', () => {
    expect(shouldOfferDetailStartChoice({
      answered: 19,
      total: 20,
    })).toBe(true);
  });

  it('starts all questions directly when other is untouched or complete', () => {
    expect(shouldOfferDetailStartChoice({
      answered: 0,
      total: 20,
    })).toBe(false);
    expect(shouldOfferDetailStartChoice({
      answered: 20,
      total: 20,
    })).toBe(false);
  });

  it('offers the choice for every partially answered category', () => {
    expect(shouldOfferDetailStartChoice({
      answered: 10,
      total: 15,
    })).toBe(true);
  });
});
