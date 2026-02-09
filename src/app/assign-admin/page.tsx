'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase'; // Pakeista, kad atitiktų tavo index.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AssignAdminPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Stebime vartotojo prisijungimą
  useEffect(() => {
    if (!auth) return;
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
        checkAdminStatus(u.uid);
      }
    });
    return () => unsub();
  }, [auth, router]);

  // 2. Patikriname, ar jau yra adminas
  const checkAdminStatus = async (uid: string) => {
    if (!db) return;
    try {
      const docRef = doc(db, 'roles_administrator', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHasAdminRole(true);
      }
    } catch (e) {
      console.error("Klaida tikrinant statusą:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!db || !user) {
      toast({
        variant: 'destructive',
        title: 'Klaida',
        description: 'Duomenų bazė nepasiekiama.',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const roleData = { 
        email: user.email, 
        assignedAt: new Date(),
        uid: user.uid 
      };

      await setDoc(doc(db, 'roles_administrator', user.uid), roleData);
      
      toast({
        title: 'Sėkmingai atlikta!',
        description: 'Administratoriaus teisės suteiktos.',
      });
      setHasAdminRole(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Klaida',
        description: 'Nepavyko priskirti teisių. Patikrinkite Firestore Rules.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Loader2 className="h-10 w-10 animate-spin text-red-600" />
    </div>
  );

  return (
    <div className="container flex min-h-screen items-center justify-center py-12 bg-black">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold uppercase tracking-tighter italic text-red-600">
            Sistemos Valdymas
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Paskyros teisių konfigūravimas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {hasAdminRole ? (
            <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg bg-red-600/10 border border-red-600/20">
              <ShieldCheck className="h-12 w-12 text-red-600" />
              <p className="font-bold uppercase text-sm">Jūs jau turite administratoriaus teises.</p>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white w-full" 
                onClick={() => router.push('/dashboard')}
              >
                Eiti į Valdymo Skydą
              </Button>
            </div>
          ) : (
             <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg bg-zinc-900 border border-zinc-800">
                <ShieldAlert className="h-12 w-12 text-zinc-600" />
                <p className="text-zinc-400 text-sm">Jūs šiuo metu neturite administratoriaus statuso duomenų bazėje.</p>
                <Button 
                  className="bg-white text-black hover:bg-zinc-200 w-full font-bold"
                  onClick={handleAssignRole} 
                  disabled={isProcessing}
                >
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Aktyvuoti Admin Prieigą
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}