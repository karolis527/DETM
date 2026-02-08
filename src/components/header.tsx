"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Loader2, LogIn } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const publicNavLinks = [
  { href: "/apply/moderator", label: "Moderatoriaus Anketa" },
  { href: "/apply/administrator", label: "Administratoriaus Anketa" },
];

const privateNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assign-admin", label: "Priskirti Admin Teises" },
];

const DevilLogo = ({ className }: { className?: string }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12.0001 21.0001C12.0001 21.0001 15.0001 18.0001 17.0001 15.0001C19.0001 12.0001 20.0001 10.0001 20.0001 7.00006C20.0001 4.23864 17.7615 2.00006 15.0001 2.00006C13.5001 2.00006 12.1001 2.90006 11.5001 4.00006" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 4C11.9 2.9 10.5 2 9 2C6.23858 2 4 4.23858 4 7C4 10 5 12 7 15C9 18 12 21 12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 11.5C16 12.3284 15.3284 13 14.5 13C13.6716 13 13 12.3284 13 11.5C13 10.6716 13.6716 10 14.5 10C15.3284 10 16 10.6716 16 11.5Z" fill="currentColor"/>
      <path d="M11 11.5C11 12.3284 10.3284 13 9.5 13C8.67157 13 8 12.3284 8 11.5C8 10.6716 8.67157 10 9.5 10C10.3284 10 11 10.6716 11 11.5Z" fill="currentColor"/>
      <path d="M7 16C7 16 8.5 18 12 18C15.5 18 17 16 17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

export default function Header() {
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  const renderNavLinks = (isMobile = false) => {
    const linksToShow = user ? privateNavLinks : [];

    if (!isClient || isUserLoading) {
      if (isMobile) {
        return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
      }
      return <div className="flex items-center gap-6">{publicNavLinks.map(link => <div key={link.href} className="w-24 h-4 bg-muted rounded-md animate-pulse" />)}</div>
    }
    
    const allLinks = user ? [...publicNavLinks, ...privateNavLinks] : publicNavLinks;


    return allLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground ${!isMobile && "sm:text-sm"}`}
      >
        {link.label}
      </Link>
    ));
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <DevilLogo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              DETM Anketos
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
             {isClient && !isUserLoading && renderNavLinks()}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           {isClient && !isUserLoading && user && (
             <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Atsijungti</span>
            </Button>
          )}
          {isClient && !isUserLoading && !user && (
            <Button asChild variant="outline">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Prisijungti
              </Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                  <SheetTitle>Meniu</SheetTitle>
                  <SheetDescription>Pagrindinė navigacija</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center space-x-2">
                   <DevilLogo className="h-6 w-6 text-primary" />
                  <span className="font-bold">DETM Anketos</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {renderNavLinks(true)}
                   {isClient && !isUserLoading && user && (
                    <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                        <LogOut className="mr-2 h-5 w-5" />
                        Atsijungti
                    </Button>
                  )}
                  {isClient && !isUserLoading && !user && (
                     <Button asChild>
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Prisijungti
                      </Link>
                    </Button>
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
