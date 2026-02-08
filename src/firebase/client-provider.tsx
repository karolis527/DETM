'use client';

import React from 'react';
import { FirebaseProvider } from './provider';
import { auth, firestore, firebaseApp } from './index';

export function ClientFirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider 
      firebaseApp={firebaseApp} 
      auth={auth} 
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}