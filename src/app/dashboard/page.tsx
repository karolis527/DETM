'use client';

import { useEffect, useState } from 'react';
import { useFirestore, useAuth } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [debug, setDebug] = useState('Inicijuojama...');

  useEffect(() => {
    if (!auth || !db) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      setDebug('Prisijungta: ' + user.email + '. Kraunama...');
      
      try {
        const collections = [
          'applications_administrator',
          'applications_designer',
          'applications_moderator',
          'applications_programmer'
        ];

        let allDocs: any[] = [];
        for (const name of collections) {
          const snap = await getDocs(collection(db, name));
          const docs = snap.docs.map(d => ({ 
            id: d.id, 
            role: name.replace('applications_', ''), 
            ...d.data() 
          }));
          allDocs = [...allDocs, ...docs];
        }

        setData(allDocs);
        setDebug(`Sėkmingai rasta anketų: ${allDocs.length}`);
      } catch (e: any) {
        setDebug('Klaida: ' + e.message);
      }
    });

    return () => unsub();
  }, [db, auth, router]);

  return (
    <div className="p-10 bg-black min-h-screen text-white font-mono">
      <h1 className="text-red-600 text-2xl font-bold mb-4 italic">DETM ADMIN DEBUG</h1>
      <p className="text-[10px] mb-10 bg-zinc-900 p-2 text-zinc-400 border border-zinc-800">
        STATUSAS: {debug}
      </p>
      
      <div className="grid gap-4">
        {data.length === 0 && !debug.includes('Klaida') && <p className="text-zinc-600">Anketų nėra...</p>}
        {data.map(item => (
          <div key={item.id} className="p-4 border border-zinc-800 bg-zinc-950 rounded shadow-lg border-l-4 border-l-red-600">
             <p className="text-red-500 font-bold mb-2 uppercase text-xs">{item.role}</p>
             <pre className="text-[10px] text-zinc-400 whitespace-pre-wrap">
               {JSON.stringify(item, null, 2)}
             </pre>
          </div>
        ))}
      </div>
    </div>
  );
}