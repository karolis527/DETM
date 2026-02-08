"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@detm.com";

const loginSchema = z.object({
  password: z.string().min(8, "Slaptažodis turi būti bent 8 simbolių ilgio."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(data: LoginValues) {
    startTransition(async () => {
      if (!auth) {
        toast({
          variant: "destructive",
          title: "Klaida",
          description: "Autentifikacijos paslauga nepasiekiama.",
        });
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, data.password);
        router.push("/dashboard");
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
             toast({
                variant: "destructive",
                title: "SVARBU: Administratoriaus paskyra nerasta!",
                description: `Prašome sukurti vartotoją savo Firebase projekto 'Authentication' skiltyje su šiais duomenimis: El. paštas: ${ADMIN_EMAIL}, Slaptažodis: DETMadmin`,
                duration: 15000,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Prisijungti nepavyko",
                description: "Įvyko netikėta klaida. Bandykite vėliau.",
            })
        }
      }
    });
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Administratoriaus Prisijungimas</CardTitle>
          <CardDescription>
            Įveskite slaptažodį, kad galėtumėte peržiūrėti anketas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slaptažodis</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Jungiamasi..." : "Prisijungti"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
