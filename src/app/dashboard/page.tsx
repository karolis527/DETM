'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query } from 'firebase/firestore';
import { firebaseApp } from '@/firebase/provider';

export default function DashboardPage() {
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Kolekcijų pavadinimai iš tavo nuotraukos
      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      const unsubscribes: any[] = [];
      let loadedData: any = {};

      collectionNames.forEach((name) => {
        const q = query(collection(db, name));
        const unsub = onSnapshot(q, (snapshot) => {
          loadedData[name] = snapshot.docs.map(doc => ({
            id: doc.id,
            roleType: name.split('_')[1], // Ištraukiame rolę iš pavadinimo
            ...doc.data()
          }));
          
          // Sujungiam visus masyvus į vieną bendrą sąrašą
          const combined = Object.values(loadedData).flat();
          setAllApplications(combined);
          setLoading(false);
        }, (err) => {
          console.error(`Klaida su ${name}:`, err);
          setLoading(false);
        });
        unsubscribes.push(unsub);
      });

      return () => unsubscribes.forEach(un => un());
    });

    return () => unsubscribeAuth();
  }, [auth, db, router]);

  if (loading) return <div className="p-10 text-white bg-black min-h-screen text-center">Kraunamos visos anketos...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600 uppercase tracking-tighter">
          DETM Valdymo Skydas
        </h1>

        {allApplications.length === 0 ? (
          <p className="text-zinc-500">Šiuo metu anketų nėra nei vienoje kategorijoje.</p>
        ) : (
          <div className="grid gap-4">
            {allApplications.map((app) => (
              <div key={app.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg border-l-4 border-l-red-600">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase bg-red-600 px-2 py-1 rounded">
                    {app.roleType}
                  </span>
                  <span className="text-zinc-600 text-xs">ID: {app.id}</span>
                </div>
                
                {/* Rodome duomenis pagal tavo Firestore struktūrą */}
                <div className="space-y-2">
                  <p><span className="text-zinc-500">Amžius:</span> {app.age}</p>
                  <p><span className="text-zinc-500">Patirtis:</span> {app.databaseKnowledge || app.bugFixingTime || 'Nenurodyta'}</p>
                  <p className="mt-4 text-zinc-300 bg-zinc-900 p-3 rounded italic">
                    "{app.attributeCheckSystem || 'Nėra papildomos informacijos'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}