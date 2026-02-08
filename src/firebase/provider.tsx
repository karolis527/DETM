'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase'; // Naudojame tavo hook'us
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStats] = useState('Tikrinama prieiga...');

  useEffect(() => {
    if (!auth || !db) return;

    // Stebime prisijungimą per tavo auth objektą
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      setStats(`Prisijungta: ${user.email}. Kraunamos anketos...`);

      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      try {
        let allData: any[] = [];
        
        // Einame per kiekvieną tavo kolekciją
        for (const colName of collectionNames) {
          const colRef = collection(db, colName);
          const snapshot = await getDocs(colRef);
          
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            roleType: colName.replace('applications_', ''),
            ...doc.data()
          }));
          
          allData = [...allData, ...docs];
        }

        setApplications(allData);
        setStats(allData.length > 0 ? '' : 'Anketų nerasta.');
      } catch (err: any) {
        console.error("Klaida:", err);
        setStats('Klaida kraunant duomenis: ' + err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, [auth, db, router]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-zinc-500 font-mono text-sm">{status}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-red-600 mb-2 italic">DETM VALDYMAS</h1>
        <p className="text-zinc-600 text-xs mb-8 uppercase tracking-widest">Administratoriaus skydas</p>

        {applications.length === 0 ? (
          <div className="p-10 border border-zinc-900 rounded text-center text-zinc-500">
            {status || 'Sąrašas tuščias'}
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold bg-red-600 px-2 py-0.5 uppercase">
                    {app.roleType}
                  </span>
                  <span className="text-zinc-800 text-[10px] font-mono">ID: {app.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(app).map(([key, value]) => {
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
        )}
      </div>
    </div>
  );
}