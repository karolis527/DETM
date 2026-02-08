"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Loader2, LogIn } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Nuorodų konfigūracija iškelta į išorę, kad kodas būtų skaitomesnis
const PUBLIC_LINKS = [
  { href: "/apply/moderator", label: "Moderatoriaus Anketa" },
  { href: "/apply/administrator", label: "Administratoriaus Anketa" },
];

const PRIVATE_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assign-admin", label: "Priskirti Admin Teises" },
];

const DevilLogo = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 21s3-3 5-6 3-5 3-8a5 5 0 0 0-8-4 5 5 0 0 0-8 4c0 3 1 5 3 8 2 3 5 6 5 6Z" />
    <circle cx="14.5" cy="11.5" r=".5" fill="currentColor" />
    <circle cx="9.5" cy="11.5" r=".5" fill="currentColor" />
    <path d="M7 16c.5.5 1.5 2 5 2s4.5-1.5 5-2" />
  </svg>
);

export default function Header() {
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Užtikriname, kad komponentas pilnai užsikrovė pas vartotoją (Hydration Fix)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
        router.push("/");
      } catch (error) {
        console.error("Atsijungimo klaida:", error);
      }
    }
  };

  const renderNavLinks = (isMobile = false) => {
    // Kol kraunasi arba kol serveris generuoja kodą, rodome krovimosi būseną
    if (!mounted || isUserLoading) {
      return isMobile ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="w-20 h-4 bg-muted animate-pulse rounded" />
          <div className="w-20 h-4 bg-muted animate-pulse rounded" />
        </div>
      );
    }

    // Sujungiame viešas ir privačias nuorodas, jei vartotojas prisijungęs
    const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

    return links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`font-medium text-muted-foreground transition-colors hover:text-foreground ${
          isMobile ? "text-lg py-2" : "text-sm"
        }`}
      >
        {link.label}
      </Link>
    ));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <DevilLogo className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">DETM Anketos</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {renderNavLinks()}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Prisijungimo / Atsijungimo mygtukai */}
          {mounted && !isUserLoading && (
            <>
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Atsijungti
                </Button>
              ) : (
                <Button asChild variant="default" size="sm" className="hidden sm:flex">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Prisijungti
                  </Link>
                </Button>
              )}
            </>
          )}

          {/* Mobilus Meniu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Atidaryti meniu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <DevilLogo className="h-5 w-5 text-primary" />
                  DETM Anketos
                </SheetTitle>
                <SheetDescription className="text-left">
                  Pagrindinė navigacija ir valdymas.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">
                  {renderNavLinks(true)}
                  <hr className="my-2 border-border" />
                  {mounted && !isUserLoading && (
                    user ? (
                      <Button variant="outline" onClick={handleSignOut} className="justify-start w-full">
                        <LogOut className="mr-2 h-5 w-5" />
                        Atsijungti
                      </Button>
                    ) : (
                      <Button asChild className="justify-start w-full">
                        <Link href="/login">
                          <LogIn className="mr-2 h-5 w-5" />
                          Prisijungti
                        </Link>
                      </Button>
                    )
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}