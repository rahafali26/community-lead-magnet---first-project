import { resolveCategoryLabel } from "@/lib/solutions/resolveProblem";
import type {
  AIUsageAnswers,
  AuditResults,
  CategoryId,
  ContentVolumeAnswers,
  Locale,
  PainPointsAnswers,
  TimeBreakdownAnswers,
  TimeValueAnswers,
  UserType,
} from "@/lib/types";

export interface SubmissionRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  user_type: UserType;
  language: Locale;
  content_volume: ContentVolumeAnswers;
  time_breakdown: TimeBreakdownAnswers;
  pain_points: PainPointsAnswers;
  vanish_task: string;
  ai_usage: AIUsageAnswers;
  time_value_answers: TimeValueAnswers;
  results: AuditResults;
}

interface Bucket {
  label: string;
  count: number;
  percentage: number;
}

export interface AdminStats {
  totalUsers: number;
  creatorCount: number;
  creatorBusinessCount: number;
  avgContentHours: number;
  avgBusinessHours: number;
  avgTotalHours: number;
  languageDistribution: Bucket[];
  topPainPoints: Bucket[];
  topAutomationOpportunities: Bucket[];
  aiUsageDistribution: Bucket[];
  openAnswers: {
    name: string;
    email: string;
    vanishTask: string;
    painOtherText: string;
    aiUsageOtherText: string;
    timeValueOtherText: string;
    platformOtherText: string;
  }[];
}

function toBuckets(counts: Map<string, number>, total: number, labelFor: (key: string) => string): Bucket[] {
  return [...counts.entries()]
    .map(([key, count]) => ({
      label: labelFor(key),
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

// Locale used only for admin-facing labels — the dashboard itself isn't locale-toggled per user,
// English is used as the stable internal reporting language.
const ADMIN_LOCALE: Locale = "en";

const PAIN_LABELS: Record<string, string> = {
  research_ideas: "Idea/research overload",
  planning: "Planning/organization",
  writing: "Writing",
  filming: "Filming",
  editing: "Editing",
  design: "Design",
  scheduling_publishing: "Scheduling/publishing",
  comments_dm: "Comments/DMs",
  business_client_tasks: "Business/client tasks",
  other: "Other",
};

export function computeAdminStats(rows: SubmissionRow[]): AdminStats {
  const totalUsers = rows.length;
  const creatorCount = rows.filter((r) => r.user_type === "creator").length;
  const creatorBusinessCount = totalUsers - creatorCount;

  const avgContentHours =
    totalUsers === 0 ? 0 : rows.reduce((sum, r) => sum + (r.results?.contentHoursTotal ?? 0), 0) / totalUsers;

  const businessRows = rows.filter((r) => r.user_type === "creator_business");
  const avgBusinessHours =
    businessRows.length === 0
      ? 0
      : businessRows.reduce((sum, r) => sum + (r.results?.businessHoursTotal ?? 0), 0) / businessRows.length;

  const avgTotalHours =
    totalUsers === 0 ? 0 : rows.reduce((sum, r) => sum + (r.results?.totalHours ?? 0), 0) / totalUsers;

  const languageCounts = new Map<string, number>();
  rows.forEach((r) => languageCounts.set(r.language, (languageCounts.get(r.language) ?? 0) + 1));
  const languageDistribution = toBuckets(languageCounts, totalUsers, (k) => k.toUpperCase());

  const painCounts = new Map<string, number>();
  rows.forEach((r) => {
    (r.pain_points?.selected ?? []).forEach((p) => painCounts.set(p, (painCounts.get(p) ?? 0) + 1));
  });
  const topPainPoints = toBuckets(painCounts, totalUsers, (k) => PAIN_LABELS[k] ?? k).slice(0, 10);

  const automationCounts = new Map<string, number>();
  rows.forEach((r) => {
    (r.results?.topProblems ?? []).forEach((p) =>
      automationCounts.set(p.categoryId, (automationCounts.get(p.categoryId) ?? 0) + 1)
    );
  });
  const topAutomationOpportunities = toBuckets(automationCounts, totalUsers, (k) =>
    resolveCategoryLabel(k as CategoryId, ADMIN_LOCALE)
  ).slice(0, 10);

  const aiCounts = new Map<string, number>();
  rows.forEach((r) => {
    if (r.ai_usage?.level) aiCounts.set(r.ai_usage.level, (aiCounts.get(r.ai_usage.level) ?? 0) + 1);
  });
  const aiUsageDistribution = toBuckets(aiCounts, totalUsers, (k) => k);

  const openAnswers = rows
    .map((r) => ({
      name: r.name,
      email: r.email,
      vanishTask: r.vanish_task ?? "",
      painOtherText: r.pain_points?.otherText ?? "",
      aiUsageOtherText: r.ai_usage?.otherText ?? "",
      timeValueOtherText: r.time_value_answers?.otherText ?? "",
      platformOtherText: r.content_volume?.platformOtherText ?? "",
    }))
    .filter(
      (a) => a.vanishTask || a.painOtherText || a.aiUsageOtherText || a.timeValueOtherText || a.platformOtherText
    );

  return {
    totalUsers,
    creatorCount,
    creatorBusinessCount,
    avgContentHours,
    avgBusinessHours,
    avgTotalHours,
    languageDistribution,
    topPainPoints,
    topAutomationOpportunities,
    aiUsageDistribution,
    openAnswers,
  };
}
