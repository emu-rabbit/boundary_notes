import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteApp, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createFirestoreShareReader } from '../src/features/cloud-sharing/firestoreShareReader';

const projectId = 'demo-boundary-notes';
const validShareId = 'sf_1234567890abcdefghijklmn';

let testEnvironment: RulesTestEnvironment;
let directReadApp: FirebaseApp;

beforeAll(async () => {
  testEnvironment = await initializeTestEnvironment({
    firestore: {
      host: '127.0.0.1',
      port: 8085,
      rules: readFileSync('firestore.rules', 'utf8'),
    },
    projectId,
  });
  directReadApp = initializeApp({ apiKey: 'rules-test', projectId }, 'firestore-rules-direct-read');
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'sharedSecretFiles', validShareId), {
      createdAt: new Date('2026-07-14T00:00:00.000Z'),
      secretFile: { schemaVersion: 2 },
      shareId: validShareId,
    });
    await setDoc(doc(context.firestore(), 'sharedSecretFileMetadata', validShareId), {
      sourceHash: 'private',
    });
  });
});

afterAll(async () => {
  await deleteApp(directReadApp);
  await testEnvironment.cleanup();
});

describe('shared secret-file read rules', () => {
  it('allows an anonymous single-document read with a valid unguessable share ID', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore();

    await assertSucceeds(getDoc(doc(firestore, 'sharedSecretFiles', validShareId)));
  });

  it('loads and normalizes the public snapshot through the production Firestore Lite reader', async () => {
    const readShare = createFirestoreShareReader(directReadApp, true);

    await expect(readShare(validShareId)).resolves.toMatchObject({
      createdAt: '2026-07-14T00:00:00.000Z',
      secretFile: { schemaVersion: 2 },
      shareId: validShareId,
    });
  });

  it('rejects malformed share IDs and collection enumeration', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore();

    await assertFails(getDoc(doc(firestore, 'sharedSecretFiles', 'sf_invalid')));
    await assertFails(getDocs(collection(firestore, 'sharedSecretFiles')));
  });

  it('rejects all client writes to public snapshots', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore();
    const existingShare = doc(firestore, 'sharedSecretFiles', validShareId);
    const newShare = doc(firestore, 'sharedSecretFiles', 'sf_abcdefghijklmnopqrstuvwx');

    await assertFails(setDoc(newShare, { shareId: newShare.id }));
    await assertFails(updateDoc(existingShare, { shareId: existingShare.id }));
    await assertFails(deleteDoc(existingShare));
  });

  it('never exposes private anti-abuse metadata', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore();

    await assertFails(getDoc(doc(firestore, 'sharedSecretFileMetadata', validShareId)));
  });
});
