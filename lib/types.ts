// أنواع TypeScript لكل إجابات الاختبار والنتائج

export type UserType = "creator" | "creator_business";

export type TaskHoursValue = 0 | 0.5 | 2 | 5.5 | 11.5 | 18;

export const TASK_HOURS_OPTIONS: { label: string; value: TaskHoursValue }[] = [
  { label: "لا أقوم بهذه المهمة", value: 0 },
  { label: "أقل من ساعة", value: 0.5 },
  { label: "1–3 ساعات", value: 2 },
  { label: "4–7 ساعات", value: 5.5 },
  { label: "8–15 ساعة", value: 11.5 },
  { label: "أكثر من 15 ساعة", value: 18 },
];

// ---------- مهام المحتوى ----------
export const CONTENT_TASK_KEYS = [
  "content_ideas",
  "research",
  "content_planning",
  "hooks_writing",
  "scripts_captions",
  "filming",
  "editing",
  "design",
  "scheduling_publishing",
  "comments_dm",
  "performance_analysis",
] as const;

export type ContentTaskKey = (typeof CONTENT_TASK_KEYS)[number];

export const CONTENT_TASK_LABELS: Record<ContentTaskKey, string> = {
  content_ideas: "البحث عن أفكار محتوى",
  research: "البحث عن معلومات ومراجع",
  content_planning: "تخطيط المحتوى",
  hooks_writing: "كتابة الـ Hooks",
  scripts_captions: "كتابة السكربتات والكابشن",
  filming: "التصوير",
  editing: "المونتاج",
  design: "التصميم",
  scheduling_publishing: "جدولة ونشر المحتوى",
  comments_dm: "الرد على التعليقات والرسائل",
  performance_analysis: "تحليل أداء المحتوى",
};

// ---------- مهام البزنس ----------
export const BUSINESS_TASK_KEYS = [
  "lead_research",
  "lead_outreach",
  "lead_followup",
  "client_replies",
  "meetings",
  "customer_service",
  "service_delivery",
  "order_prep",
  "invoicing",
  "file_organizing",
  "admin_tasks",
  "task_distribution",
  "team_followup",
  "internal_meetings",
  "campaigns",
  "offers",
  "business_marketing",
] as const;

export type BusinessTaskKey = (typeof BUSINESS_TASK_KEYS)[number];

export const BUSINESS_TASK_LABELS: Record<BusinessTaskKey, string> = {
  lead_research: "البحث عن العملاء المحتملين",
  lead_outreach: "التواصل مع العملاء المحتملين",
  lead_followup: "المتابعة مع العملاء المحتملين",
  client_replies: "الرد على العملاء",
  meetings: "الاجتماعات",
  customer_service: "خدمة العملاء",
  service_delivery: "تنفيذ الخدمة",
  order_prep: "تجهيز الطلبات",
  invoicing: "الفواتير والمدفوعات",
  file_organizing: "ترتيب الملفات",
  admin_tasks: "المهام الإدارية",
  task_distribution: "توزيع المهام",
  team_followup: "متابعة الفريق",
  internal_meetings: "الاجتماعات الداخلية",
  campaigns: "الحملات",
  offers: "العروض",
  business_marketing: "التسويق للبزنس",
};

export const BUSINESS_TASK_GROUPS: { title: string; keys: BusinessTaskKey[] }[] = [
  { title: "المبيعات", keys: ["lead_research", "lead_outreach", "lead_followup"] },
  { title: "العملاء", keys: ["client_replies", "meetings", "customer_service"] },
  { title: "تنفيذ الخدمة / الطلبات", keys: ["service_delivery", "order_prep"] },
  { title: "الإدارة", keys: ["invoicing", "file_organizing", "admin_tasks"] },
  { title: "الفريق", keys: ["task_distribution", "team_followup", "internal_meetings"] },
  { title: "التسويق", keys: ["campaigns", "offers", "business_marketing"] },
];

export type TaskKey = ContentTaskKey | BusinessTaskKey;

// ---------- إجابات المحتوى ----------
export interface ContentAnswers {
  volume: "1-4" | "5-10" | "11-20" | "21-30" | "30+";
  platformsCount: "1" | "2" | "3" | "4+";
  productionStyle: "solo" | "solo_help" | "one_helper" | "team";
  taskHours: Partial<Record<ContentTaskKey, TaskHoursValue>>;
  vanishTaskText: string;
}

// ---------- إجابات البزنس ----------
export interface BusinessAnswers {
  businessType:
    | "service"
    | "product"
    | "digital_product"
    | "course"
    | "subscription"
    | "agency"
    | "other";
  team: "solo" | "one_helper" | "team";
  clientsCount: "0" | "1-5" | "6-15" | "16-30" | "30+";
  taskHours: Partial<Record<BusinessTaskKey, TaskHoursValue>>;
}

// ---------- المشاكل ----------
export type ProblemKey =
  | "no_time_content"
  | "no_time_business"
  | "both_take_time"
  | "many_repetitive_tasks"
  | "context_switching"
  | "dont_know_where_to_start"
  | "other";

export interface ProblemsAnswers {
  selected: ProblemKey[];
  otherText?: string;
  automationWishText: string;
}

export const PROBLEMS_LABELS_FALLBACK: Record<string, string> = {
  no_time_content: "ما ألحق على المحتوى",
  no_time_business: "ما ألحق على البزنس",
  both_take_time: "الاثنين يأخذون وقتي",
  many_repetitive_tasks: "عندي مهام كثيرة ومتكررة",
  context_switching: "أضيع وقتي في الانتقال بين المهام",
  dont_know_where_to_start: "ما أعرف وش أبدأ فيه",
  other: "شيء آخر",
};

// ---------- استخدام AI ----------
export type AIUsageLevel = "none" | "sometimes" | "regularly" | "heavily";

export type AIUsageArea =
  | "content_ideas"
  | "writing"
  | "research"
  | "design"
  | "video"
  | "analytics"
  | "admin"
  | "customer_service"
  | "other";

export interface AIUsageAnswers {
  level: AIUsageLevel;
  areas: AIUsageArea[];
}

export type TimeValueChoice =
  | "more_content"
  | "grow_business"
  | "rest"
  | "family"
  | "learning"
  | "other";

// ---------- بيانات الفورم النهائي ----------
export interface LeadFormData {
  name: string;
  email: string;
  accountUrl?: string;
  primaryPlatform?:
    | "instagram"
    | "tiktok"
    | "youtube"
    | "linkedin"
    | "x"
    | "other";
  dataConsent: boolean;
  marketingConsent: boolean;
}

// ---------- كل بيانات الاختبار (قبل الحفظ) ----------
export interface AuditSubmission {
  userType: UserType;
  content: ContentAnswers;
  business?: BusinessAnswers;
  problems: ProblemsAnswers;
  aiUsage: AIUsageAnswers;
  timeValue: TimeValueChoice;
  lead: LeadFormData;
}

// ---------- النتائج المحسوبة ----------
export interface TaskScore {
  key: TaskKey;
  label: string;
  hours: number;
  score: number;
}

export interface QuickWin {
  id: string;
  title: string;
  description: string;
  promptTemplate: string;
}

export interface AuditResults {
  contentHoursTotal: number;
  businessHoursTotal: number;
  totalHours: number;
  contentVsBusinessRatio: number | null; // نسبة المحتوى من الإجمالي (0-1)، null لصانع المحتوى فقط
  topTasks: TaskScore[]; // أعلى 3 مهام من حيث الوقت
  automationPriorities: TaskScore[]; // أعلى المهام من حيث Automation Score
  quickWin: QuickWin;
}
