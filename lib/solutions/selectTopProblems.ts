import { getAIGapFactor } from "@/lib/scoring/aiGap";
import { AUTOMATION_POTENTIAL, CATEGORY_TASKS, VANISH_TASK_KEYWORDS } from "@/lib/solutions/categories";
import type {
  AuditSubmission,
  CategoryId,
  PainPointKey,
  ProblemSignal,
  TaskKey,
} from "@/lib/types";

/** Pain points that map directly onto exactly one category. */
const DIRECT_PAIN_TO_CATEGORY: Partial<Record<PainPointKey, CategoryId>> = {
  research_ideas: "research_ideas",
  planning: "planning",
  writing: "writing",
  filming: "filming",
  editing: "editing",
  design: "design",
  scheduling_publishing: "scheduling_publishing",
  comments_dm: "client_communication",
};

const BUSINESS_CATEGORIES: CategoryId[] = [
  "business_sales",
  "business_client_communication",
  "business_delivery",
  "business_admin",
  "business_team",
  "business_marketing",
];

function hoursForCategory(categoryId: CategoryId, taskHours: Partial<Record<TaskKey, number>>): number {
  return CATEGORY_TASKS[categoryId].reduce((sum, task) => sum + (taskHours[task] ?? 0), 0);
}

/**
 * "Business/client tasks" is intentionally one broad Question-4 option (per spec) covering 6
 * underlying categories. It must resolve to the SINGLE category that actually dominates the
 * user's Question-3 business hours — never left to compete freely with other explicitly
 * selected pains, and never silently swapped for an unrelated business category.
 */
function resolveDominantBusinessCategory(taskHours: Partial<Record<TaskKey, number>>): CategoryId | null {
  let best: CategoryId | null = null;
  let bestHours = -1;
  for (const categoryId of BUSINESS_CATEGORIES) {
    const hours = hoursForCategory(categoryId, taskHours);
    if (hours > bestHours) {
      bestHours = hours;
      best = categoryId;
    }
  }
  return bestHours > 0 ? best : null;
}

function resolvePainToCategory(
  pain: PainPointKey,
  taskHours: Partial<Record<TaskKey, number>>
): CategoryId | null {
  if (pain in DIRECT_PAIN_TO_CATEGORY) return DIRECT_PAIN_TO_CATEGORY[pain]!;
  if (pain === "business_client_tasks") return resolveDominantBusinessCategory(taskHours);
  return null; // "other" — free text, no structured category without an LLM
}

function matchesVanishTask(categoryId: CategoryId, vanishTask: string): boolean {
  const text = vanishTask.trim().toLowerCase();
  if (!text) return false;
  return VANISH_TASK_KEYWORDS[categoryId].some((kw) => text.includes(kw.toLowerCase()));
}

/**
 * Q4 determines ELIGIBILITY only: a category can only become a Top Problem if the user flagged
 * it in Question 4 (never substituted for an unselected high-hours category). Once the eligible,
 * deduplicated set is known, the final display order is by monthly hours (Q3), descending — this
 * is the single canonical order every surface (Time Breakdown chart, Top Problems section,
 * solution cards, PDF) must consume as-is, with no independent re-sorting downstream.
 */
export function computeTopProblems(
  submission: AuditSubmission,
  taskHours: Partial<Record<TaskKey, number>>
): ProblemSignal[] {
  const resolvedCategories: CategoryId[] = [];
  for (const pain of submission.painPoints.selected) {
    const categoryId = resolvePainToCategory(pain, taskHours);
    if (categoryId && !resolvedCategories.includes(categoryId)) {
      resolvedCategories.push(categoryId);
    }
  }

  const signals: ProblemSignal[] = resolvedCategories.map((categoryId) => {
    const tasks = CATEGORY_TASKS[categoryId];
    let hours = 0;
    let topTaskKey: TaskKey = tasks[0];
    let topHours = -1;
    for (const task of tasks) {
      const h = taskHours[task] ?? 0;
      hours += h;
      if (h > topHours) {
        topHours = h;
        topTaskKey = task;
      }
    }

    const aiGapFactor = getAIGapFactor(categoryId, submission.aiUsage);
    const automationScore = tasks.reduce((sum, task) => {
      const h = taskHours[task] ?? 0;
      return sum + h * (AUTOMATION_POTENTIAL[task] ?? 3) * aiGapFactor;
    }, 0);

    return {
      categoryId,
      hours,
      topTaskKey,
      flaggedByUser: true, // every displayed problem traces directly to a Question-4 selection
      aiGapOpen: aiGapFactor === 1,
      vanishTaskMatched: matchesVanishTask(categoryId, submission.vanishTask),
      points: automationScore,
    };
  });

  // Eligibility came from Q4 selection order above; final display order is by hours, descending.
  return signals.sort((a, b) => b.hours - a.hours);
}
