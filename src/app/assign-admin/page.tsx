'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/provider';
import type { SecurityRuleContext } from '@/firebase/errors';

export default function AssignAdminPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'roles_administrator', user.uid);
  }, [firestore, user]);

  const { data: adminRoleDoc, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);

  const hasAdminRole = !!adminRoleDoc;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleAssignRole = async () => {
    if (!firestore || !user || !adminRoleRef) {
      toast({
        variant: 'destructive',
        title: 'Klaida',
        description: 'Vartotojas neprisijungęs arba duomenų bazė nepasiekiama.',
      });
      return;
    }

    if (hasAdminRole) {
       toast({
          title: 'Informacija',
          description: 'Jūs jau turite administratoriaus teises.',
        });
       router.push('/dashboard');
       return;
    }
      
    setIsProcessing(true);
    
    const roleData = { email: user.email, assignedAt: new Date() };

    setDoc(adminRoleRef, roleData)
      .then(() => {
        toast({
          title: 'Sėkmingai atlikta!',
          description: 'Administratoriaus teisės suteiktos. Būsite nukreiptas į prietaisų skydelį.',
          className: 'bg-accent text-accent-foreground',
        });
        setTimeout(() => router.push('/dashboard'), 2000);
      })
      .catch(() => {
        const permissionError = new FirestorePermissionError({
          path: adminRoleRef.path,
          operation: 'create',
          requestResourceData: roleData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: 'destructive',
            title: 'Klaida',
            description: 'Nepavyko priskirti teisių. Bandykite dar kartą.',
        });
      }).finally(() => {
          setIsProcessing(false);
      });
  };

  const isLoading = isUserLoading || isAdminRoleLoading;

  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Administratoriaus Teisių Suteikimas</CardTitle>
          <CardDescription>
            Paspauskite mygtuką, kad savo paskyrai suteiktumėte administratoriaus teises.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {isLoading ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : hasAdminRole ? (
            <div className="flex flex-col items-center text-center gap-4 p-4 rounded-lg bg-accent/10">
              <ShieldCheck className="h-12 w-12 text-accent" />
              <p className="font-medium text-accent-foreground">Jūs jau turite administratoriaus teises.</p>
              <Button onClick={() => router.push('/dashboard')}>Eiti į Prietaisų Skydelį</Button>
            </div>
          ) : (
             <div className="flex flex-col items-center text-center gap-4 p-4 rounded-lg bg-destructive/10">
                <ShieldAlert className="h-12 w-12 text-destructive" />
                <p className="font-medium text-destructive-foreground">Jūs šiuo metu neturite administratoriaus teisių.</p>
                <Button onClick={handleAssignRole} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suteikti Admin Teises
                </Button>
            </div>
          )}
           <p className="text-xs text-muted-foreground text-center mt-4">
            Šis veiksmas reikalingas tik vieną kartą. Jis įrašo jūsų vartotojo ID į specialią
            kolekciją Firestore duomenų bazėje, kurią saugumo taisyklės naudoja patikrinti administratoriaus statusą.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
