'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
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

      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      let loadedData: any = {};
      const unsubscribes: any[] = [];

      collectionNames.forEach((name) => {
        // Ištriname 'orderBy', nes tavo Firestore gali neturėti 'createdAt' lauko
        const colRef = collection(db, name);
        
        const unsub = onSnapshot(colRef, (snapshot) => {
          loadedData[name] = snapshot.docs.map(doc => ({
            id: doc.id,
            roleType: name.replace('applications_', ''), 
            ...doc.data()
          }));
          
          const combined = Object.values(loadedData).flat();
          setAllApplications(combined);
          setLoading(false);
        }, (err) => {
          console.error("Klaida su " + name, err);
        });
        unsubscribes.push(unsub);
      });

      return () => unsubscribes.forEach(un => un());
    });

    return () => unsubscribeAuth();
  }, [auth, db, router]);

  if (loading) return <div className="p-10 text-white bg-black min-h-screen text-center">Kraunama...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600">DETM VALDYMAS</h1>

        {allApplications.length === 0 ? (
          <div className="p-10 border border-zinc-800 text-center">
            <p className="text-zinc-500">Anketų nerasta. Patikrinkite kolekcijų pavadinimus Firebase konsolėje.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allApplications.map((app) => (
              <div key={app.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div className="flex justify-between mb-4">
                  <span className="text-xs font-bold uppercase text-red-500 tracking-widest">
                    {app.roleType}
                  </span>
                  <span className="text-zinc-700 text-[10px] italic">ID: {app.id}</span>
                </div>
                
                {/* Dinamiškai atvaizduojame visus rastus laukus iš Firestore */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(app).map(([key, value]) => {
                    if (key === 'id' || key === 'roleType') return null;
                    return (
                      <div key={key} className="flex flex-col p-2 bg-zinc-900/30 rounded">
                        <span className="text-zinc-500 text-xs uppercase">{key}:</span>
                        <span className="text-zinc-200">{String(value)}</span>
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