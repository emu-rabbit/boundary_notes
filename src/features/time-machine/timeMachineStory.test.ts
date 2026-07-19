import { describe, expect, it } from 'vitest';
import type { SecretFile, SecretFileScope } from '../secret-file';
import {
  getCalendarDayGap,
  getProfileBranch,
  getScopeBranch,
  orderTimeMachineFiles,
} from './timeMachineStory';

function createFile(
  fileId: string,
  updatedAt: string,
  profileName: string,
  scope: SecretFileScope,
): SecretFile {
  return {
    answers: {},
    createdAt: updatedAt,
    fileId,
    profileName,
    questionBank: { bankVersion: '2026-07-18', schemaVersion: 2 },
    schemaVersion: 2,
    scope,
    spotlight: { active: { selectedQuestionIds: [] }, passive: { selectedQuestionIds: [] } },
    updatedAt,
  };
}

describe('time-machine story branches', () => {
  it('orders the selected files by their actual last-edited time', () => {
    const newer = createFile('newer', '2026-07-18T08:00:00.000Z', '兔子', 'all');
    const older = createFile('older', '2025-07-18T08:00:00.000Z', '兔子', 'activeOnly');

    expect(orderTimeMachineFiles(newer, older)).toEqual({ older, newer });
  });

  it('uses the profile names to choose the name branch', () => {
    const older = createFile('older', '2025-07-18T08:00:00.000Z', '舊名字', 'activeOnly');
    const sameName = createFile('same', '2026-07-18T08:00:00.000Z', '舊名字', 'activeOnly');
    const newName = createFile('new', '2026-07-18T08:00:00.000Z', '新名字', 'activeOnly');

    expect(getProfileBranch({ older, newer: sameName })).toBe('sameProfile');
    expect(getProfileBranch({ older, newer: newName })).toBe('differentProfile');
  });

  it.each([
    ['activeOnly', 'activeOnly', 'sameActive'],
    ['passiveOnly', 'passiveOnly', 'samePassive'],
    ['all', 'all', 'sameAll'],
    ['activeOnly', 'all', 'singleToAll'],
    ['passiveOnly', 'activeOnly', 'singleToSingle'],
    ['all', 'passiveOnly', 'allToSingle'],
  ] as const)('routes %s to %s through %s', (olderScope, newerScope, branch) => {
    const older = createFile('older', '2025-07-18T08:00:00.000Z', '兔子', olderScope);
    const newer = createFile('newer', '2026-07-18T08:00:00.000Z', '兔子', newerScope);

    expect(getScopeBranch({ older, newer })).toBe(branch);
  });

  it('measures the gap between the two local calendar dates', () => {
    const older = createFile('older', '2026-07-10T08:00:00.000Z', '兔子', 'all');
    const newer = createFile('newer', '2026-07-18T08:00:00.000Z', '兔子', 'all');

    expect(getCalendarDayGap({ older, newer })).toBe(8);
  });
});
