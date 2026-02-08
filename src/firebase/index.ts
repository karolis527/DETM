'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function initializeFirebase(): FirebaseServices {
  let app: FirebaseApp;

  if (getApps().length) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // PAGRINDINIS PATAISYMAS:
  // Patikriname, ar kodas veikia naršyklėje (window), ar serveryje.
  // Jei serveryje - naudojame "inMemoryPersistence", kad nekiltų localStorage klaida.
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((err) => console.error("Auth persistence error:", err));
  } else {
    setPersistence(auth, inMemoryPersistence).catch((err) => console.error("Auth server persistence error:", err));
  }

  return {
    firebaseApp: app,
    auth: auth,
    firestore: firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './errors';
export * from './error-emitter';