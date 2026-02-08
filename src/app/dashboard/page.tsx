'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const [apps, setApps] = useState<any[]>([]);
  const [status, setStatus] = useState('Jungiamasi prie duomenų bazės...');

  useEffect(() => {
    if (!db || !auth) return;

    const colNames = ['applications_administrator', 'applications_designer', 'applications_moderator', 'applications_programmer'];
    
    // Sukuriame „klausymąsi“ kiekvienai kolekcijai
    const unsubs = colNames.map(name => {
      return onSnapshot(collection(db, name), (snap) => {
        const newDocs = snap.docs.map(d => ({ 
          id: d.id, 
          role: name.replace('applications_', '').toUpperCase(), 
          ...d.data() 
        }));

        setApps(prev => {
          // Pašaliname senus tos pačios kategorijos įrašus ir pridedame naujus (kad nesidubliuotų)
          const otherRoles = prev.filter(a => a.role !== name.replace('applications_', '').toUpperCase());
          const combined = [...otherRoles, ...newDocs];
          setStatus(combined.length > 0 ? '' : 'Anketų nerasta.');
          return combined;
        });
      }, (err) => {
        setStatus('Klaida: ' + err.message);
      });
    });

    return () => unsubs.forEach(unsub => unsub());
  }, [db, auth]);

  return (
    <div className="p-8 bg-black min-h-screen text-white font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-red-600 mb-2 italic uppercase tracking-tighter">DETM DASHBOARD</h1>
        <p className="text-zinc-600 text-[10px] mb-10 tracking-[0.3em]">ADMINISTRATORIAUS VALDYMO PULTAS</p>

        {status && <div className="p-4 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-6">{status}</div>}

        <div className="grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="p-6 bg-zinc-950 border border-zinc-900 border-l-4 border-l-red-600 relative group transition-all hover:bg-zinc-900">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-red-600 text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter italic">
                  {app.role}
                </span>
                <span className="text-zinc-800 text-[9px]">DOC_ID: {app.id}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(app).map(([key, value]) => {
                  if (['id', 'role'].includes(key)) return null;
                  return (
                    <div key={key} className="border-b border-zinc-900 pb-2">
                      <p className="text-[9px] text-zinc-600 uppercase font-bold mb-1">{key}</p>
                      <p className="text-sm text-zinc-300 leading-tight">{String(value)}</p>
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