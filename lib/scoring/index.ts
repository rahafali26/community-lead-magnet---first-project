import {
  BUSINESS_TASK_LABELS,
  CONTENT_TASK_LABELS,
  type AuditResults,
  type AuditSubmission,
  type TaskKey,
  type TaskScore,
} from "@/lib/types";
import { AUTOMATION_POTENTIAL } from "./automationPotential";
import { getAIGapFactor } from "./aiGap";
import { getQuickWin } from "@/lib/quickwin/rules";

function sumHours(taskHours: Partial<Record<string, number>>): number {
  return Object.values(taskHours).reduce((sum: number, h) => sum + (h ?? 0), 0);
}

function buildTaskScores(
  taskHours: Partial<Record<string, number>>,
  labels: Record<string, string>,
  aiUsage: AuditSubmission["aiUsage"]
): TaskScore[] {
  return Object.entries(taskHours)
    .filter((entry): entry is [string, number] => (entry[1] ?? 0) > 0)
    .map(([key, hours]) => {
      const taskKey = key as TaskKey;
      const potential = AUTOMATION_POTENTIAL[taskKey] ?? 3;
      const gapFactor = getAIGapFactor(taskKey, aiUsage);
      const score = hours * potential * gapFactor;

      return {
        key: taskKey,
        label: labels[taskKey],
        hours,
        score,
      };
    });
}

export function computeAuditResults(submission: AuditSubmission): AuditResults {
  const { content, business, aiUsage } = submission;

  const contentHoursTotal = sumHours(content.taskHours);
  const businessHoursTotal = business ? sumHours(business.taskHours) : 0;
  const totalHours = contentHoursTotal + businessHoursTotal;

  const contentVsBusinessRatio =
    submission.userType === "creator_business" && totalHours > 0
      ? contentHoursTotal / totalHours
      : null;

  const contentScores = buildTaskScores(content.taskHours, CONTENT_TASK_LABELS, aiUsage);
  const businessScores = business
    ? buildTaskScores(business.taskHours, BUSINESS_TASK_LABELS, aiUsage)
    : [];

  const allScores = [...contentScores, ...businessScores];

  const topTasks = [...allScores]
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3);

  const automationPriorities = [...allScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const quickWin = getQuickWin(automationPriorities, submission.problems);

  return {
    contentHoursTotal,
    businessHoursTotal,
    totalHours,
    contentVsBusinessRatio,
    topTasks,
    automationPriorities,
    quickWin,
  };
}
