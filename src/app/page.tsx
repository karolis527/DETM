import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, UserCog, Code, Palette } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
          DETM Anketos
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Norite prisijungti prie mūsų komandos? Užpildykite anketą ir tapkite mūsų bendruomenės dalimi.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto">
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">Tapti Moderatorimi</CardTitle>
              <CardDescription>
                Padėkite palaikyti tvarką ir saugią aplinką serveryje.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Jeigu nori prisijungti prie mūsų Discord administracijos komandos, užpildyk šią anketą ir lauk atsakymo.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/apply/moderator">
                Pildyti Anketą <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <UserCog className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">Tapti Administratoriumi</CardTitle>
              <CardDescription>
                Prisidėkite prie serverio valdymo ir plėtros.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Ieškome patyrusių narių, kurie nori imtis daugiau atsakomybės ir padėti valdyti serverio techninę bei organizacinę pusę.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/apply/administrator">
                Pildyti Anketą <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Code className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">Tapti Programuotoju</CardTitle>
              <CardDescription>
                Prisidėkite prie techninės serverio pusės ir automatizacijos.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Ieškome programuotojų, kurie nori kurti bot'us, web sistemas ir padėti su techniniais sprendimais.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/apply/programmer">
                Pildyti Anketą <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <Palette className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">Tapti Dizaineriu</CardTitle>
              <CardDescription>
                Būkite atsakingas už komandos vizualinį identitetą.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
             Atsakingas už komandos įvaizdį, rėmelius, fonus, reklaminius banerius ir kitą atributiką.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/apply/designer">
                Pildyti Anketą <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
       <footer className="text-center mt-20 text-muted-foreground text-sm">
        <p>Anketos peržiūra gali užtrukti iki 7 dienų. Atrinkti kandidatai bus informuoti asmeniškai.</p>
      </footer>
    </div>
  );
}
