
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Loader2, ShieldAlert, Trash } from "lucide-react";
import { useCollection, useUser, useDoc, errorEmitter, FirestorePermissionError } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import { format } from 'date-fns';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { SecurityRuleContext } from '@/firebase/errors';


// --- Field labels and status helpers ---
const fieldLabels: Record<string, string> = {
    // Admin fields
    nickname: "Slapyvardis",
    reasonForChoosingDETM: "Kodėl pasirinkai DETM?",
    characterTraits: "Charakterio savybės",
    leadershipExperience: "Vadovavimo patirtis",
    handlingAdminAbuse: "Reakcija į admino piktnaudžiavimą",
    visionForDETM: "DETM vizija po 6 mėn.",
    solvingInactivity: "Aktyvumo problemos sprendimas",
    handlingPublicInsults: "Reakcija į viešus įžeidinėjimus",
    removingFriend: "Draugo pašalinimas pažeidus taisykles",
    attractingNewMembers: "Naujų narių pritraukimas",
    resolvingInternalConflicts: "Vidinių konfliktų sprendimas",
    meetingAndDelegationSkills: "Susirinkimų rengimas ir delegavimas",
    opinionOnReputation: "Nuomonė apie DETM reputaciją",
    whyChooseYou: "Kodėl turėtume pasirinkti tave?",

    // Moderator fields
    discordUsername: "Discord Slapyvardis",
    age: "Amžius",
    timeSpentOnPlatforms: "Laikas platformose",
    discordModerationSkills: "Discord moderavimo įgūdžiai",
    reactionToSpam: "Reakcija į spam/reklamą",
    fakeAccountRecognition: "Fake anketų atpažinimas",
    inappropriateBehaviorResponse: "Reakcija į netinkamą elgesį",
    chatRaidResponse: "Reakcija į masinį pyktį (chat raid)",
    attributeComplianceCheck: "Atributikos taisyklių tikrinimas",
    patienceLevel: "Kantrybės lygis (1-10)",
    explainingRulesToNewcomer: "Taisyklių aiškinimas naujokui",
    teamworkPreference: "Darbas komandoje",
    offCommunityBehavior: "Elgesys už bendruomenės ribų",
    botConfigurationExperience: "Patirtis su bot'ais (Automod)",
    unprovenComplaintsResponse: "Reakcija į skundus be įrodymų",
    warningOrPunishment: "Perspėjimas ar nuobauda?",
    
    // Programmer fields
    programmingExperience: "Programavimo patirtis",
    programmingLanguages: "Programavimo kalbos",
    discordBotExperience: "Discord botų kūrimo patirtis",
    databaseKnowledge: "Duomenų bazių išmanymas",
    tiktokApiIntegration: "TikTok API integravimas",
    attributeCheckSystem: "Atributikos tikrinimo sistema",
    registrationFormCreation: "Registracijos formos kūrimas",
    bugFixingTime: "Klaidų taisymo laikas",
    securityMeasures: "Apsaugos priemonės",
    webhookExperience: "Webhook patirtis",
    websiteExperience: "Internetinių puslapių kūrimo patirtis",
    serverOptimization: "Serverio optimizavimas",
    confidentialityAgreement: "Konfidencialumo sutikimas",
    codeStorageTools: "Kodo saugojimo įrankiai",
    problemSolvingTime: "Problemų sprendimo laikas",

    // Designer fields
    designPrograms: "Dizaino programos",
    experienceWithFrames: "Patirtis su rėmeliais/fonais",
    portfolioLink: "Portfolio nuoroda",
    frameCreationTime: "Rėmelio kūrimo laikas",
    styleDescription: "Stiliaus aprašymas",
    handlingFeedback: "Reakcija į kritiką",
    videoEditingSkills: "Video montavimo įgūdžiai",
    logoDesignSkills: "Logotipų kūrimo įgūdžiai",
    timeCommitmentWeekly: "Laiko įsipareigojimas per savaitę",
    handlingPlagiarism: "Reakcija į plagiatą",
    animationSkills: "Animacijos įgūdžiai",
    opinionOnCurrentArt: "Nuomonė apie dabartinę atributiką",
    reasonForJoining: "Kodėl nori prisijungti?",

    // Shared fields
    timeCommitment: "Laiko Įsipareigojimas",
    applicationDate: "Anketos Pateikimo Data",
    status: "Būsena",
};

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': default: return 'secondary';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Patvirtinta';
      case 'rejected': return 'Atmesta';
      case 'pending': default: return 'Peržiūrima';
    }
};
  
const getStatusClass = (status: string) => {
     switch (status) {
      case 'approved': return "bg-accent text-accent-foreground";
      default: return "";
    }
}
// --- End of helpers ---


type Application = {
  id: string;
  discordUsername: string;
  nickname: string;
  role: 'Moderatorius' | 'Administratorius' | 'Programuotojas' | 'Dizaineris';
  applicationDate: { seconds: number, nanoseconds: number } | string;
  status: 'pending' | 'approved' | 'rejected';
  collectionName: 'applications_moderator' | 'applications_administrator' | 'applications_programmer' | 'applications_designer';
};


