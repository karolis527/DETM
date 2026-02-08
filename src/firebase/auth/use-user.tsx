'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase/provider';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
}

/**
 * A dedicated hook to get the current user state.
 * It isolates the onAuthStateChanged listener.
 */
export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If auth is not yet available, we are in a loading state.
    if (!auth) {
      setIsLoading(true);
      return;
    }

    // Subscribe to auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Unsubscribe on cleanup.
    return () => unsubscribe();
  }, [auth]); // The effect depends on the auth instance.

  return { user, isLoading };
}
