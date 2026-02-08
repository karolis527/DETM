'use client';

import { useEffect, useState } from 'react';
import { useAuth, db } from '@/firebase'; // Įsitikink, kad db eksportuotas iš firebase/index.ts
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jei po kurio laiko auth vis dar null, vadinasi vartotojas neprisijungęs
    if (auth === null) {
      const timer = setTimeout(() => {
        if (!auth) router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (auth) {
      // Klausomės duomenų bazės pokyčių gyvai
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setApplications(apps);
        setLoading(false);
      }, (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [auth, router]);

  if (loading) return <div className="p-10 text-white bg-black min-h-screen text-center">Kraunamos anketos...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Anketų Valdymas</h1>
      
      {applications.length === 0 ? (
        <p className="text-zinc-500">Anketų kol kas nėra.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <div key={app.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <p className="font-bold text-lg text-white">{app.username || 'Nežinomas vartotojas'}</p>
              <p className="text-zinc-400 text-sm">{app.email}</p>
              <div className="mt-2 text-zinc-300 italic">"{app.message}"</div>
              <div className="mt-4 text-xs text-zinc-600">Gauta: {app.createdAt?.toDate().toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}