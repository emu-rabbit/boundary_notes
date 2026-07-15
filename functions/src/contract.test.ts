import { describe, expect, it } from 'vitest';
import {
  cloudSecretFileSchema,
  getGlobalRateLimitDecision,
  getGoogleLoadBalancerClientIp,
  getRateLimitDecision,
  normalizeClientIp,
  uploadDailyWindowMs,
  uploadHourlyWindowMs,
} from './contract.js';

function createValidFile() {
  return {
    answers: {
      'category.impactSpanking.active': {
        experience: 'some',
        note: '',
        preference: 'like',
        state: 'answered',
      },
      'category.impactSpanking.passive': { state: 'filteredOut' },
    },
    createdAt: '2026-07-14T00:00:00.000Z',
    fileId: 'local_12345678',
    profileName: '兔子',
    questionBank: { bankVersion: '2026-07-11', schemaVersion: 2 },
    schemaVersion: 2,
    scope: 'activeOnly',
    spotlight: {
      active: { selectedQuestionIds: ['category.impactSpanking.active'] },
      passive: { selectedQuestionIds: [] },
    },
    updatedAt: '2026-07-14T00:01:00.000Z',
  };
}

describe('cloud secret-file contract', () => {
  it('accepts a valid anonymous share snapshot', () => {
    expect(cloudSecretFileSchema.safeParse(createValidFile()).success).toBe(true);
  });

  it('rejects scope mismatches and invalid spotlight selections', () => {
    const candidate = createValidFile();
    candidate.answers['category.impactSpanking.passive'] = {
      experience: 'some',
      note: '',
      preference: 'like',
      state: 'answered',
    } as never;
    candidate.spotlight.active.selectedQuestionIds = ['category.impactSpanking.passive'];

    expect(cloudSecretFileSchema.safeParse(candidate).success).toBe(false);
  });
});

describe('upload rate limit', () => {
  it('blocks the sixth upload in one hour', () => {
    const now = Date.now();
    const attempts = Array.from({ length: 5 }, (_, index) => now - index * 1000);

    expect(getRateLimitDecision(attempts, now)).toMatchObject({ window: 'hour' });
  });

  it('blocks the eleventh upload in one day even when hourly volume is low', () => {
    const now = Date.now();
    const attempts = Array.from(
      { length: 10 },
      (_, index) => now - uploadHourlyWindowMs - index * 1000,
    );

    expect(getRateLimitDecision(attempts, now)).toMatchObject({ window: 'day' });
  });

  it('ignores attempts older than one day', () => {
    const now = Date.now();
    expect(getRateLimitDecision([now - uploadDailyWindowMs - 1], now)).toBeNull();
  });

  it('blocks the 301st project-wide upload in one hour', () => {
    const now = Date.now();
    const attempts = Array.from({ length: 300 }, (_, index) => now - index * 1000);

    expect(getGlobalRateLimitDecision(attempts, now)).toMatchObject({ window: 'hour' });
  });

  it('blocks the 2001st project-wide upload in one day', () => {
    const now = Date.now();
    const attempts = Array.from(
      { length: 2000 },
      (_, index) => now - uploadHourlyWindowMs - index * 1000,
    );

    expect(getGlobalRateLimitDecision(attempts, now)).toMatchObject({ window: 'day' });
  });
});

describe('client IP normalization', () => {
  it('unwraps IPv4-mapped IPv6', () => {
    expect(normalizeClientIp('::ffff:203.0.113.4')).toBe('203.0.113.4');
  });

  it('uses the client address appended by the Google load balancer', () => {
    expect(getGoogleLoadBalancerClientIp('203.0.113.4, 10.0.0.1')).toBe('203.0.113.4');
    expect(
      getGoogleLoadBalancerClientIp('198.51.100.99, 203.0.113.4, 10.0.0.1'),
    ).toBe('203.0.113.4');
  });

  it('groups IPv6 privacy addresses by their canonical /64 prefix', () => {
    expect(normalizeClientIp('2001:0db8:abcd:0012:0000:0000:0000:0001')).toBe(
      '2001:db8:abcd:12::/64',
    );
    expect(normalizeClientIp('2001:db8:abcd:12::ffff')).toBe('2001:db8:abcd:12::/64');
  });

  it('accepts bracketed addresses and rejects invalid forwarded values', () => {
    expect(normalizeClientIp('[2001:db8::1]:443')).toBe('2001:db8:0:0::/64');
    expect(normalizeClientIp('attacker-controlled-value')).toBe('');
    expect(normalizeClientIp('198.51.100.99, 203.0.113.4')).toBe('');
    expect(getGoogleLoadBalancerClientIp('203.0.113.4')).toBe('');
  });
});
