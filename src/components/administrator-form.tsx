
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdministratorApplicationValues } from "@/lib/schemas";
import { administratorApplicationSchema } from "@/lib/schemas";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function AdministratorForm() {
  const [isPending, setIsPending] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<AdministratorApplicationValues>({
    resolver: zodResolver(administratorApplicationSchema),
    defaultValues: {
      nickname: "",
      age: "" as unknown as number,
      reasonForChoosingDETM: "",
      characterTraits: "",
      leadershipExperience: "",
      handlingAdminAbuse: "",
      visionForDETM: "",
      solvingInactivity: "",
      handlingPublicInsults: "",
      timeCommitment: "",
      removingFriend: "",
      attractingNewMembers: "",
      resolvingInternalConflicts: "",
      meetingAndDelegationSkills: "",
      opinionOnReputation: "",
      whyChooseYou: "",
    },
  });

  async function onSubmit(data: AdministratorApplicationValues) {
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
      await addDoc(collection(firestore, "applications_administrator"), {
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
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slapyvardis</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: Sizifas" {...field} />
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
          <h3 className="text-lg font-medium font-headline">🎯 Motyvacija ir Charakteris</h3>
          <FormField
            control={form.control}
            name="reasonForChoosingDETM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kodėl pasirinkai būtent DETM, o ne kitą TikTok komandą?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="characterTraits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apibūdink savo charakterį trimis žodžiais. Kodėl šios savybės tinka Adminui?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Pvz: Atsakingas, kūrybiškas, komunikabilus, nes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">💼 Patirtis ir Įgūdžiai</h3>
          <FormField
            control={form.control}
            name="leadershipExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokia tavo patirtis vadovaujant žmonėms (kituose projektuose, žaidimuose, darbe)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo patirtį..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingAndDelegationSkills"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Ar moki rengti susirinkimus ir aiškiai deleguoti užduotis kitiems?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Aprašykite savo gebėjimus..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
           />
           <FormField
            control={form.control}
            name="timeCommitment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokią laiko dalį per parą gali skirti DETM reikalams tvarkyti?</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: 2-3 valandas per dieną" {...field} />
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
            name="handlingAdminAbuse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip elgtumeisi, jei pastebėtum, kad kitas Adminas piktnaudžiauja savo galiomis?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="solvingInactivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip spręstum problemą, jei komandos aktyvumas staigiai nukristų?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo sprendimo būdus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handlingPublicInsults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar gebi išlikti šaltakraujiškas, kai tave įžeidinėja viešai? Pateik pavyzdį.</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite situaciją ir savo reakciją..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="removingFriend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jei reikėtų pašalinti seną narį, kuris yra tavo draugas, bet pažeidė taisykles – ar tai padarytum?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resolvingInternalConflicts"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Ką darytum, jei komandos viduje susikurtų „grupuotės“, kurios pykstasi tarpusavyje?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

         <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">📈 Strategija ir Vizija</h3>
          <FormField
            control={form.control}
            name="visionForDETM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokia tavo vizija: kur DETM turėtų būti po 6 mėnesių?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo ilgalaikius tikslus komandai..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="attractingNewMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip pritrauktum naujų, kokybiškų narių į komandą?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo idėjas ir metodus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="opinionOnReputation"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Kokia tavo nuomonė apie DETM reputaciją šiuo metu? Ką reikėtų taisyti?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Jūsų įžvalgos..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="space-y-4">
             <h3 className="text-lg font-medium font-headline">🏆 Pabaigai</h3>
             <FormField
                control={form.control}
                name="whyChooseYou"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kodėl turėtume pasirinkti būtent tave, o ne kitą kandidatą?</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Įtikinkite mus!" {...field} />
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

    