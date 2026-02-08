import { DesignerForm } from "@/components/designer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DesignerApplicationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline">DETM DIZAINERIS (Vizualinė dalis)</CardTitle>
        <CardDescription>
          Atsakingas už komandos įvaizdį, naujus rėmelius, fonus, reklaminius banerius ir kitą atributiką.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DesignerForm />
      </CardContent>
    </Card>
  );
}
