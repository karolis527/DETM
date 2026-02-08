'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, query, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Saugiklis: Jei vartotojas neprisijungęs, metame atgal į login
    if (!auth) return;
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Kraunama...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">DETM Valdymo Skydas</h1>
      <p>Sveiki prisijungę! Čia bus rodomos jūsų anketos.</p>
    </div>
  );
}