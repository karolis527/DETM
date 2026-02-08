import { ModeratorForm } from "@/components/moderator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModeratorApplicationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline">DETM MODERATORIUS (Tvarka ir drausmė)</CardTitle>
        <CardDescription>
          Moderatorius yra komandos „filtras“ ir tvarkos garantas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ModeratorForm />
      </CardContent>
    </Card>
  );
}
