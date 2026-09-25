import { z } from "zod";
import { BUSINESS_TASK_KEYS, CONTENT_TASK_KEYS } from "@/lib/types";

const taskHoursValue = z.union([
  z.literal(0),
  z.literal(0.5),
  z.literal(2),
  z.literal(5.5),
  z.literal(11.5),
  z.literal(18),
]);

const platformSchema = z.enum(["instagram", "tiktok", "youtube", "linkedin", "x", "other"]);

export const contentVolumeAnswersSchema = z.object({
  volume: z.enum(["1-4", "5-8", "9-15", "16-30", "30+"]),
  platforms: z.array(platformSchema).min(1),
  platformOtherText: z.string().max(200).optional(),
});

export const timeBreakdownAnswersSchema = z.object({
  contentTaskHours: z.partialRecord(z.enum(CONTENT_TASK_KEYS), taskHoursValue),
  businessTaskHours: z.partialRecord(z.enum(BUSINESS_TASK_KEYS), taskHoursValue).optional(),
});

export const painPointsAnswersSchema = z.object({
  selected: z
    .array(
      z.enum([
        "research_ideas",
        "planning",
        "writing",
        "filming",
        "editing",
        "design",
        "scheduling_publishing",
        "comments_dm",
        "business_client_tasks",
        "other",
      ])
    )
    .min(1)
    .max(3, "You can select up to 3"),
  otherText: z.string().max(300).optional(),
});

export const aiUsageAnswersSchema = z.object({
  level: z.enum(["none", "sometimes", "regularly", "core"]),
  areas: z.array(
    z.enum([
      "research_ideas",
      "planning",
      "writing",
      "design",
      "editing",
      "analytics",
      "client_communication",
      "automation",
      "other",
    ])
  ),
  otherText: z.string().max(200).optional(),
});

export const timeValueAnswersSchema = z.object({
  choice: z.enum([
    "more_content",
    "grow_business",
    "increase_sales",
    "client_experience",
    "learning",
    "rest",
    "other",
  ]),
  otherText: z.string().max(200).optional(),
});

export const leadFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  accountUrl: z.string().trim().url(),
  primaryPlatform: platformSchema,
  primaryPlatformOtherText: z.string().max(200).optional(),
  marketingConsent: z.boolean(),
});

export const auditSubmissionSchema = z
  .object({
    userType: z.enum(["creator", "creator_business"]),
    contentVolume: contentVolumeAnswersSchema,
    timeBreakdown: timeBreakdownAnswersSchema,
    painPoints: painPointsAnswersSchema,
    vanishTask: z.string().max(500),
    aiUsage: aiUsageAnswersSchema,
    timeValue: timeValueAnswersSchema,
    lead: leadFormSchema,
    language: z.enum(["ar", "en"]),
  })
  .refine(
    (data) => data.userType !== "creator_business" || !!data.timeBreakdown.businessTaskHours,
    {
      message: "Business task hours are required for this user type",
      path: ["timeBreakdown", "businessTaskHours"],
    }
  );

export type AuditSubmissionInput = z.infer<typeof auditSubmissionSchema>;
