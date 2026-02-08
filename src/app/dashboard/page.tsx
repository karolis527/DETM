'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStats] = useState('Inicijuojama...');

  useEffect(() => {
    // Laukiame, kol Firebase objektai bus pasiekiami
    if (!auth || !db) {
      setStats('Laukiama Firebase ryšio...');
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      setStats(`Prisijungta: ${user.email}. Ieškoma duomenų...`);

      const collectionNames = [
        'applications_administrator',
        'applications_designer',
        'applications_moderator',
        'applications_programmer'
      ];

      try {
        let allData: any[] = [];
        
        for (const colName of collectionNames) {
          try {
            const colRef = collection(db, colName);
            const snapshot = await getDocs(colRef);
            
            console.log(`Kolekcija ${colName}: rasta ${snapshot.size}`);

            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              roleType: colName.replace('applications_', ''),
              ...doc.data()
            }));
            
            allData = [...allData, ...docs];
          } catch (colErr: any) {
            console.error(`Klaida su ${colName}:`, colErr);
          }
        }

        setApplications(allData);
        
        // Jei nieko nerado, išvedame debug informaciją į ekraną
        if (allData.length === 0) {
          setStats(`Anketų nerasta. Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
        } else {
          setStats('');
        }
      } catch (err: any) {
        setStats('Kritinė klaida: ' + err.message);
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
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-4xl font-black text-red-600 italic tracking-tighter">DETM ADMIN</h1>
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em]">Valdymo pultas</p>
          </div>
          <button 
            onClick={() => auth?.signOut()}
            className="text-[10px] bg-zinc-900 hover:bg-red-600 px-4 py-2 transition-colors font-bold"
          >
            ATSIJUNGTI
          </button>
        </div>

        {status && (
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 mb-6 rounded text-zinc-400 text-xs font-mono">
            {status}
          </div>
        )}

        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black bg-red-600 px-3 py-1 uppercase text-black">
                  {app.roleType}
                </span>
                <span className="text-zinc-800 text-[10px] font-mono select-all">ID: {app.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(app).map(([key, value]) => {
                  if (['id', 'roleType'].includes(key)) return null;
                  return (
                    <div key={key} className="border-b border-zinc-900/50 pb-2">
                      <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-zinc-200 text-sm leading-relaxed">{String(value)}</p>
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