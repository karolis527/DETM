
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
import type { ProgrammerApplicationValues } from "@/lib/schemas";
import { programmerApplicationSchema } from "@/lib/schemas";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function ProgrammerForm() {
  const [isPending, setIsPending] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProgrammerApplicationValues>({
    resolver: zodResolver(programmerApplicationSchema),
    defaultValues: {
      discordUsername: "",
      programmingExperience: "",
      age: "" as unknown as number,
      programmingLanguages: "",
      discordBotExperience: "",
      databaseKnowledge: "",
      tiktokApiIntegration: "",
      attributeCheckSystem: "",
      registrationFormCreation: "",
      bugFixingTime: "",
      securityMeasures: "",
      webhookExperience: "",
      websiteExperience: "",
      serverOptimization: "",
      confidentialityAgreement: "",
      codeStorageTools: "",
      problemSolvingTime: "",
    },
  });

  async function onSubmit(data: ProgrammerApplicationValues) {
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
      await addDoc(collection(firestore, "applications_programmer"), {
        ...data,
        applicationDate: new Date(),
        status: "pending",
      });
      router.push("/apply/thank-you");
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
          <h3 className="text-lg font-medium font-headline">👤 Asmeninė Informacija</h3>
          <FormField
            control={form.control}
            name="discordUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slapyvardis Discord</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: Sizifas#0000" {...field} />
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
           <FormField
            control={form.control}
            name="programmingExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tavo programavimo patirtis (metais/mėnesiais)</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: 2 metai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">🛠️ Techniniai Įgūdžiai</h3>
          <FormField
            control={form.control}
            name="programmingLanguages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokias kalbas naudoji (JS, Python, C++, PHP ir t.t.)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Išvardinkite kalbas, kurias mokate..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discordBotExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar esi kūręs Discord botus nuo nulio? Jei taip, kokias funkcijas jie turėjo?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo patirtį..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="databaseKnowledge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar išmanai duomenų bazes (SQL, MongoDB)? (Svarbu narių apskaitai).</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo žinias..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="webhookExperience"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Ar moki dirbti su Webhook'ais?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Aprašykite savo patirtį..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
           />
           <FormField
            control={form.control}
            name="websiteExperience"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Ar turi patirties kuriant internetinius puslapius (DETM vizitinei kortelei)?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Aprašykite savo patirtį..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
           />
           <FormField
            control={form.control}
            name="codeStorageTools"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Kokius įrankius naudoji kodo saugojimui (GitHub, GitLab)?</FormLabel>
                    <FormControl>
                        <Input placeholder="Pvz: GitHub" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">⚡ Situacijų Valdymas ir Problemų Sprendimas</h3>
           <FormField
            control={form.control}
            name="tiktokApiIntegration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar moki susieti TikTok API su Discord (pvz., pranešimai apie naujus video/live)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo idėjas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attributeCheckSystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip sukurtum sistemą, kuri automatiškai tikrintų, ar narys turi DETM atributiką?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo siūlomą sprendimą..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationFormCreation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar gali sukurti registracijos formą (web ar bot pavidalu), kuri saugotų narių duomenis?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite, kaip tai darytumėte..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="securityMeasures"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Kaip apsaugotum serverį nuo „token logging“ ar kitų hakerių atakų?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Aprašykite priemones, kurių imtumėtės..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="serverOptimization"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Kaip optimizuotum Discord serverį, kad jis veiktų greitai net esant 100+ narių?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Aprašykite optimizavimo strategijas..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="problemSolvingTime"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Jei gautum užduotį, kurios nemoki atlikti, per kiek laiko rastum sprendimą internete?</FormLabel>
                    <FormControl>
                        <Input placeholder="Pvz: per kelias valandas/dieną" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

         <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">💼 Požiūris ir Atsakomybė</h3>
          <FormField
            control={form.control}
            name="bugFixingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kiek laiko galėtum skirti klaidų (bugų) taisymui, jei sistema „nulūžtų“?</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: Iškart, kai tik galėsiu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="confidentialityAgreement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar sutinki dirbti prie projektų, kurie gali būti konfidencialūs (DETM vidaus sistema)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
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
