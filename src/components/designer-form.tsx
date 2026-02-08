
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
import type { DesignerApplicationValues } from "@/lib/schemas";
import { designerApplicationSchema } from "@/lib/schemas";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function DesignerForm() {
  const [isPending, setIsPending] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<DesignerApplicationValues>({
    resolver: zodResolver(designerApplicationSchema),
    defaultValues: {
      discordUsername: "",
      age: "" as unknown as number,
      designPrograms: "",
      experienceWithFrames: "",
      portfolioLink: "",
      frameCreationTime: "",
      styleDescription: "",
      handlingFeedback: "",
      videoEditingSkills: "",
      logoDesignSkills: "",
      timeCommitmentWeekly: "",
      handlingPlagiarism: "",
      animationSkills: "",
      opinionOnCurrentArt: "",
      reasonForJoining: "",
    },
  });

  async function onSubmit(data: DesignerApplicationValues) {
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
      await addDoc(collection(firestore, "applications_designer"), {
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
                <FormLabel>Koks tavo Discord slapyvardis?</FormLabel>
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
                <FormLabel>Koks tavo tikrasis amžius?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Įveskite savo amžių" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">🎨 Įgūdžiai ir Patirtis</h3>
          <FormField
            control={form.control}
            name="designPrograms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokiomis grafinio dizaino programomis dirbi?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Pvz., Photoshop, Illustrator, Canva, PicsArt..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceWithFrames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar turi patirties kuriant būtent TikTok rėmelius (frames) ir fonus (backgrounds)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo patirtį..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolioLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar gali pateikti savo darbų pavyzdžių (portfolio arba nuoroda į darbus)?</FormLabel>
                <FormControl>
                  <Input placeholder="Įklijuokite nuorodą arba parašykite 'neturiu'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frameCreationTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kiek laiko vidutiniškai tau užtrunka sukurti vieną kokybišką rėmelį nuo idėjos iki galutinio rezultato?</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz., 1-2 valandas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="videoEditingSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar moki dirbti su video montavimu (pvz., kurti trumpus reklaminius video ar intro komandai)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logoDesignSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar moki kurti logotipus, kurie gerai atrodytų tiek mažoje profilio nuotraukoje, tiek dideliame fone?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="animationSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ar moki dirbti su animacija (pvz., judantys elementai Discord serverio profiliui ar TikTok video)?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų atsakymas..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">👁️ Požiūris ir Stilius</h3>
          <FormField
            control={form.control}
            name="styleDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip apibūdintum savo stilių? Ar gebi prisitaikyti prie „Dark Evil Team“ tamsios ir agresyvios estetikos?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo stilių ir požiūrį..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handlingFeedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ką darytum, jei Adminas paprašytų perdaryti dizainą, nes jis „neatitinka komandos vizijos“?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handlingPlagiarism"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaip elgtumeisi, jei pamatytum, kad kita komanda pavogė tavo sukurtą rėmelį ir naudoja kaip savo?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Aprašykite savo veiksmus..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="opinionOnCurrentArt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kokia tavo nuomonė apie dabartinę DETM atributiką? Ką joje pakeistum pirmiausia?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų įžvalgos..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">🏆 Motyvacija</h3>
          <FormField
            control={form.control}
            name="timeCommitmentWeekly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kiek laiko per savaitę gali skirti DETM dizaino užduotims atlikti?</FormLabel>
                <FormControl>
                  <Input placeholder="Pvz: 5-10 valandų per savaitę" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reasonForJoining"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kodėl nori kurti būtent DETM komandai, o ne dirbti individualiai?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jūsų motyvacija..." {...field} />
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
