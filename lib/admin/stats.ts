import {
  BUSINESS_TASK_LABELS,
  CONTENT_TASK_LABELS,
  PROBLEMS_LABELS_FALLBACK,
  type AIUsageLevel,
  type AuditResults,
  type BusinessAnswers,
  type ContentAnswers,
  type ProblemsAnswers,
  type UserType,
} from "@/lib/types";

export interface SubmissionRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  user_type: UserType;
  content_answers: ContentAnswers;
  business_answers: BusinessAnswers | null;
  problems: ProblemsAnswers;
  ai_usage: { level: AIUsageLevel; areas: string[] };
  results: AuditResults;
}

export interface AdminStats {
  totalUsers: number;
  creatorCount: number;
  creatorBusinessCount: number;
  avgContentHours: number;
  avgBusinessHours: number;
  topProblems: { label: string; count: number }[];
  topTimeConsumingTasks: { label: string; totalHours: number }[];
  topAutomationRequests: { label: string; count: number }[];
  aiUsageDistribution: { level: AIUsageLevel; count: number }[];
  openAnswers: {
    name: string;
    email: string;
    vanishTaskText: string;
    automationWishText: string;
  }[];
}

const ALL_TASK_LABELS: Record<string, string> = {
  ...CONTENT_TASK_LABELS,
  ...BUSINESS_TASK_LABELS,
};

export function computeAdminStats(rows: SubmissionRow[]): AdminStats {
  const totalUsers = rows.length;
  const creatorCount = rows.filter((r) => r.user_type === "creator").length;
  const creatorBusinessCount = totalUsers - creatorCount;

  const avgContentHours =
    totalUsers === 0
      ? 0
      : rows.reduce((sum, r) => sum + (r.results?.contentHoursTotal ?? 0), 0) / totalUsers;

  const businessRows = rows.filter((r) => r.user_type === "creator_business");
  const avgBusinessHours =
    businessRows.length === 0
      ? 0
      : businessRows.reduce((sum, r) => sum + (r.results?.businessHoursTotal ?? 0), 0) /
        businessRows.length;

  const problemCounts = new Map<string, number>();
  rows.forEach((r) => {
    (r.problems?.selected ?? []).forEach((p) => {
      problemCounts.set(p, (problemCounts.get(p) ?? 0) + 1);
    });
  });
  const topProblems = [...problemCounts.entries()]
    .map(([key, count]) => ({ label: PROBLEMS_LABELS_FALLBACK[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const taskHoursTotals = new Map<string, number>();
  rows.forEach((r) => {
    (r.results?.topTasks ?? []).forEach((t) => {
      taskHoursTotals.set(t.key, (taskHoursTotals.get(t.key) ?? 0) + t.hours);
    });
  });
  const topTimeConsumingTasks = [...taskHoursTotals.entries()]
    .map(([key, totalHours]) => ({ label: ALL_TASK_LABELS[key] ?? key, totalHours }))
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 7);

  const automationCounts = new Map<string, number>();
  rows.forEach((r) => {
    const top = r.results?.automationPriorities?.[0];
    if (top) automationCounts.set(top.key, (automationCounts.get(top.key) ?? 0) + 1);
  });
  const topAutomationRequests = [...automationCounts.entries()]
    .map(([key, count]) => ({ label: ALL_TASK_LABELS[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const aiLevels: AIUsageLevel[] = ["none", "sometimes", "regularly", "heavily"];
  const aiUsageDistribution = aiLevels.map((level) => ({
    level,
    count: rows.filter((r) => r.ai_usage?.level === level).length,
  }));

  const openAnswers = rows
    .map((r) => ({
      name: r.name,
      email: r.email,
      vanishTaskText: r.content_answers?.vanishTaskText ?? "",
      automationWishText: r.problems?.automationWishText ?? "",
    }))
    .filter((a) => a.vanishTaskText || a.automationWishText);

  return {
    totalUsers,
    creatorCount,
    creatorBusinessCount,
    avgContentHours,
    avgBusinessHours,
    topProblems,
    topTimeConsumingTasks,
    topAutomationRequests,
    aiUsageDistribution,
    openAnswers,
  };
}
