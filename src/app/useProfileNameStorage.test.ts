import { describe, expect, it } from 'vitest';
import { getProfileEntryRoute } from './useProfileNameStorage';

describe('getProfileEntryRoute', () => {
  it('sends a returning visitor with a profile name to the home page', () => {
    expect(getProfileEntryRoute('兔子')).toBe('home');
  });

  it('sends a visitor without a profile name to the story introduction', () => {
    expect(getProfileEntryRoute('   ')).toBe('story');
  });
});
