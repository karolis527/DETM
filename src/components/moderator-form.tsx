"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ModeratorApplicationValues } from "@/lib/schemas";
import { moderatorApplicationSchema } from "@/lib/schemas";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function ModeratorForm() {
  const [isPending, setIsPending] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ModeratorApplicationValues>({
    resolver: zodResolver(moderatorApplicationSchema),
    defaultValues: {
      discordUsername: "",
      age: '' as unknown as number,
      timeSpentOnPlatforms: "",
      discordModerationSkills: "",
      reactionToSpam: "",
      fakeAccountRecognition: "",
      inappropriateBehaviorResponse: "",
      chatRaidResponse: "",
      attributeComplianceCheck: "",
      patienceLevel: "",
      explainingRulesToNewcomer: "",
      teamworkPreference: "",
      offCommunityBehavior: "",
      botConfigurationExperience: "",
      unprovenComplaintsResponse: "",
      warningOrPunishment: "",
    },
  });

 async function onSubmit(data: ModeratorApplicationValues) {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Klaida",
            description: "Nepavyko prisijungti prie duomenų bazės.",
        });
        return;
    }

    setIsPending(true);

    try {
        await addDoc(collection(firestore, "applications_moderator"), {
            ...data,
            applicationDate: new Date(),
            status: 'pending',
        });
        router.push('/apply/thank-you');
    } catch (error) {
        console.error("Error submitting application:", error);
        toast({
            variant: "destructive",
            title: "Klaida",
            description: "Pateikiant anketą įvyko klaida. Bandykite dar kartą.",
        });
    } finally {
        setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">👤 Pagrindinė Informacija</h3>
           <FormField
            control={form.control}
            name="discordUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slapyvardis discord</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: Sizifas#0000 arba username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amžius</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Įveskite savo amžių" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">🧠 Patirtis ir Įgūdžiai</h3>
          <FormField
            control={form.control}
            name="timeSpentOnPlatforms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kiek laiko praleidi TikTok, Messenger ir Discord platformose kasdien?</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz., 3-4 valandas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discordModerationSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar moki naudoti visas Discord moderavimo funkcijas (timeout, ban ir t.t.)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="botConfigurationExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar turi patirties su botų konfigūravimu (Automod)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo patirtį..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamworkPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar moki dirbti komandoje su kitais moderatoriais, ar linkęs sprendimus priimti vienas?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">⚡ Situacijų valdymas</h3>
          <FormField
            control={form.control}
            name="reactionToSpam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip reaguotum į narį, kuris kelia „spam“ arba reklamuoja kitas komandas?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fakeAccountRecognition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar žinai, kaip atpažinti „fake“ anketas ar šnipus iš kitų komandų?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo metodus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inappropriateBehaviorResponse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ką darytum, jei narys naudoja DETM foną, bet elgiasi neadekvačiai ir gėdina komandos vardą?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="chatRaidResponse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip elgtumeisi, jei „Messenger“ grupėje prasidėtų masinis pyktis („chat raid“)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="offCommunityBehavior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip elgtumeisi, jei pamatytum narį, kuris nesilaiko DETM vertybių už bendruomenės ribų?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unprovenComplaintsResponse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ką darytum, jei tave užplūstų privati žinutė su skundais apie kitą narį be įrodymų?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">✅ Požiūris ir Atsakomybė</h3>
          <FormField
            control={form.control}
            name="attributeComplianceCheck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar esi pasiruošęs tikrinti, ar visi 40+ narių laikosi atributikos naudojimo taisyklių?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokia tavo kantrybės riba skalėje nuo 1 iki 10? Paaiškink kodėl.</FormLabel>
                <FormControl>
                  <Textarea placeholder="Įvertinkite ir paaiškinkite..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="explainingRulesToNewcomer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip paaiškintum naujokui, kodėl DETM taisyklės yra svarbios?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo paaiškinimą..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="warningOrPunishment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar sutinki su taisykle: „Pirmiausia perspėjimas, tada nuobauda“, ar esi griežtesnis?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų požiūris..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Siunčiama..." : "Pateikti Anketą"}
        </Button>
      </form>
    </Form>
  );
}
