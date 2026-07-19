import { describe, expect, it } from 'vitest';
import fourSectionsNewer from '../../../examples/time-machine/01-four-sections-newer.json';
import fourSectionsOlder from '../../../examples/time-machine/01-four-sections-older.json';
import profileScopeNewer from '../../../examples/time-machine/02-profile-scope-newer.json';
import profileScopeOlder from '../../../examples/time-machine/02-profile-scope-older.json';
import timestampOnlyNewer from '../../../examples/time-machine/03-timestamp-only-newer.json';
import timestampOnlyOlder from '../../../examples/time-machine/03-timestamp-only-older.json';
import largeDifferencesNewer from '../../../examples/time-machine/04-large-differences-newer.json';
import largeDifferencesOlder from '../../../examples/time-machine/04-large-differences-older.json';
import { questionBank } from '../question-bank';
import { parseSecretFile } from '../secret-file';
import { compareSecretFiles } from './timeMachineComparison';

const examples = [
  fourSectionsOlder,
  fourSectionsNewer,
  profileScopeOlder,
  profileScopeNewer,
  timestampOnlyOlder,
  timestampOnlyNewer,
  largeDifferencesOlder,
  largeDifferencesNewer,
];

describe('time-machine JSON examples', () => {
  it('keeps every importable example aligned with the current secret-file schema', () => {
    for (const example of examples) {
      expect(parseSecretFile(example).fileId).toBe(example.fileId);
    }
  });

  it('keeps the large-difference pair large enough to exercise every bounded section', () => {
    const older = parseSecretFile(largeDifferencesOlder);
    const newer = parseSecretFile(largeDifferencesNewer);
    const comparison = compareSecretFiles(older, newer, questionBank);

    expect(Object.keys(older.answers)).toHaveLength(36);
    expect(Object.keys(newer.answers)).toHaveLength(36);
    expect(comparison.spotlight.length).toBeGreaterThan(3);
    expect(comparison.category.length).toBeGreaterThan(3);
    expect(comparison.hardNo.length).toBeGreaterThan(3);
    expect(comparison.detail.length).toBeGreaterThan(3);
  });
});
