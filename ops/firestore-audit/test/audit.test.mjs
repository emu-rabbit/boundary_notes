import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeAuditData, createSafeReport } from '../src/audit.mjs';
import { parseArgs } from '../src/cli.mjs';

const now = new Date('2026-07-20T12:00:00.000Z');

test('requires the explicit production project', () => {
  assert.throws(() => parseArgs([]), /--project is required/);
  assert.throws(
    () => parseArgs(['--project', 'boundary-notes-staging']),
    /only allows --project boundary-notes-prod/,
  );
  assert.deepEqual(parseArgs(['--project', 'boundary-notes-prod', '--json']), {
    databaseId: '(default)',
    includeProfileNames: false,
    json: true,
    projectId: 'boundary-notes-prod',
  });
});

test('summarizes successful uploads and flags near-limit source activity', () => {
  const metadataRecords = [
    {
      shareId: 'share-1',
      appId: 'web-app',
      createdAt: new Date('2026-07-20T11:50:00.000Z'),
      payloadBytes: 1000,
      sourceFingerprintHash: 'fingerprint-a',
      sourceHash: 'source-a-long-hash',
    },
    {
      shareId: 'share-2',
      appId: 'web-app',
      createdAt: new Date('2026-07-20T11:40:00.000Z'),
      payloadBytes: 2000,
      sourceFingerprintHash: 'fingerprint-a',
      sourceHash: 'source-a-long-hash',
    },
    {
      shareId: 'share-3',
      appId: 'web-app',
      createdAt: new Date('2026-07-20T11:30:00.000Z'),
      payloadBytes: 3000,
      sourceFingerprintHash: 'fingerprint-b',
      sourceHash: 'source-a-long-hash',
    },
    {
      shareId: 'share-4',
      appId: 'web-app',
      createdAt: new Date('2026-07-20T11:20:00.000Z'),
      payloadBytes: 4000,
      sourceFingerprintHash: 'fingerprint-c',
      sourceHash: 'source-a-long-hash',
    },
  ];
  const profileNamesByShareId = new Map([
    ['share-1', '月兔'],
    ['share-2', '月兔'],
    ['share-3', '星兔'],
    ['share-4', '雲兔'],
  ]);

  const result = analyzeAuditData({ metadataRecords, profileNamesByShareId, now });

  assert.equal(result.status, 'attention');
  assert.equal(result.recentSuccessfulUploads.lastHour, 4);
  assert.equal(result.sources.uniqueSourceHashes, 1);
  assert.equal(result.sources.uniqueFingerprintHashes, 3);
  assert.deepEqual(result.sources.top[0].signals, [
    'near-hourly-limit',
    'multiple-profile-names',
    'multiple-client-fingerprints',
  ]);
  assert.equal(result.sources.top[0].payloadBytes, 10000);
});

test('reports collection mismatches and hides raw profile names by default', () => {
  const analysis = analyzeAuditData({
    metadataRecords: [
      {
        shareId: 'share-1',
        appId: 'web-app',
        createdAt: new Date('2026-07-19T12:00:00.000Z'),
        payloadBytes: 1000,
        sourceFingerprintHash: 'fingerprint-a',
        sourceHash: 'source-a',
      },
      {
        shareId: 'metadata-only',
        appId: 'unknown',
        createdAt: null,
        payloadBytes: 1000,
        sourceFingerprintHash: null,
        sourceHash: null,
      },
    ],
    profileNamesByShareId: new Map([
      ['share-1', '月兔'],
      ['shared-only', '星兔'],
    ]),
    now,
  });
  const safe = createSafeReport(analysis);
  const raw = createSafeReport(analysis, { includeProfileNames: true });

  assert.equal(analysis.totals.sharedWithoutMetadata, 1);
  assert.equal(analysis.totals.metadataWithoutShared, 1);
  assert.equal(analysis.dataQuality.invalidCreatedAt, 1);
  assert.equal(analysis.dataQuality.unknownAppId, 1);
  assert.deepEqual(safe.sources.top.find((source) => source.source === 'source-a').profiles, ['profile-1']);
  assert.deepEqual(raw.sources.top.find((source) => source.source === 'source-a').profiles, ['月兔']);
});

test('finds non-default profile names reused across approximate sources', () => {
  const analysis = analyzeAuditData({
    metadataRecords: [
      {
        shareId: 'share-1', appId: 'web-app', createdAt: now, payloadBytes: 1,
        sourceFingerprintHash: 'fingerprint-a', sourceHash: 'source-a',
      },
      {
        shareId: 'share-2', appId: 'web-app', createdAt: now, payloadBytes: 1,
        sourceFingerprintHash: 'fingerprint-b', sourceHash: 'source-b',
      },
      {
        shareId: 'share-3', appId: 'web-app', createdAt: now, payloadBytes: 1,
        sourceFingerprintHash: 'fingerprint-c', sourceHash: 'source-c',
      },
      {
        shareId: 'share-4', appId: 'web-app', createdAt: now, payloadBytes: 1,
        sourceFingerprintHash: 'fingerprint-d', sourceHash: 'source-d',
      },
    ],
    profileNamesByShareId: new Map([
      ['share-1', '月兔'],
      ['share-2', '月兔'],
      ['share-3', '兔子'],
      ['share-4', '兔子'],
    ]),
    now,
  });

  assert.equal(analysis.profiles.crossSourcePatterns.length, 1);
  assert.equal(analysis.profiles.crossSourcePatterns[0].key, '月兔');
  assert.equal(analysis.profiles.crossSourcePatterns[0].sourceCount, 2);
  assert.equal(analysis.profiles.defaultProfileNameUploads, 2);
});
