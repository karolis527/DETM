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

  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  } else {
    setPersistence(auth, inMemoryPersistence).catch(console.error);
  }

  return { firebaseApp: app, auth, firestore };
}

// Eksportuojame viską iš kitų failų, kad Assign-Admin ir kiti juos rastų
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
export * from './provider';
export * from './auth/use-user';