'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// 1. Firebase konfigūracija naudojant aplinkos kintamuosius
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Inicializavimo funkcija (apsaugo nuo dvigubo app kūrimo)
function getFirebaseServices() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

const { app, auth, firestore } = getFirebaseServices();

// 3. Pagrindiniai objektai eksportui
export { app as firebaseApp, auth, firestore };

// 4. SVARBU: Eksportuojame viską iš kitų failų, kad Assign-Admin ir kiti puslapiai juos matytų
// Tai išspręs "Module has no exported member" klaidas
export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';

// 5. Jei kiti failai naudoja specifinius tipus
export type { FirebaseApp, Auth, Firestore };