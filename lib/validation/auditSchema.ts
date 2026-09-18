import { z } from "zod";
import { CONTENT_TASK_KEYS, BUSINESS_TASK_KEYS } from "@/lib/types";

const taskHoursValue = z.union([
  z.literal(0),
  z.literal(0.5),
  z.literal(2),
  z.literal(5.5),
  z.literal(11.5),
  z.literal(18),
]);

const contentTaskHours = z.partialRecord(z.enum(CONTENT_TASK_KEYS), taskHoursValue);

const businessTaskHours = z.partialRecord(z.enum(BUSINESS_TASK_KEYS), taskHoursValue);

export const contentAnswersSchema = z.object({
  volume: z.enum(["1-4", "5-10", "11-20", "21-30", "30+"]),
  platformsCount: z.enum(["1", "2", "3", "4+"]),
  productionStyle: z.enum(["solo", "solo_help", "one_helper", "team"]),
  taskHours: contentTaskHours,
  vanishTaskText: z.string().max(500).default(""),
});

export const businessAnswersSchema = z.object({
  businessType: z.enum([
    "service",
    "product",
    "digital_product",
    "course",
    "subscription",
    "agency",
    "other",
  ]),
  team: z.enum(["solo", "one_helper", "team"]),
  clientsCount: z.enum(["0", "1-5", "6-15", "16-30", "30+"]),
  taskHours: businessTaskHours,
});

export const problemsAnswersSchema = z.object({
  selected: z
    .array(
      z.enum([
        "no_time_content",
        "no_time_business",
        "both_take_time",
        "many_repetitive_tasks",
        "context_switching",
        "dont_know_where_to_start",
        "other",
      ])
    )
    .min(1, "اختاري على الأقل خيار واحد"),
  otherText: z.string().max(300).optional(),
  automationWishText: z.string().max(500).default(""),
});

export const aiUsageAnswersSchema = z.object({
  level: z.enum(["none", "sometimes", "regularly", "heavily"]),
  areas: z.array(
    z.enum([
      "content_ideas",
      "writing",
      "research",
      "design",
      "video",
      "analytics",
      "admin",
      "customer_service",
      "other",
    ])
  ),
});

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صحيح"),
  accountUrl: z.string().trim().url("رابط غير صحيح").optional().or(z.literal("")),
  primaryPlatform: z
    .enum(["instagram", "tiktok", "youtube", "linkedin", "x", "other"])
    .optional(),
  dataConsent: z.literal(true, {
    message: "لازم توافقي على استخدام بياناتك عشان نعرض لك النتيجة",
  }),
  marketingConsent: z.boolean(),
});

export const auditSubmissionSchema = z
  .object({
    userType: z.enum(["creator", "creator_business"]),
    content: contentAnswersSchema,
    business: businessAnswersSchema.optional(),
    problems: problemsAnswersSchema,
    aiUsage: aiUsageAnswersSchema,
    timeValue: z.enum([
      "more_content",
      "grow_business",
      "rest",
      "family",
      "learning",
      "other",
    ]),
    lead: leadFormSchema,
  })
  .refine(
    (data) => data.userType !== "creator_business" || !!data.business,
    { message: "إجابات البزنس مطلوبة لهذا النوع من المستخدمين", path: ["business"] }
  );

export type AuditSubmissionInput = z.infer<typeof auditSubmissionSchema>;
