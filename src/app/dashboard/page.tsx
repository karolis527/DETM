'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { firebaseApp } from '@/firebase/provider';

export default function DashboardPage() {
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Jungiamasi prie Firebase...');
  const router = useRouter();
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      
      setStatus('Prisijungta: ' + user.email + '. Ieškoma anketų...');

      // Tikslūs kolekcijų pavadinimai iš tavo nuotraukų
      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      let combinedData: any[] = [];
      
      // Tikriname kiekvieną kolekciją atskirai
      for (const colName of collectionNames) {
        try {
          const colRef = collection(db, colName);
          const snapshot = await getDocs(colRef);
          
          if (!snapshot.empty) {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              role: colName.split('_')[1],
              ...doc.data()
            }));
            combinedData = [...combinedData, ...docs];
            console.log(`Rasta ${docs.length} anketų kolekcijoje ${colName}`);
          }
        } catch (err: any) {
          console.error(`Klaida skaitant ${colName}:`, err.message);
        }
      }

      setAllApplications(combinedData);
      setLoading(false);
      setStatus(combinedData.length > 0 ? '' : 'Anketų nerasta nei vienoje kolekcijoje.');
    });

    return () => unsubscribeAuth();
  }, [auth, db, router]);

  if (loading) return (
    <div className="p-10 text-white bg-black min-h-screen flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-sm">{status}</p>
    </div>
  );

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-black italic text-red-600 tracking-tighter">DETM ADMIN</h1>
          <button 
            onClick={() => auth.signOut()} 
            className="text-xs bg-zinc-900 hover:bg-red-600 px-4 py-2 rounded transition-all"
          >
            ATSIDUOTI
          </button>
        </div>

        {status && <p className="text-zinc-500 mb-6 italic">{status}</p>}

        <div className="grid gap-6">
          {allApplications.map((app) => (
            <div key={app.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="bg-red-600 text-[10px] font-bold px-2 py-1 rounded-none uppercase">
                  {app.role}
                </span>
                <span className="text-zinc-800 text-[10px] font-mono">ID: {app.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                {Object.entries(app).map(([key, value]) => {
                  if (['id', 'role'].includes(key)) return null;
                  return (
                    <div key={key} className="border-b border-zinc-900 pb-2">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">{key}</p>
                      <p className="text-zinc-200 text-sm">{String(value)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}