const exportFormat = 'boundary-notes-secret-file';
const exportVersion = 1;
const algorithm = 'AES-GCM';
const initializationVectorLength = 12;

// This bundled key only raises the cost of casually reading a downloaded file.
// It is not a security boundary because every browser receives the same key.
const bundledKeyBytes = new Uint8Array([
  0x42, 0x6f, 0x75, 0x6e, 0x64, 0x61, 0x72, 0x79,
  0x4e, 0x6f, 0x74, 0x65, 0x73, 0x2d, 0x52, 0x61,
  0x62, 0x62, 0x69, 0x74, 0x2d, 0x46, 0x69, 0x6c,
  0x65, 0x2d, 0x32, 0x30, 0x32, 0x36, 0x21, 0x7e,
]);

interface EncryptedSecretFileExport {
  format: typeof exportFormat;
  version: typeof exportVersion;
  encryption: {
    algorithm: typeof algorithm;
    initializationVector: string;
    ciphertext: string;
  };
}

export class SecretFileTransferError extends Error {
  constructor() {
    super('The selected file could not be opened.');
    this.name = 'SecretFileTransferError';
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getBundledKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', bundledKeyBytes, algorithm, false, ['encrypt', 'decrypt']);
}

function isEncryptedExport(value: unknown): value is EncryptedSecretFileExport {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<EncryptedSecretFileExport>;
  return candidate.format === exportFormat &&
    candidate.version === exportVersion &&
    candidate.encryption?.algorithm === algorithm &&
    typeof candidate.encryption.initializationVector === 'string' &&
    typeof candidate.encryption.ciphertext === 'string';
}

export async function encryptSecretFileExport(secretFileJson: string): Promise<string> {
  const initializationVector = crypto.getRandomValues(new Uint8Array(initializationVectorLength));
  const ciphertext = await crypto.subtle.encrypt(
    { name: algorithm, iv: initializationVector },
    await getBundledKey(),
    new TextEncoder().encode(secretFileJson),
  );
  const encryptedExport: EncryptedSecretFileExport = {
    format: exportFormat,
    version: exportVersion,
    encryption: {
      algorithm,
      initializationVector: bytesToBase64(initializationVector),
      ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    },
  };

  return JSON.stringify(encryptedExport, null, 2);
}

export async function decryptSecretFileExport(fileContents: string): Promise<string> {
  try {
    const parsed: unknown = JSON.parse(fileContents);

    // Keep files saved before encrypted downloads were introduced importable.
    if (!isEncryptedExport(parsed)) return fileContents;

    const plaintext = await crypto.subtle.decrypt(
      {
        name: algorithm,
        iv: base64ToBytes(parsed.encryption.initializationVector),
      },
      await getBundledKey(),
      base64ToBytes(parsed.encryption.ciphertext),
    );

    return new TextDecoder().decode(plaintext);
  } catch {
    throw new SecretFileTransferError();
  }
}
