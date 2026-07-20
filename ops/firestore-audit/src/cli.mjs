#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { Firestore } from '@google-cloud/firestore';
import { analyzeAuditData, createSafeReport } from './audit.mjs';

const productionProjectId = 'boundary-notes-prod';
const auditorServiceAccount = 'firestore-auditor@boundary-notes-prod.iam.gserviceaccount.com';

function printHelp() {
  console.log(`Boundary Notes Firestore audit

Usage:
  npm run audit -- --project ${productionProjectId} [--json] [--include-profile-names]

Options:
  --project <id>             Required. First version only accepts ${productionProjectId}.
  --database <id>            Firestore database ID. Defaults to (default).
  --json                     Print machine-readable JSON.
  --include-profile-names    Include raw profileName values in local output.
  --help                     Show this help.

Expected impersonated service account:
  ${auditorServiceAccount}`);
}

export function parseArgs(args) {
  const options = {
    databaseId: '(default)',
    includeProfileNames: false,
    json: false,
    projectId: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--help') return { ...options, help: true };
    if (argument === '--json') {
      options.json = true;
      continue;
    }
    if (argument === '--include-profile-names') {
      options.includeProfileNames = true;
      continue;
    }
    if (argument === '--project' || argument === '--database') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value.`);
      if (argument === '--project') options.projectId = value;
      if (argument === '--database') options.databaseId = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${argument}`);
  }

  if (!options.projectId) throw new Error('--project is required.');
  if (options.projectId !== productionProjectId) {
    throw new Error(`This first version only allows --project ${productionProjectId}.`);
  }
  return options;
}

function timestampToDate(value) {
  return value && typeof value.toDate === 'function' ? value.toDate() : null;
}

async function readAuditData(db) {
  const [metadataSnapshot, sharedSnapshot] = await Promise.all([
    db.collection('sharedSecretFileMetadata')
      .select(
        'appId',
        'createdAt',
        'payloadBytes',
        'sourceFingerprintHash',
        'sourceHash',
        'userAgentHash',
      )
      .get(),
    db.collection('sharedSecretFiles')
      .select('secretFile.profileName')
      .get(),
  ]);

  const metadataRecords = metadataSnapshot.docs.map((document) => {
    const data = document.data();
    return {
      shareId: document.id,
      appId: data.appId,
      createdAt: timestampToDate(data.createdAt),
      payloadBytes: data.payloadBytes,
      sourceFingerprintHash: data.sourceFingerprintHash,
      sourceHash: data.sourceHash,
      userAgentHash: data.userAgentHash,
    };
  });
  const profileNamesByShareId = new Map(sharedSnapshot.docs.map((document) => [
    document.id,
    document.get('secretFile.profileName'),
  ]));

  return { metadataRecords, profileNamesByShareId };
}

function formatBytes(value) {
  if (!Number.isFinite(value)) return '0 B';
  if (value < 1024) return `${value} B`;
  return `${(value / 1024).toFixed(1)} KiB`;
}

function printHumanReport(report, options) {
  console.log('Boundary Notes Firestore audit');
  console.log(`Project: ${options.projectId}`);
  console.log(`Database: ${options.databaseId}`);
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Status: ${report.status === 'normal' ? 'no obvious signal' : 'review suggested'}`);
  console.log('');
  console.log('Documents');
  console.log(`  Shared files: ${report.totals.sharedSecretFiles}`);
  console.log(`  Private metadata: ${report.totals.metadataRecords}`);
  console.log(`  Matched pairs: ${report.totals.matchedRecords}`);
  console.log(`  Shared without metadata: ${report.totals.sharedWithoutMetadata}`);
  console.log(`  Metadata without shared file: ${report.totals.metadataWithoutShared}`);
  console.log('');
  console.log('Successful uploads');
  console.log(`  Last hour: ${report.recentSuccessfulUploads.lastHour}`);
  console.log(`  Last 24 hours: ${report.recentSuccessfulUploads.lastDay}`);
  console.log(`  Last 7 days: ${report.recentSuccessfulUploads.lastSevenDays}`);
  console.log('');
  console.log('Approximate sources');
  console.log(`  Source hashes: ${report.sources.uniqueSourceHashes}`);
  console.log(`  Source fingerprint hashes: ${report.sources.uniqueFingerprintHashes}`);
  console.log(`  Flagged sources: ${report.sources.flaggedSourceCount}`);
  console.log(`  Distinct profileName values: ${report.profiles.distinctProfileNames}`);
  console.log(`  Default profileName uploads: ${report.profiles.defaultProfileNameUploads}`);
  console.log('');
  console.log('Top sources');
  if (report.sources.top.length === 0) {
    console.log('  No successful uploads found.');
  } else {
    for (const source of report.sources.top) {
      const signals = source.signals.length > 0 ? ` [${source.signals.join(', ')}]` : '';
      console.log(
        `  ${source.source}: ${source.successfulUploads} total, ${source.lastHour}/1h, `
        + `${source.lastDay}/24h, ${source.fingerprintCount} fingerprints, `
        + `${source.profileNameCount} profiles, ${formatBytes(source.payloadBytes)}${signals}`,
      );
      if (options.includeProfileNames && source.profiles.length > 0) {
        console.log(`    profileName: ${source.profiles.join(', ')}`);
      }
    }
  }
  console.log('');
  console.log('Cross-source profileName patterns (excluding default names)');
  if (report.profiles.crossSourcePatterns.length === 0) {
    console.log('  None.');
  } else {
    for (const pattern of report.profiles.crossSourcePatterns) {
      console.log(
        `  ${pattern.profile}: ${pattern.sourceCount} sources, `
        + `${pattern.successfulUploads} successful uploads`,
      );
    }
  }
  console.log('');
  console.log('Data quality');
  console.log(`  Invalid createdAt: ${report.dataQuality.invalidCreatedAt}`);
  console.log(`  Missing sourceHash: ${report.dataQuality.missingSourceHash}`);
  console.log(`  Missing sourceFingerprintHash: ${report.dataQuality.missingFingerprintHash}`);
  console.log(`  Unknown appId: ${report.dataQuality.unknownAppId}`);
  console.log('');
  console.log('Note: this report only sees successful Firestore creations. Rejected App Check,');
  console.log('rate-limit, validation, and other failed attempts require Cloud Logging/metrics.');
  console.log('Source hashes, fingerprints, and profileName correlations are approximate signals,');
  console.log('not user identities or proof of abuse.');
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`Argument error: ${error.message}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.error('FIRESTORE_EMULATOR_HOST is set; refusing to present emulator data as production audit data.');
    process.exitCode = 1;
    return;
  }

  try {
    const db = new Firestore({
      databaseId: options.databaseId,
      projectId: options.projectId,
    });
    const auditData = await readAuditData(db);
    const analysis = analyzeAuditData(auditData);
    const report = createSafeReport(analysis, options);

    if (options.json) {
      console.log(JSON.stringify({
        projectId: options.projectId,
        databaseId: options.databaseId,
        ...report,
      }, null, 2));
    } else {
      printHumanReport(report, options);
    }
  } catch (error) {
    console.error('Firestore audit failed.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Expected ADC impersonation command:');
    console.error(
      `gcloud auth application-default login --impersonate-service-account=${auditorServiceAccount}`,
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
