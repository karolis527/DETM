import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
// Pakeistas importas, kad atitiktų tavo eksportą iš @/firebase
import { ClientFirebaseProvider } from "@/firebase";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fontSourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

export const metadata: Metadata = {
  title: "DETM Anketos",
  description: "Apply to become a moderator or administrator for our Discord server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body 
        className={cn(
          "min-h-screen bg-background font-body antialiased", 
          fontInter.variable, 
          fontSourceCodePro.variable
        )}
      >
        {/* Naudojame ClientFirebaseProvider, kaip nurodyta client-provider.tsx faile */}
        <ClientFirebaseProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ClientFirebaseProvider>
      </body>
    </html>
  );
}