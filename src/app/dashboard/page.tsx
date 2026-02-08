'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStats] = useState('Inicijuojama...');

  useEffect(() => {
    // 1. Tikriname, ar Firebase pasiekiama
    if (!auth || !db) {
      setStats('Laukiama Firebase ryšio...');
      return;
    }

    // 2. Stebime vartotojo sesiją
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("Vartotojas neprisijungęs, nukreipiama...");
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
        
        for (const colName of collectionNames) {
          const colRef = collection(db, colName);
          const snapshot = await getDocs(colRef);
          
          console.log(`Kolekcija ${colName}: rasta ${snapshot.size} dokumentų`);

          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            roleType: colName.replace('applications_', '').toUpperCase(),
            ...doc.data()
          }));
          
          allData = [...allData, ...docs];
        }

        setApplications(allData);
        setStats(allData.length > 0 ? '' : 'Anketų nerasta (duomenų bazė tuščia).');
      } catch (err: any) {
        console.error("Firestore klaida:", err);
        setStats('Klaida kraunant duomenis: ' + err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, [auth, db, router]);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-zinc-500 text-sm">{status}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-4xl font-black text-red-600 italic tracking-tighter uppercase">DETM Admin</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-1">Valdymo pultas / Sistemos anketos</p>
          </div>
          <div className="text-right">
             <p className="text-zinc-700 text-[9px] font-mono mb-2 uppercase">Statusas: Veikia</p>
          </div>
        </header>

        {applications.length === 0 ? (
          <div className="p-20 border border-zinc-900 bg-zinc-950/50 rounded flex flex-col items-center">
            <p className="text-zinc-500 italic mb-4">{status || 'Sąrašas tuščias'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-[10px] text-red-600 border border-red-600 px-4 py-2 hover:bg-red-600 hover:text-black transition-all"
            >
              PERKRAUTI PUSLAPĮ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-zinc-950 border border-zinc-900 p-6 transition-all hover:border-zinc-700 relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-50 group-hover:opacity-100"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-red-600 text-black text-[10px] font-black px-3 py-1 uppercase italic">
                    {app.roleType}
                  </div>
                  <span className="text-zinc-800 text-[9px] font-mono">ID: {app.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(app).map(([key, value]) => {
                    if (['id', 'roleType'].includes(key)) return null;
                    return (
                      <div key={key} className="space-y-1">
                        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">{key}</p>
                        <p className="text-zinc-200 text-sm font-medium">{String(value)}</p>
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