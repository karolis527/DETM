import { AdministratorForm } from "@/components/administrator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdministratorApplicationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline">DETM ADMIN (Vadovybė ir strategija)</CardTitle>
        <CardDescription>
          Adminas turi būti lyderis, gebantis valdyti krizes ir komandos augimą.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdministratorForm />
      </CardContent>
    </Card>
  );
}
