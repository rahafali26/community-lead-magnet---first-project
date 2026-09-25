import { AI_AREA_TO_CATEGORIES, AI_LEVEL_DISCOUNT } from "@/lib/solutions/categories";
import type { AIUsageAnswers, CategoryId } from "@/lib/types";

/**
 * 1 = genuinely no current AI usage in this category (full opportunity).
 * <1 = the user already reports using AI somewhere that covers this category, discounted by
 * how deeply they rely on it overall.
 */
export function getAIGapFactor(categoryId: CategoryId, aiUsage: AIUsageAnswers): number {
  const isCovered = aiUsage.areas.some((area) =>
    AI_AREA_TO_CATEGORIES[area]?.includes(categoryId)
  );

  if (!isCovered) return 1;
  return AI_LEVEL_DISCOUNT[aiUsage.level];
}
