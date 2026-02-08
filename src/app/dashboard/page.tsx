'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firebaseApp } from '@/firebase/provider'; // Įsitikink, kad exportuoji firebaseApp

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    // 1. Klausomės Auth būsenos pasikeitimo
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // 2. Jei vartotojas yra, pradedame krauti anketas
        const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
        
        const unsubscribeDocs = onSnapshot(q, (snapshot) => {
          const apps = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setApplications(apps);
          setLoading(false);
        }, (error) => {
          console.error("Firestore klaida:", error);
          setLoading(false);
        });

        return () => unsubscribeDocs();
      } else {
        // Jei neprisijungęs, metam lauk
        router.push('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Kraunamos anketos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">DETM Administracija</h1>
          <p className="text-sm text-zinc-500">Prisijungta: {user?.email}</p>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 border border-dashed border-zinc-800 rounded-lg text-center">
            <p className="text-zinc-500 italic">Anketų šiuo metu nėra.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app: any) => (
              <div key={app.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{app.username || 'Narys'}</h3>
                  <span className="text-xs text-zinc-600">
                    {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString() : 'Data nežinoma'}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{app.message || app.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}