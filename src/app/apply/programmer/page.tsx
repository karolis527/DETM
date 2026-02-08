import { ProgrammerForm } from "@/components/programmer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgrammerApplicationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline">DETM PROGRAMUOTOJAS (Techninė dalis)</CardTitle>
        <CardDescription>
          Žmogus, kuris atsakingas už automatizaciją ir techninį stabilumą.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProgrammerForm />
      </CardContent>
    </Card>
  );
}
