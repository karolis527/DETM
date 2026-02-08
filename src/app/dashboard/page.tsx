'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const [status, setStatus] = useState('Kraunama...');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!db || !auth) {
      setStatus('KLAIDA: Firebase neinicijuota. Patikrink Vercel Environment Variables!');
      return;
    }

    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'applications_programmer'));
        if (snap.empty) {
          setStatus('SĖKMĖ: Prisijungta, bet kolekcija applications_programmer yra TUŠČIA.');
        } else {
          setData(snap.docs.map(d => ({id: d.id, ...d.data()})));
          setStatus(`Rasta anketų: ${snap.size}`);
        }
      } catch (err: any) {
        setStatus('FIREBASE KLAIDA: ' + err.message);
      }
    };

    load();
  }, [db, auth]);

  return (
    <div className="p-20 bg-black text-white min-h-screen">
      <h1 className="text-red-600 font-bold mb-4">DETM DASHBOARD DEBUG</h1>
      <div className="p-4 bg-zinc-900 border border-red-900 mb-10 text-xs font-mono">
        STATUSAS: {status}
      </div>
      
      <div className="grid gap-4">
        {data.map(item => (
          <div key={item.id} className="p-4 border border-zinc-800">
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </div>
  );
}