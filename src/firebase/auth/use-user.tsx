'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase/provider';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
}

/**
 * Hook'as, kuris stebi vartotojo prisijungimo būseną.
 */
export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Jei Firebase auth dar nepasiekiamas, nieko nedarome
    if (!auth) {
      return;
    }

    // Prenumeruojame būsenos pasikeitimus
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    // Atsijungiame nuo stebėjimo, kai komponentas sunaikinamas
    return () => unsubscribe();
  }, [auth]);

  return { user, isLoading };
}