import { describe, expect, it } from 'vitest';
import {
  analyticsConsentStorageKey,
  readAnalyticsConsent,
  shouldShowAnalyticsConsent,
  toAnalyticsSecretFileScope,
} from './analytics';

describe('analytics consent', () => {
  it('restores only an explicit granted choice', () => {
    expect(readAnalyticsConsent({ getItem: () => 'granted' })).toBe('granted');
    expect(readAnalyticsConsent({ getItem: () => 'declined' })).toBe('unknown');
    expect(readAnalyticsConsent({ getItem: () => null })).toBe('unknown');
  });

  it('uses the stable storage key', () => {
    expect(analyticsConsentStorageKey).toBe('boundary-notes-analytics-consent:v1');
  });

  it('normalizes file scope for GA reports', () => {
    expect(toAnalyticsSecretFileScope('activeOnly')).toBe('leading');
    expect(toAnalyticsSecretFileScope('passiveOnly')).toBe('following');
    expect(toAnalyticsSecretFileScope('all')).toBe('both');
  });

  it('hides the prompt on blacklisted routes', () => {
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'entry',
      source: undefined,
      uiEnabled: true,
    })).toBe(false);
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'story',
      source: undefined,
      uiEnabled: true,
    })).toBe(false);
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'preview',
      source: 'cloud',
      uiEnabled: true,
    })).toBe(false);
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'terms',
      source: undefined,
      uiEnabled: true,
    })).toBe(false);
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'privacy',
      source: undefined,
      uiEnabled: true,
    })).toBe(false);
  });

  it('shows only while a choice is still needed', () => {
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'home',
      source: undefined,
      uiEnabled: true,
    })).toBe(true);
    expect(shouldShowAnalyticsConsent({
      consent: 'declined',
      routeName: 'home',
      source: undefined,
      uiEnabled: true,
    })).toBe(false);
    expect(shouldShowAnalyticsConsent({
      consent: 'unknown',
      routeName: 'home',
      source: undefined,
      uiEnabled: false,
    })).toBe(false);
  });
});
