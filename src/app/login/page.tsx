'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tikriname ar auth objektas pasiruošęs
    if (!auth) {
      setError('Sistemos klaida: Firebase ryšys nepasiekiamas.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // SVARBU: Įsitikink, kad šis email yra sukurtas tavo Firebase Authentication skiltyje!
      await signInWithEmailAndPassword(auth, "admin@detm.com", password);
      
      // Sėkmės atveju nukreipiame
      router.push('/dashboard'); 
      router.refresh(); // Priverstinis atnaujinimas Next.js 15
    } catch (err: any) {
      console.error("Login Error:", err.code); // Matysi tikslų klaidą konsolėje (F12)
      
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Neteisingas slaptažodis arba el. paštas.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Per daug bandymų. Palaukite kelias minutes.');
      } else {
        setError('Prisijungti nepavyko. Bandykite dar kartą.');
      }
      
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-sans">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black text-center italic text-red-600 uppercase tracking-tighter">
            DETM AUTH
          </CardTitle>
          <p className="text-center text-zinc-500 text-[10px] uppercase tracking-widest">Administratoriaus prieiga</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-400">Prieigos raktas</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white focus:border-red-600 focus:ring-0 rounded-none h-12"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border-l-2 border-red-500">
                <p className="text-xs text-red-500 font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !auth}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-none h-12 transition-all active:scale-[0.98]"
            >
              {loading ? 'Jungiamasi...' : 'Patvirtinti'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}