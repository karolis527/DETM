'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const db = useFirestore();
  const [data, setData] = useState<any[]>([]);
  const [debug, setDebug] = useState('Pradedama...');

  useEffect(() => {
    async function load() {
      if (!db) {
        setDebug('Klaida: Duomenų bazė (db) nepasiekiama per useFirestore');
        return;
      }
      try {
        const colRef = collection(db, 'applications_programmer');
        setDebug('Jungiamasi prie applications_programmer...');
        const snap = await getDocs(colRef);
        setDebug(`Rasta dokumentų: ${snap.size}`);
        setData(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } catch (e: any) {
        setDebug('Klaida: ' + e.message);
      }
    }
    load();
  }, [db]);

  return (
    <div className="p-10 bg-black min-h-screen text-white font-mono">
      <h1 className="text-red-600 mb-4">DEBUG REŽIMAS</h1>
      <p className="text-xs mb-10 bg-zinc-900 p-2">Statusas: {debug}</p>
      
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.id} className="p-4 border border-zinc-800">
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </div>
  );
}