// Detail view component to be used inside the dialog
function ApplicationDetail({ collectionName, docId }: { collectionName: string, docId: string }) {
    const firestore = useFirestore();

    const applicationRef = useMemoFirebase(() => {
        if (!firestore || !collectionName || !docId) return null;
        return doc(firestore, collectionName, docId as string);
    }, [firestore, collectionName, docId]);

    const { data: application, isLoading, error } = useDoc(applicationRef);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }
    
    if (error) {
         return (
             <div className="container flex items-center justify-center py-12">
                <Card className="w-full max-w-lg text-center border-none shadow-none">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <ShieldAlert className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-2xl font-headline mt-4">Klaida</CardTitle>
                        <CardDescription>
                            Nepavyko gauti anketos duomenų. Tikėtina, kad neturite teisių arba tokia anketa neegzistuoja.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (!application) {
        return (
            <div className="container flex items-center justify-center py-12">
                <Card className="w-full max-w-lg text-center border-none shadow-none">
                    <CardHeader>
                         <CardTitle className="text-2xl font-headline mt-4">Anketa Nerasta</CardTitle>
                        <CardDescription>
                            Anketa su nurodytu ID nebuvo rasta.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const applicationData = Object.entries(application).filter(([key]) => key !== 'id');

    const getRoleDescription = () => {
        switch (collectionName) {
            case 'applications_moderator': return 'Moderatoriaus';
            case 'applications_administrator': return 'Administratoriaus';
            case 'applications_programmer': return 'Programuotojo';
            case 'applications_designer': return 'Dizainerio';
            default: return '';
        }
    }

    return (
        <>
            <DialogHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <DialogTitle className="text-3xl font-headline">Anketos peržiūra: {application.nickname || application.discordUsername}</DialogTitle>
                        <DialogDescription>
                            {getRoleDescription()} anketa
                        </DialogDescription>
                    </div>
                    {application.status && (
                         <Badge
                            variant={getStatusVariant(application.status)}
                            className={`text-base ${getStatusClass(application.status)}`}
                          >
                            {getStatusText(application.status)}
                        </Badge>
                    )}
                </div>
            </DialogHeader>
            <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1 pr-4">
                {applicationData.map(([key, value]) => {
                     if (!fieldLabels[key] || value === null || value === undefined) return null;
                     
                     let displayValue: any = value;

                     if (key === 'agreementToRules') {
                         displayValue = value ? 'Taip' : 'Ne';
                     } else if (key === 'applicationDate') {
                         if (typeof value === 'object' && value !== null && 'seconds' in value) {
                            displayValue = format(new Date((value as any).seconds * 1000), 'yyyy-MM-dd HH:mm');
                         } else if (typeof value === 'string') {
                            try {
                                displayValue = format(new Date(value), 'yyyy-MM-dd HH:mm');
                            } catch {
                                displayValue = 'Neteisinga data';
                            }
                         }
                     } else if (key === 'status') {
                        return null; // Don't render status here as it's in the header
                     }


                    return (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b pb-4">
                            <h4 className="font-semibold text-muted-foreground md:col-span-1">{fieldLabels[key] || key}</h4>
                            <p className="text-foreground md:col-span-2 whitespace-pre-wrap">{displayValue.toString()}</p>
                        </div>
                    )
                })}
            </div>
        </>
    );
}


export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [appToDelete, setAppToDelete] = useState<{ collectionName: string, id: string } | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'roles_administrator', user.uid);
  }, [firestore, user]);

  const { data: adminRoleDoc, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);
  const hasAdminRole = adminRoleDoc !== null;

  const moderatorAppsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !hasAdminRole) return null;
    return query(collection(firestore, "applications_moderator"), orderBy("applicationDate", "desc"));
  }, [firestore, user, hasAdminRole]);

  const administratorAppsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !hasAdminRole) return null;
    return query(collection(firestore, "applications_administrator"), orderBy("applicationDate", "desc"));
  }, [firestore, user, hasAdminRole]);
  
  const programmerAppsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !hasAdminRole) return null;
    return query(collection(firestore, "applications_programmer"), orderBy("applicationDate", "desc"));
  }, [firestore, user, hasAdminRole]);

  const designerAppsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !hasAdminRole) return null;
    return query(collection(firestore, "applications_designer"), orderBy("applicationDate", "desc"));
  }, [firestore, user, hasAdminRole]);

  const { data: moderatorApps, isLoading: isLoadingMods } = useCollection(moderatorAppsQuery);
  const { data: adminApps, isLoading: isLoadingAdmins } = useCollection(administratorAppsQuery);
  const { data: programmerApps, isLoading: isLoadingProgs } = useCollection(programmerAppsQuery);
  const { data: designerApps, isLoading: isLoadingDes } = useCollection(designerAppsQuery);


  const applications: Application[] = useMemo(() => {
    if (!moderatorApps && !adminApps && !programmerApps && !designerApps) return [];
    const mods = moderatorApps?.map(app => ({ ...app, role: 'Moderatorius', collectionName: 'applications_moderator' })) || [];
    const admins = adminApps?.map(app => ({ ...app, role: 'Administratorius', collectionName: 'applications_administrator' })) || [];
    const progs = programmerApps?.map(app => ({ ...app, role: 'Programuotojas', collectionName: 'applications_programmer' })) || [];
    const des = designerApps?.map(app => ({ ...app, role: 'Dizaineris', collectionName: 'applications_designer' })) || [];
    
    const combined = [...mods, ...admins, ...progs, ...des];
    
    combined.sort((a, b) => {
        const dateAValue = a.applicationDate;
        const dateBValue = b.applicationDate;
        
        const dateA = dateAValue && typeof dateAValue === 'object' && 'seconds' in dateAValue ? dateAValue.seconds : (typeof dateAValue === 'string' ? new Date(dateAValue).getTime() / 1000 : 0);
        const dateB = dateBValue && typeof dateBValue === 'object' && 'seconds' in dateBValue ? dateBValue.seconds : (typeof dateBValue === 'string' ? new Date(dateBValue).getTime() / 1000 : 0);

        return dateB - dateA;
    });

    return combined as Application[];
  }, [moderatorApps, adminApps, programmerApps, designerApps]);

  const handleStatusChange = (collectionName: string, id: string, status: 'approved' | 'rejected') => {
    if (!firestore) return;
    const docRef = doc(firestore, collectionName, id);
    updateDoc(docRef, { status })
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: { status }
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: "destructive",
                title: "Klaida",
                description: "Nepavyko atnaujinti būsenos."
            });
        });
  };

  const handleDelete = () => {
    if (!firestore || !appToDelete) return;
    const { collectionName, id } = appToDelete;
    const docRef = doc(firestore, collectionName, id);

    deleteDoc(docRef)
        .then(() => {
            toast({
                title: 'Ištrinta',
                description: 'Anketa sėkmingai ištrinta.',
            });
        })
        .catch(error => {
             const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: "destructive",
                title: "Klaida",
                description: "Nepavyko ištrinti anketos."
            });
        })
        .finally(() => {
            setShowDeleteDialog(false);
            setAppToDelete(null);
        });
  };
  
  const promptDelete = (collectionName: string, id: string) => {
    setAppToDelete({ collectionName, id });
    setShowDeleteDialog(true);
  };


  const formatDate = (dateValue: { seconds: number, nanoseconds: number } | string | undefined | null) => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue === 'object' && dateValue !== null && 'seconds' in dateValue) {
        return format(new Date((dateValue as any).seconds * 1000), 'yyyy-MM-dd');
    }
    if (typeof dateValue === 'string') {
        try {
            return format(new Date(dateValue), 'yyyy-MM-dd');
        } catch {
            return 'Neteisinga data';
        }
    }
    return 'N/A';
  }

  const isLoading = isUserLoading || isAdminRoleLoading || isLoadingMods || isLoadingAdmins || isLoadingProgs || isLoadingDes;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // or a message indicating redirection
  }
  
  if (!hasAdminRole) {
    return (
         <div className="container flex items-center justify-center py-12">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <ShieldAlert className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-2xl font-headline mt-4">Trūksta Teisių</CardTitle>
                    <CardDescription>
                        Jūsų paskyra neturi administratoriaus teisių, reikalingų peržiūrėti šį puslapį.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6">
                        Norėdami tęsti, turite savo paskyrai suteikti administratoriaus teises. Tai saugus vienkartinis veiksmas.
                    </p>
                    <Button asChild>
                        <Link href="/assign-admin">Eiti į Teisių Suteikimo Puslapį</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <>
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 font-headline">Gautos Anketos</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kandidatas</TableHead>
              <TableHead>Vaidmuo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Būsena</TableHead>
              <TableHead className="text-right">Veiksmai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.nickname || app.discordUsername}</TableCell>
                <TableCell>{app.role}</TableCell>
                <TableCell>
                  {formatDate(app.applicationDate)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(app.status)}
                    className={getStatusClass(app.status)}
                  >
                    {getStatusText(app.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedApp(app)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Peržiūrėti</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={() => handleStatusChange(app.collectionName, app.id, 'approved')}>
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Patvirtinti</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:red-600" onClick={(): void => handleStatusChange(app.collectionName, app.id, 'rejected')}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Atmesti</span>
                    </Button>
                     <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-600" onClick={() => promptDelete(app.collectionName, app.id)}>
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Ištrinti</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
             {applications.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Naujų anketų nėra.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
    </div>
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Ar tikrai norite ištrinti šią anketą?</AlertDialogTitle>
            <AlertDialogDescription>
                Šis veiksmas negrįžtamas. Anketa bus visam laikui pašalinta iš duomenų bazės.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Atšaukti</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Ištrinti</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    <Dialog open={!!selectedApp} onOpenChange={(isOpen) => !isOpen && setSelectedApp(null)}>
        <DialogContent className="max-w-3xl">
            {selectedApp && (
                <ApplicationDetail 
                    collectionName={selectedApp.collectionName} 
                    docId={selectedApp.id} 
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
