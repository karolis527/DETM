import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DeprecatedApplicationPage() {
  return (
    <div className="container flex items-center justify-center py-12">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-headline mt-4">Puslapis Nebenaudojamas</CardTitle>
                <CardDescription>
                    Šis puslapis buvo archyvuotas. Anketų peržiūra dabar vyksta prietaisų skydelyje.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard">Grįžti į Prietaisų Skydelį</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
