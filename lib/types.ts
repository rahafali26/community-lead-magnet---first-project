// Types for the 7-question audit and its results (V2)

export type Locale = "ar" | "en";

export type UserType = "creator" | "creator_business";

export type TaskHoursValue = 0 | 0.5 | 2 | 5.5 | 11.5 | 18;

export const TASK_HOURS_VALUES: TaskHoursValue[] = [0, 0.5, 2, 5.5, 11.5, 18];

// ---------- content tasks (Question 3) ----------
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

// ---------- business tasks (Question 3, conditional) ----------
// Kept as 6 distinct, independently-scored tasks — never collapsed into one umbrella category.
export const BUSINESS_TASK_KEYS = [
  "sales",
  "client_communication",
  "delivery_fulfillment",
  "admin_work",
  "team_management",
  "marketing",
] as const;

export type BusinessTaskKey = (typeof BUSINESS_TASK_KEYS)[number];

export type TaskKey = ContentTaskKey | BusinessTaskKey;

// ---------- 15 solution/scoring categories (1:1 with tasks, business tasks NOT merged) ----------
export const CATEGORY_IDS = [
  "research_ideas",
  "planning",
  "writing",
  "filming",
  "editing",
  "design",
  "scheduling_publishing",
  "client_communication",
  "analytics",
  "business_sales",
  "business_client_communication",
  "business_delivery",
  "business_admin",
  "business_team",
  "business_marketing",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

// ---------- Question 1 ----------
// (UserType above)

// ---------- Question 2: content volume + platform ----------
export type ContentVolume = "1-4" | "5-8" | "9-15" | "16-30" | "30+";

export type Platform = "instagram" | "tiktok" | "youtube" | "linkedin" | "x" | "other";

export interface ContentVolumeAnswers {
  volume: ContentVolume;
  platforms: Platform[];
  platformOtherText?: string;
}

// ---------- Question 3: time breakdown ----------
export interface TimeBreakdownAnswers {
  contentTaskHours: Partial<Record<ContentTaskKey, TaskHoursValue>>;
  businessTaskHours?: Partial<Record<BusinessTaskKey, TaskHoursValue>>; // only for creator_business
}

// ---------- Question 4: pain points (max 3) ----------
export type PainPointKey =
  | "research_ideas"
  | "planning"
  | "writing"
  | "filming"
  | "editing"
  | "design"
  | "scheduling_publishing"
  | "comments_dm"
  | "business_client_tasks"
  | "other";

export interface PainPointsAnswers {
  selected: PainPointKey[]; // max 3
  otherText?: string;
}

// ---------- Question 5: open text ----------
export type VanishTaskAnswer = string;

// ---------- Question 6: AI usage (maturity + areas, combined) ----------
export type AIUsageLevel = "none" | "sometimes" | "regularly" | "core";

export type AIUsageArea =
  | "research_ideas"
  | "planning"
  | "writing"
  | "design"
  | "editing"
  | "analytics"
  | "client_communication"
  | "automation"
  | "other";

export interface AIUsageAnswers {
  level: AIUsageLevel;
  areas: AIUsageArea[];
  otherText?: string;
}

// ---------- Question 7: value of recovered time ----------
export type TimeValueChoice =
  | "more_content"
  | "grow_business"
  | "increase_sales"
  | "client_experience"
  | "learning"
  | "rest"
  | "other";

export interface TimeValueAnswers {
  choice: TimeValueChoice;
  otherText?: string;
}

// ---------- Lead Capture (after Question 7, not a numbered question) ----------
export interface LeadFormData {
  name: string;
  email: string;
  accountUrl: string; // required in V2
  primaryPlatform: Platform; // required in V2
  primaryPlatformOtherText?: string;
  marketingConsent: boolean;
}

// ---------- full submission ----------
export interface AuditSubmission {
  userType: UserType;
  contentVolume: ContentVolumeAnswers;
  timeBreakdown: TimeBreakdownAnswers;
  painPoints: PainPointsAnswers;
  vanishTask: VanishTaskAnswer;
  aiUsage: AIUsageAnswers;
  timeValue: TimeValueAnswers;
  lead: LeadFormData;
  language: Locale;
}

// ---------- computed results ----------
export interface TaskHourEntry {
  key: TaskKey;
  hours: number;
}

/**
 * Raw, language-independent signal for one ranked category — stored as-is in the DB.
 * Display strings (diagnosis, quick win, prompt...) are resolved from this at render time
 * (result page / PDF), in whatever locale is currently active, via
 * lib/solutions/resolveProblem.ts. Never store a pre-translated string here — that would make
 * the language toggle unable to re-translate already-computed results.
 */
export interface ProblemSignal {
  categoryId: CategoryId;
  hours: number;
  topTaskKey: TaskKey;
  flaggedByUser: boolean;
  aiGapOpen: boolean;
  vanishTaskMatched: boolean;
  points: number; // internal ranking score, used for ordering only, never shown as a raw metric
}

/** The fully resolved, display-ready version of a ProblemSignal in one language. */
export interface ResolvedProblem {
  categoryId: CategoryId;
  problemLabel: string;
  whyItMatters: string;
  diagnosis: string;
  quickWinTitle: string;
  quickWinDescription: string;
  promptTemplate: string;
}

export interface AuditResults {
  contentHoursTotal: number;
  businessHoursTotal: number;
  totalHours: number;
  contentVsBusinessRatio: number | null;
  topTaskHours: TaskHourEntry[]; // top tasks by hours, for the Time Breakdown chart
  topProblems: ProblemSignal[]; // 0–3 items, never padded, language-independent
}
