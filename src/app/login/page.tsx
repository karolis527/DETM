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

  // Saugiklis, kad kodas veiktų tik naršyklėje
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !mounted) return;

    setLoading(true);
    setError('');

    try {
      // SVARBU: Čia įrašyk savo Firebase registruotą administratoriaus el. paštą
      // Jei naudojate tik slaptažodį, Firebase vis tiek reikalauja el. pašto.
      await signInWithEmailAndPassword(auth, "tavo-email@gmail.com", password);
      router.push('/dashboard'); 
    } catch (err: any) {
      console.error("Login error:", err);
      setError('Neteisingas slaptažodis arba sisteminė klaida.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">DETM Administracija</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Įveskite administratoriaus slaptažodį</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button 
              type="submit" 
              disabled={loading || !auth}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Jungiamasi...' : 'Prisijungti'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}