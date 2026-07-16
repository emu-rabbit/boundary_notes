import { describe, expect, it } from 'vitest';
import {
  decryptSecretFileExport,
  encryptSecretFileExport,
  SecretFileTransferError,
} from './secretFileTransfer';

describe('secret-file download encryption', () => {
  it('round-trips JSON without exposing the original contents', async () => {
    const original = JSON.stringify({ profileName: '兔子', answers: { example: 'private' } });
    const encrypted = await encryptSecretFileExport(original);

    expect(encrypted).not.toContain('兔子');
    expect(encrypted).not.toContain('private');
    expect(await decryptSecretFileExport(encrypted)).toBe(original);
  });

  it('keeps legacy plain JSON files importable', async () => {
    const legacy = JSON.stringify({ schemaVersion: 2 });

    expect(await decryptSecretFileExport(legacy)).toBe(legacy);
  });

  it('rejects a damaged encrypted file', async () => {
    const encrypted = JSON.parse(await encryptSecretFileExport('{}'));
    encrypted.encryption.ciphertext = `${encrypted.encryption.ciphertext.slice(0, -2)}xx`;

    await expect(decryptSecretFileExport(JSON.stringify(encrypted))).rejects.toBeInstanceOf(
      SecretFileTransferError,
    );
  });
});
