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
    if (!auth || !mounted) return;

    setLoading(true);
    setError('');

    try {
      // SVARBU: Čia turi būti tavo Firebase užregistruotas el. paštas
      // Slaptažodis paimamas iš įvesties laukelio
      await signInWithEmailAndPassword(auth, "admin@detm.com", password);
      router.push('/dashboard'); 
    } catch (err: any) {
      // Konsolėje klaidą matysi tik tu (F12), bet vartotojas ekrane - ne
      console.error("Prisijungimo klaida"); 
      
      // Griežtai nustatome tik saugų tekstą, nenaudojant jokios info iš 'err' objekto
      setError('Prisijungimas nepavyko. Patikrinkite duomenis.');
      
      // Išvalome slaptažodžio laukelį saugumo sumetimais
      setPassword('');
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
              <label className="text-sm font-medium">Administratoriaus prieiga</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white focus:ring-red-600"
                placeholder="Įveskite slaptažodį"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/50">
                <p className="text-sm text-red-500 text-center font-medium">{error}</p>
              </div>
            )}
            <Button 
              type="submit" 
              disabled={loading || !auth}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
            >
              {loading ? 'Tikrinama...' : 'Prisijungti'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}