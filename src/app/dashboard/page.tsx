'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { firebaseApp } from '@/firebase/provider'; // Užtikriname, kad naudojame tą patį app

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState('');

  useEffect(() => {
    if (auth === undefined) return;
    if (auth === null) {
      router.push('/login');
      return;
    }

    // Inicializuojame DB tiesiogiai čia, kad išvengtume importavimo klaidų
    const db = getFirestore(firebaseApp);
    
    // SVARBU: Patikrink, ar kolekcija Firestore tikrai vadinasi 'applications'
    const colRef = collection(db, 'applications');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("DETM Debug:", error.code, error.message);
      setDebugError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) return <div className="p-10 text-white bg-black min-h-screen text-center">Kraunama...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-600">DETM Valdymo Skydas</h1>
      
      {/* Jei įvyks klaida, ją pamatysi čia raudonai */}
      {debugError && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 text-red-500 rounded text-xs font-mono">
          SISTEMINĖ KLAIDA: {debugError}
        </div>
      )}

      <div className="mb-4 text-sm text-zinc-500">
        Prisijungęs vartotojas: <span className="text-zinc-300">{auth?.email}</span>
      </div>

      {applications.length === 0 ? (
        <div className="p-10 border border-zinc-800 rounded text-center">
          <p className="text-zinc-500">Anketų rasta: 0</p>
          <p className="text-xs text-zinc-600 mt-2 italic">Patikrinkite ar Firestore kolekcija vadinasi 'applications' ir ar joje yra dokumentų.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <div key={app.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded">
              <p className="font-bold text-red-500">{app.username || 'Vartotojas'}</p>
              <p className="text-sm text-zinc-300 mt-2">{app.message || app.content || 'Tuščia žinutė'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}