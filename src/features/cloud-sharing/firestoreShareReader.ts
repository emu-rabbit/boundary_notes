import type { FirebaseApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  Timestamp,
} from 'firebase/firestore/lite';

export function createFirestoreShareReader(
  app: FirebaseApp,
  useEmulator: boolean,
): (shareId: string) => Promise<unknown | null> {
  const firestore = getFirestore(app);

  if (useEmulator) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8085);
  }

  return async (shareId: string) => {
    const snapshot = await getDoc(doc(firestore, 'sharedSecretFiles', shareId));

    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    const createdAt = data.createdAt;

    return {
      ...data,
      createdAt: createdAt instanceof Timestamp
        ? createdAt.toDate().toISOString()
        : createdAt,
      shareId,
    };
  };
}
