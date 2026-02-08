import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
            <CheckCircle className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">Ačiū!</CardTitle>
          <CardDescription>
            Jūsų anketa sėkmingai gauta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Jūsų paraišką peržiūrėsime per artimiausias 7 dienas. Su atrinktais kandidatais susisieksime asmeniškai.
          </p>
          <Button asChild>
            <Link href="/">Grįžti į pradžią</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
