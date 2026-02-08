'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

/**
 * This provider is responsible for initializing Firebase on the client side
 * and providing the Firebase instances to its children. It ensures that
 * Firebase is only initialized once.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<{
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    // Initialize Firebase and set the services in state.
    // This runs only once on the client after the component mounts.
    const firebaseServices = initializeFirebase();
    setServices(firebaseServices);
  }, []);

  const providerValue = useMemo(() => {
    if (services) {
      return {
        firebaseApp: services.firebaseApp,
        auth: services.auth,
        firestore: services.firestore,
      };
    }
    // Return nulls if services are not yet initialized
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
    };
  }, [services]);

  return (
    <FirebaseProvider
      firebaseApp={providerValue.firebaseApp}
      auth={providerValue.auth}
      firestore={providerValue.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
