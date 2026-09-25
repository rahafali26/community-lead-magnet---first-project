import { SOLUTION_LIBRARY, type SolutionContext } from "@/lib/solutions/library";
import { taskLabel } from "@/lib/solutions/taskLabel";
import type { CategoryId, Locale, ProblemSignal, ResolvedProblem } from "@/lib/types";

/** Resolves a language-independent ProblemSignal into display-ready text, in the given locale. */
export function resolveProblemSolution(signal: ProblemSignal, locale: Locale): ResolvedProblem {
  const def = SOLUTION_LIBRARY[signal.categoryId];
  const ctx: SolutionContext = {
    locale,
    hours: signal.hours,
    topTaskLabel: taskLabel(signal.topTaskKey, locale),
    flaggedByUser: signal.flaggedByUser,
    aiGapOpen: signal.aiGapOpen,
    vanishTaskMatched: signal.vanishTaskMatched,
  };

  return {
    categoryId: signal.categoryId,
    problemLabel: def.problemLabel[locale],
    whyItMatters: def.whyItMatters[locale],
    diagnosis: def.diagnosis(ctx),
    quickWinTitle: def.quickWinTitle[locale],
    quickWinDescription: def.quickWinDescription[locale],
    promptTemplate: def.promptTemplate[locale],
  };
}

export function resolveCategoryLabel(categoryId: CategoryId, locale: Locale): string {
  return SOLUTION_LIBRARY[categoryId].problemLabel[locale];
}

/**
 * The single source of truth for turning AuditResults.topProblems into display-ready problems,
 * in order. Both the Results page and the PDF must call this (not their own `.map`) so the
 * priority order (#1/#2/#3) and each problem's diagnosis/Quick Win/prompt can never drift
 * apart between the two surfaces — this never re-sorts, it only resolves in the given order.
 */
export function resolveAllProblems(signals: ProblemSignal[], locale: Locale): ResolvedProblem[] {
  return signals.map((signal) => resolveProblemSolution(signal, locale));
}
