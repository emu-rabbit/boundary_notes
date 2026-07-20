const hourMs = 60 * 60 * 1000;
const dayMs = 24 * hourMs;
const defaultProfileNames = new Set(['bunny', 'うさぎ', '兔子']);

function asDate(value) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  return null;
}

function normalizeProfileName(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.normalize('NFKC').trim();
  return normalized ? normalized.toLocaleLowerCase() : null;
}

function maskHash(value) {
  if (typeof value !== 'string' || value.length === 0) return '(missing)';
  return value.length <= 12 ? value : `${value.slice(0, 12)}…`;
}

function isoOrNull(value) {
  return value ? value.toISOString() : null;
}

function sortByCountThenKey(left, right) {
  return right.successfulUploads - left.successfulUploads
    || left.key.localeCompare(right.key);
}

export function analyzeAuditData({ metadataRecords, profileNamesByShareId, now = new Date() }) {
  const nowMs = now.getTime();
  const metadataIds = new Set(metadataRecords.map((record) => record.shareId));
  const sharedIds = new Set(profileNamesByShareId.keys());
  const sourceGroups = new Map();
  const normalizedProfileByShareId = new Map();
  const profileSourceGroups = new Map();
  let invalidCreatedAt = 0;
  let missingSourceHash = 0;
  let missingFingerprintHash = 0;
  let unknownAppId = 0;
  let missingProfileName = 0;
  let defaultProfileNameUploads = 0;
  let lastHour = 0;
  let lastDay = 0;
  let lastSevenDays = 0;

  for (const [shareId, profileName] of profileNamesByShareId.entries()) {
    const normalized = normalizeProfileName(profileName);
    normalizedProfileByShareId.set(shareId, normalized);
    if (!normalized) missingProfileName += 1;
  }

  for (const record of metadataRecords) {
    const createdAt = asDate(record.createdAt);
    const createdAtMs = createdAt?.getTime() ?? null;
    const sourceHash = typeof record.sourceHash === 'string' && record.sourceHash
      ? record.sourceHash
      : null;
    const fingerprintHash = typeof record.sourceFingerprintHash === 'string'
      && record.sourceFingerprintHash
      ? record.sourceFingerprintHash
      : null;
    const profileName = normalizedProfileByShareId.get(record.shareId) ?? null;

    if (createdAtMs === null) {
      invalidCreatedAt += 1;
    } else {
      const age = nowMs - createdAtMs;
      if (age >= 0 && age <= hourMs) lastHour += 1;
      if (age >= 0 && age <= dayMs) lastDay += 1;
      if (age >= 0 && age <= 7 * dayMs) lastSevenDays += 1;
    }

    if (!sourceHash) missingSourceHash += 1;
    if (!fingerprintHash) missingFingerprintHash += 1;
    if (!record.appId || record.appId === 'unknown') unknownAppId += 1;
    if (profileName && defaultProfileNames.has(profileName)) defaultProfileNameUploads += 1;

    const sourceKey = sourceHash ?? `missing:${record.shareId}`;
    let sourceGroup = sourceGroups.get(sourceKey);
    if (!sourceGroup) {
      sourceGroup = {
        key: sourceKey,
        sourceHash,
        successfulUploads: 0,
        lastHour: 0,
        lastDay: 0,
        firstSeen: null,
        lastSeen: null,
        fingerprintHashes: new Set(),
        profileNames: new Set(),
        appIds: new Set(),
        payloadBytes: 0,
      };
      sourceGroups.set(sourceKey, sourceGroup);
    }

    sourceGroup.successfulUploads += 1;
    if (createdAtMs !== null) {
      const age = nowMs - createdAtMs;
      if (age >= 0 && age <= hourMs) sourceGroup.lastHour += 1;
      if (age >= 0 && age <= dayMs) sourceGroup.lastDay += 1;
      if (!sourceGroup.firstSeen || createdAt < sourceGroup.firstSeen) sourceGroup.firstSeen = createdAt;
      if (!sourceGroup.lastSeen || createdAt > sourceGroup.lastSeen) sourceGroup.lastSeen = createdAt;
    }
    if (fingerprintHash) sourceGroup.fingerprintHashes.add(fingerprintHash);
    if (profileName) sourceGroup.profileNames.add(profileName);
    if (record.appId) sourceGroup.appIds.add(record.appId);
    if (Number.isFinite(record.payloadBytes) && record.payloadBytes >= 0) {
      sourceGroup.payloadBytes += record.payloadBytes;
    }

    if (profileName && sourceHash) {
      let profileGroup = profileSourceGroups.get(profileName);
      if (!profileGroup) {
        profileGroup = { key: profileName, successfulUploads: 0, sourceHashes: new Set() };
        profileSourceGroups.set(profileName, profileGroup);
      }
      profileGroup.successfulUploads += 1;
      profileGroup.sourceHashes.add(sourceHash);
    }
  }

  const sortedProfileNames = [...profileSourceGroups.keys()].sort((left, right) => left.localeCompare(right));
  const profileLabels = new Map(sortedProfileNames.map((name, index) => [name, `profile-${index + 1}`]));
  const sourceSummaries = [...sourceGroups.values()]
    .map((group) => {
      const signals = [];
      if (group.lastHour >= 4) signals.push('near-hourly-limit');
      if (group.lastDay >= 8) signals.push('near-daily-limit');
      if (group.profileNames.size >= 3) signals.push('multiple-profile-names');
      if (group.fingerprintHashes.size >= 3) signals.push('multiple-client-fingerprints');

      return {
        key: group.key,
        source: maskHash(group.sourceHash),
        successfulUploads: group.successfulUploads,
        lastHour: group.lastHour,
        lastDay: group.lastDay,
        firstSeen: isoOrNull(group.firstSeen),
        lastSeen: isoOrNull(group.lastSeen),
        fingerprintCount: group.fingerprintHashes.size,
        profileNameCount: group.profileNames.size,
        profileNames: [...group.profileNames].sort(),
        appIds: [...group.appIds].sort(),
        payloadBytes: group.payloadBytes,
        signals,
      };
    })
    .sort(sortByCountThenKey);

  const crossSourceProfiles = [...profileSourceGroups.values()]
    .filter((group) => !defaultProfileNames.has(group.key) && group.sourceHashes.size >= 2)
    .map((group) => ({
      key: group.key,
      profile: profileLabels.get(group.key),
      sourceCount: group.sourceHashes.size,
      successfulUploads: group.successfulUploads,
    }))
    .sort((left, right) => right.sourceCount - left.sourceCount
      || right.successfulUploads - left.successfulUploads
      || left.key.localeCompare(right.key));

  const sharedWithoutMetadata = [...sharedIds].filter((shareId) => !metadataIds.has(shareId)).length;
  const metadataWithoutShared = [...metadataIds].filter((shareId) => !sharedIds.has(shareId)).length;
  const flaggedSources = sourceSummaries.filter((source) => source.signals.length > 0);
  const needsAttention = flaggedSources.length > 0
    || sharedWithoutMetadata > 0
    || metadataWithoutShared > 0
    || invalidCreatedAt > 0
    || missingSourceHash > 0
    || missingFingerprintHash > 0
    || unknownAppId > 0;

  return {
    generatedAt: now.toISOString(),
    status: needsAttention ? 'attention' : 'normal',
    totals: {
      sharedSecretFiles: sharedIds.size,
      metadataRecords: metadataRecords.length,
      matchedRecords: [...sharedIds].filter((shareId) => metadataIds.has(shareId)).length,
      sharedWithoutMetadata,
      metadataWithoutShared,
    },
    recentSuccessfulUploads: {
      lastHour,
      lastDay,
      lastSevenDays,
    },
    sources: {
      uniqueSourceHashes: new Set(metadataRecords.map((record) => record.sourceHash).filter(Boolean)).size,
      uniqueFingerprintHashes: new Set(
        metadataRecords.map((record) => record.sourceFingerprintHash).filter(Boolean),
      ).size,
      flaggedSourceCount: flaggedSources.length,
      top: sourceSummaries.slice(0, 10),
    },
    profiles: {
      distinctProfileNames: new Set([...normalizedProfileByShareId.values()].filter(Boolean)).size,
      missingProfileName,
      defaultProfileNameUploads,
      crossSourcePatterns: crossSourceProfiles.slice(0, 10),
    },
    dataQuality: {
      invalidCreatedAt,
      missingSourceHash,
      missingFingerprintHash,
      unknownAppId,
    },
  };
}

export function createSafeReport(analysis, { includeProfileNames = false } = {}) {
  return {
    ...analysis,
    sources: {
      ...analysis.sources,
      top: analysis.sources.top.map(({ key: _key, profileNames, ...source }) => ({
        ...source,
        profiles: includeProfileNames
          ? profileNames
          : profileNames.map((_, index) => `profile-${index + 1}`),
      })),
    },
    profiles: {
      ...analysis.profiles,
      crossSourcePatterns: analysis.profiles.crossSourcePatterns.map(({ key, ...pattern }) => ({
        ...pattern,
        profile: includeProfileNames ? key : pattern.profile,
      })),
    },
  };
}
