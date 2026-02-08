'use client';

import React, { useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export function ClientFirebaseProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    setServices(initializeFirebase());
  }, []);

  if (!services) return <>{children}</>;

  return (
    <FirebaseProvider 
      firebaseApp={services.firebaseApp} 
      auth={services.auth} 
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}