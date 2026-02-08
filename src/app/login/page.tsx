'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase'; // Naudojame mūsų saugų hook'ą
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);
    setError('');

    try {
      // Kadangi tavo formoje tik slaptažodis, darau prielaidą, 
      // kad naudoji fiksuotą admin el. paštą. Pakeisk jį savo:
      await signInWithEmailAndPassword(auth, "admin@detm.lt", password);
      router.push('/dashboard'); // Nukreipiame į dashboard po sėkmės
    } catch (err: any) {
      console.error(err);
      setError('Neteisingas slaptažodis arba prisijungimo klaida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Administratoriaus Prisijungimas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slaptažodis</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:ring-red-500"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
            >
              {loading ? 'Jungiamasi...' : 'Prisijungti'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}