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

  const [data, setData] = useState<any[]>([]);
  const [debug, setDebug] = useState('Inicijuojama...');
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // 1. Tikriname ar auth objektas išvis egzistuoja
    if (!auth) {
      setDebug('Laukiama Auth objekto...');
      return;
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setDebug(`Prisijungta kaip: ${user.email}`);
        setIsAuthReady(true);
      }
    });

    return () => unsub();
  }, [auth, router]);

  useEffect(() => {
    // 2. Duomenis krauname tik tada, kai vartotojas prisijungęs IR turime db ryšį
    if (!isAuthReady || !db) {
      if (isAuthReady && !db) setDebug('Klaida: Duomenų bazė (db) nerasta.');
      return;
    }

    async function fetchAll() {
      setDebug('Jungiamasi prie Firestore...');
      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      try {
        let allDocs: any[] = [];
        
        for (const name of collectionNames) {
          const colRef = collection(db, name);
          const snap = await getDocs(colRef);
          
          const docs = snap.docs.map(d => ({
            id: d.id,
            roleType: name.replace('applications_', ''),
            ...d.data()
          }));
          
          allDocs = [...allDocs, ...docs];
        }

        setData(allDocs);
        setDebug(allDocs.length > 0 ? `Rasta anketų: ${allDocs.length}` : 'Anketų rasta: 0 (Patikrinkite Firestore kolekcijų pavadinimus)');
      } catch (err: any) {
        console.error(err);
        setDebug(`Klaida: ${err.message}`);
      }
    }

    fetchAll();
  }, [db, isAuthReady]);

  return (
    <div className="p-10 bg-black min-h-screen text-white font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-red-600 text-3xl font-black mb-2 italic tracking-tighter">DETM ADMIN PANEL</h1>
        <div className="bg-zinc-900 border border-zinc-800 p-3 mb-8 rounded shadow-[0_0_15px_rgba(220,38,38,0.1)]">
          <p className="text-[10px] text-zinc-500 uppercase mb-1">Sistemos statusas</p>
          <p className="text-xs text-red-500">{debug}</p>
        </div>

        <div className="grid gap-6">
          {data.length === 0 && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded">
              <p className="text-zinc-600 italic">Anketų sąrašas tuščias</p>
            </div>
          )}
          
          {data.map((item) => (
            <div key={item.id} className="group relative bg-zinc-950 border border-zinc-900 p-6 rounded-sm transition-all hover:border-red-900">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-red-600"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="bg-red-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wider text-black">
                  {item.roleType}
                </span>
                <span className="text-zinc-800 text-[9px]">ID: {item.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(item).map(([key, value]) => {
                  if (['id', 'roleType'].includes(key)) return null;
                  return (
                    <div key={key} className="border-b border-zinc-900 pb-1">
                      <p className="text-[9px] text-zinc-600 uppercase font-bold">{key}</p>
                      <p className="text-zinc-300 text-sm">{String(value)}</p>
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