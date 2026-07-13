import { describe, expect, it } from 'vitest';
import { createSecretFile } from '../domain/secretFile';
import type { QuestionDefinition, SecretFile } from '../domain/types';
import {
  InvalidSecretFileJsonError,
  parseSecretFile,
  parseSecretFileJson,
  SecretFileValidationError,
} from './secretFileSchema';

const questions: readonly QuestionDefinition[] = [
  { id: 'detail.impact.hand.active', level: 'detail', role: 'active' },
];

function createValidSecretFile(): SecretFile {
  return createSecretFile({
    bankSchemaVersion: 1,
    bankVersion: '2026-07-08',
    createdAt: '2026-07-10T06:00:00.000Z',
    fileId: 'local_test-file-1234',
    profileName: '兔子',
    questions,
    scope: 'all',
  });
}

describe('secret-file runtime validation', () => {
  it('accepts the current portable secret-file schema', () => {
    expect(parseSecretFile(createValidSecretFile())).toEqual(createValidSecretFile());
  });

  it('migrates the legacy shared spotlight pool into separate directional pools', () => {
    const current = createValidSecretFile();
    const legacy = {
      ...current,
      schemaVersion: 1,
      spotlight: {
        selectedQuestionIds: [
          'category.impact.active',
          'detail.impact.hand.passive',
          'detail.impact.hand.active',
        ],
      },
    };

    expect(parseSecretFile(legacy).spotlight).toEqual({
      active: {
        selectedQuestionIds: ['category.impact.active', 'detail.impact.hand.active'],
      },
      passive: {
        selectedQuestionIds: ['detail.impact.hand.passive'],
      },
    });
  });

  it('rejects spotlight entries stored in the wrong directional pool', () => {
    const secretFile = createValidSecretFile();
    secretFile.spotlight.active.selectedQuestionIds = ['detail.impact.hand.passive'];

    expect(() => parseSecretFile(secretFile)).toThrow(SecretFileValidationError);
  });

  it('rejects notes that could display links or unsafe control characters', () => {
    const secretFile = createValidSecretFile();
    secretFile.answers['detail.impact.hand.active'] = {
      experience: 'some',
      note: 'https://example.com',
      preference: 'neutral',
      state: 'answered',
    };

    expect(() => parseSecretFile(secretFile)).toThrow(SecretFileValidationError);

    secretFile.answers['detail.impact.hand.active'] = {
      experience: 'some',
      note: '[網站](example.test)',
      preference: 'neutral',
      state: 'answered',
    };

    expect(() => parseSecretFile(secretFile)).toThrow(SecretFileValidationError);

    secretFile.answers['detail.impact.hand.active'] = {
      experience: 'some',
      note: '第一行\n第二行',
      preference: 'neutral',
      state: 'answered',
    };

    expect(() => parseSecretFile(secretFile)).toThrow(SecretFileValidationError);
  });

  it('rejects unrecognized schema versions before persistence or import', () => {
    const futureSecretFile = { ...createValidSecretFile(), schemaVersion: 3 };

    expect(() => parseSecretFile(futureSecretFile)).toThrow('schemaVersion (3)');
  });

  it('parses a JSON string through the same runtime validation boundary', () => {
    const secretFile = createValidSecretFile();

    expect(parseSecretFileJson(JSON.stringify(secretFile))).toEqual(secretFile);
    expect(() => parseSecretFileJson('{ invalid')).toThrow(InvalidSecretFileJsonError);
    expect(() => parseSecretFileJson('{"schemaVersion":1}')).toThrow(SecretFileValidationError);
  });
});
