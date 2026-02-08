'use client';

import { useEffect, useState } from 'react';
import { useAuth, db } from '@/firebase'; // Įsitikink, kad db importuojamas iš tavo firebase konfigūracijos
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Tikriname prisijungimą. 
    // Jei auth yra undefined (dar kraunasi), nieko nedarom.
    if (auth === undefined) return;

    // Jei auth yra null (tikrai neprisijungęs), metam į login.
    if (auth === null) {
      router.push('/login');
      return;
    }

    // 2. Jei prisijungęs, krauname duomenis.
    console.log("Prisijungta kaip:", auth.email);
    
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Firestore klaida:", error);
      // Dažniausiai čia meta klaidą dėl "Missing or insufficient permissions"
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p className="animate-pulse">Kraunama sistema...</p>
    </div>
  );

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-5">
          <h1 className="text-3xl font-bold text-red-600">DETM Valdymo Skydas</h1>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Administratorius</p>
            <p className="text-sm font-mono text-zinc-300">{auth?.email}</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-500">Šiuo metu naujų anketų nėra.</p>
            <p className="text-xs text-zinc-700 mt-2">Patikrinkite Firestore kolekciją 'applications'</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app: any) => (
              <div key={app.id} className="group p-6 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-red-600 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-red-500 font-bold uppercase mb-1">{app.type || 'Atranka'}</p>
                    <h3 className="text-xl font-bold">{app.username || 'Vartotojas'}</h3>
                  </div>
                  <p className="text-xs text-zinc-600">
                    {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Data nežinoma'}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded text-zinc-300 text-sm italic border-l-2 border-red-600">
                  {app.message || app.content || 'Žinutės nėra.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}