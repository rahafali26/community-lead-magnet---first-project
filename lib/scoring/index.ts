import { computeTopProblems } from "@/lib/solutions/selectTopProblems";
import type { AuditResults, AuditSubmission, TaskHourEntry, TaskKey } from "@/lib/types";

function sumHours(hours: Partial<Record<string, number>> | undefined): number {
  if (!hours) return 0;
  return Object.values(hours).reduce((sum: number, h) => sum + (h ?? 0), 0);
}

export function computeAuditResults(submission: AuditSubmission): AuditResults {
  const { timeBreakdown, userType } = submission;

  const contentHoursTotal = sumHours(timeBreakdown.contentTaskHours);
  const businessHoursTotal =
    userType === "creator_business" ? sumHours(timeBreakdown.businessTaskHours) : 0;
  const totalHours = contentHoursTotal + businessHoursTotal;

  const contentVsBusinessRatio =
    userType === "creator_business" && totalHours > 0 ? contentHoursTotal / totalHours : null;

  const combinedTaskHours: Partial<Record<TaskKey, number>> = {
    ...timeBreakdown.contentTaskHours,
    ...(userType === "creator_business" ? timeBreakdown.businessTaskHours : {}),
  };

  const topTaskHours: TaskHourEntry[] = Object.entries(combinedTaskHours)
    .filter((entry): entry is [string, number] => (entry[1] ?? 0) > 0)
    .map(([key, hours]) => ({ key: key as TaskKey, hours }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3);

  const topProblems = computeTopProblems(submission, combinedTaskHours);

  return {
    contentHoursTotal,
    businessHoursTotal,
    totalHours,
    contentVsBusinessRatio,
    topTaskHours,
    topProblems,
  };
}
