'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Kolekcijų pavadinimai iš tavo image_e0d11c.png nuotraukos
      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      try {
        let allData: any[] = [];
        for (const colName of collectionNames) {
          const querySnapshot = await getDocs(collection(db, colName));
          const docs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            category: colName.split('_')[1],
            ...doc.data()
          }));
          allData = [...allData, ...docs];
        }
        setApplications(allData);
      } catch (error) {
        console.error("Klaida kraunant anketas:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [auth, db, router]);

  if (loading) return <div className="p-10 text-white bg-black min-h-screen">Kraunama...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600 uppercase tracking-tighter italic">
          DETM Valdymo Skydas
        </h1>

        {applications.length === 0 ? (
          <p className="text-zinc-500 italic border border-zinc-900 p-10 rounded text-center">
            Šiuo metu anketų nėra.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                
                <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
                  <span className="bg-red-600 text-[10px] font-black px-2 py-1 uppercase">
                    {app.category}
                  </span>
                  <span className="text-zinc-700 text-[10px] font-mono uppercase">ID: {app.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(app).map(([key, value]) => {
                    if (['id', 'category'].includes(key)) return null;
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] text-zinc-600 uppercase font-bold mb-1">{key}</span>
                        <span className="text-zinc-200 text-sm">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}