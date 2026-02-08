"use client"; // Pridedame, kad išvengtume serverio/kliento konfliktų su sudėtingais UI komponentais

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, UserCog, Code, Palette } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const categories = [
    {
      title: "Tapti Moderatorimi",
      description: "Padėkite palaikyti tvarką ir saugią aplinką serveryje.",
      content: "Jeigu nori prisijungti prie mūsų Discord administracijos komandos, užpildyk šią anketą ir lauk atsakymo.",
      icon: <Shield className="w-8 h-8 text-primary" />,
      href: "/apply/moderator",
    },
    {
      title: "Tapti Administratoriumi",
      description: "Prisidėkite prie serverio valdymo ir plėtros.",
      content: "Ieškome patyrusių narių, kurie nori imtis daugiau atsakomybės ir padėti valdyti serverio techninę bei organizacinę pusę.",
      icon: <UserCog className="w-8 h-8 text-primary" />,
      href: "/apply/administrator",
    },
    {
      title: "Tapti Programuotoju",
      description: "Prisidėkite prie techninės serverio pusės ir automatizacijos.",
      content: "Ieškome programuotojų, kurie nori kurti bot'us, web sistemas ir padėti su techniniais sprendimais.",
      icon: <Code className="w-8 h-8 text-primary" />,
      href: "/apply/programmer",
    },
    {
      title: "Tapti Dizaineriu",
      description: "Būkite atsakingas už komandos vizualinį identitetą.",
      content: "Atsakingas už komandos įvaizdį, rėmelius, fonus, reklaminius banerius ir kitą atributiką.",
      icon: <Palette className="w-8 h-8 text-primary" />,
      href: "/apply/designer",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          DETM Anketos
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Norite prisijungti prie mūsų komandos? Užpildykite anketą ir tapkite mūsų bendruomenės dalimi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto">
        {categories.map((item, index) => (
          <Card key={index} className="flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                {item.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold leading-tight">{item.title}</CardTitle>
                <CardDescription className="mt-1">
                  {item.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="mb-6 text-muted-foreground text-sm flex-1">
                {item.content}
              </p>
              <Button asChild className="w-full group" size="lg">
                <Link href={item.href}>
                  Pildyti Anketą 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="text-center mt-20 text-muted-foreground text-sm border-t border-border pt-10">
        <p>Anketos peržiūra gali užtrukti iki 7 dienų. Atrinkti kandidatai bus informuoti asmeniškai.</p>
      </footer>
    </div>
  );
}