'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jei vartotojas neprisijungęs, nukreipiame į login
    if (auth === null) return; 
    
    const db = getFirestore();
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Klaida kraunant anketas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) return <div className="p-10 text-white bg-black min-h-screen text-center">Kraunama...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">DETM Valdymo Skydas</h1>
      {applications.length === 0 ? (
        <p className="text-zinc-500">Anketų nerasta. Patikrinkite duomenų bazės teises.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <div key={app.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded">
              <p className="font-bold text-red-500">{app.username || 'Vartotojas'}</p>
              <p className="text-sm text-zinc-400">{app.type || 'Anketa'}</p>
              <p className="mt-2">{app.message || app.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}