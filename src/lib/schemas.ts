
import { z } from "zod";

export const moderatorApplicationSchema = z.object({
  discordUsername: z.string().min(2, "Nurodykite teisingą Discord žymą."),
  age: z.coerce.number().min(13, "Turite būti bent 13 metų amžiaus.").max(99, "Amžius per didelis."),
  timeSpentOnPlatforms: z.string().min(1, "Šis laukas yra privalomas."),
  discordModerationSkills: z.string().min(1, "Šis laukas yra privalomas."),
  reactionToSpam: z.string().min(1, "Šis laukas yra privalomas."),
  fakeAccountRecognition: z.string().min(1, "Šis laukas yra privalomas."),
  inappropriateBehaviorResponse: z.string().min(1, "Šis laukas yra privalomas."),
  chatRaidResponse: z.string().min(1, "Šis laukas yra privalomas."),
  attributeComplianceCheck: z.string().min(1, "Šis laukas yra privalomas."),
  patienceLevel: z.string().min(1, "Šis laukas yra privalomas."),
  explainingRulesToNewcomer: z.string().min(1, "Šis laukas yra privalomas."),
  teamworkPreference: z.string().min(1, "Šis laukas yra privalomas."),
  offCommunityBehavior: z.string().min(1, "Šis laukas yra privalomas."),
  botConfigurationExperience: z.string().min(1, "Šis laukas yra privalomas."),
  unprovenComplaintsResponse: z.string().min(1, "Šis laukas yra privalomas."),
  warningOrPunishment: z.string().min(1, "Šis laukas yra privalomas."),
});

const baseAdminSchema = {
  nickname: z.string().min(2, "Nurodykite slapyvardį."),
  age: z.coerce.number().min(13, "Turite būti bent 13 metų amžiaus.").max(99, "Amžius per didelis."),
  reasonForChoosingDETM: z.string().min(1, "Šis laukas yra privalomas."),
  characterTraits: z.string().min(1, "Šis laukas yra privalomas."),
  leadershipExperience: z.string().min(1, "Šis laukas yra privalomas."),
  handlingAdminAbuse: z.string().min(1, "Šis laukas yra privalomas."),
  visionForDETM: z.string().min(1, "Šis laukas yra privalomas."),
  solvingInactivity: z.string().min(1, "Šis laukas yra privalomas."),
  handlingPublicInsults: z.string().min(1, "Šis laukas yra privalomas."),
  timeCommitment: z.string().min(1, "Šis laukas yra privalomas."),
  removingFriend: z.string().min(1, "Šis laukas yra privalomas."),
  attractingNewMembers: z.string().min(1, "Šis laukas yra privalomas."),
  resolvingInternalConflicts: z.string().min(1, "Šis laukas yra privalomas."),
  meetingAndDelegationSkills: z.string().min(1, "Šis laukas yra privalomas."),
  opinionOnReputation: z.string().min(1, "Šis laukas yra privalomas."),
  whyChooseYou: z.string().min(1, "Šis laukas yra privalomas."),
};

export const administratorApplicationSchema = z.object({
  ...baseAdminSchema,
});

export const programmerApplicationSchema = z.object({
    discordUsername: z.string().min(2, "Nurodykite teisingą Discord žymą."),
    programmingExperience: z.string().min(1, "Šis laukas yra privalomas."),
    age: z.coerce.number().min(13, "Turite būti bent 13 metų amžiaus.").max(99, "Amžius per didelis."),
    programmingLanguages: z.string().min(1, "Šis laukas yra privalomas."),
    discordBotExperience: z.string().min(1, "Šis laukas yra privalomas."),
    databaseKnowledge: z.string().min(1, "Šis laukas yra privalomas."),
    tiktokApiIntegration: z.string().min(1, "Šis laukas yra privalomas."),
    attributeCheckSystem: z.string().min(1, "Šis laukas yra privalomas."),
    registrationFormCreation: z.string().min(1, "Šis laukas yra privalomas."),
    bugFixingTime: z.string().min(1, "Šis laukas yra privalomas."),
    securityMeasures: z.string().min(1, "Šis laukas yra privalomas."),
    webhookExperience: z.string().min(1, "Šis laukas yra privalomas."),
    websiteExperience: z.string().min(1, "Šis laukas yra privalomas."),
    serverOptimization: z.string().min(1, "Šis laukas yra privalomas."),
    confidentialityAgreement: z.string().min(1, "Šis laukas yra privalomas."),
    codeStorageTools: z.string().min(1, "Šis laukas yra privalomas."),
    problemSolvingTime: z.string().min(1, "Šis laukas yra privalomas."),
});

export const designerApplicationSchema = z.object({
  discordUsername: z.string().min(2, "Nurodykite teisingą Discord žymą."),
  age: z.coerce.number().min(13, "Turite būti bent 13 metų amžiaus.").max(99, "Amžius per didelis."),
  designPrograms: z.string().min(1, "Šis laukas yra privalomas."),
  experienceWithFrames: z.string().min(1, "Šis laukas yra privalomas."),
  portfolioLink: z.string().min(1, "Šis laukas yra privalomas."),
  frameCreationTime: z.string().min(1, "Šis laukas yra privalomas."),
  styleDescription: z.string().min(1, "Šis laukas yra privalomas."),
  handlingFeedback: z.string().min(1, "Šis laukas yra privalomas."),
  videoEditingSkills: z.string().min(1, "Šis laukas yra privalomas."),
  logoDesignSkills: z.string().min(1, "Šis laukas yra privalomas."),
  timeCommitmentWeekly: z.string().min(1, "Šis laukas yra privalomas."),
  handlingPlagiarism: z.string().min(1, "Šis laukas yra privalomas."),
  animationSkills: z.string().min(1, "Šis laukas yra privalomas."),
  opinionOnCurrentArt: z.string().min(1, "Šis laukas yra privalomas."),
  reasonForJoining: z.string().min(1, "Šis laukas yra privalomas."),
});


export type ModeratorApplicationValues = z.infer<typeof moderatorApplicationSchema>;
export type AdministratorApplicationValues = z.infer<typeof administratorApplicationSchema>;
export type ProgrammerApplicationValues = z.infer<typeof programmerApplicationSchema>;
export type DesignerApplicationValues = z.infer<typeof designerApplicationSchema>;
