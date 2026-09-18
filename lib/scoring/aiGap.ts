import type { AIUsageAnswers, AIUsageArea, TaskKey } from "@/lib/types";

/**
 * ربط كل مجال AI عام (من سؤال "في وش تستخدم AI؟") بمجموعة المهام المشابهة له.
 * هذا يعوّض عدم وجود سؤال AI منفصل لكل مهمة (V1 بدون LLM لا يستطيع الربط الدلالي التلقائي).
 */
const AREA_TO_TASKS: Record<AIUsageArea, TaskKey[]> = {
  content_ideas: ["content_ideas", "content_planning"],
  writing: ["hooks_writing", "scripts_captions"],
  research: ["research", "lead_research"],
  design: ["design"],
  video: ["filming", "editing"],
  analytics: ["performance_analysis"],
  admin: ["admin_tasks", "invoicing", "file_organizing"],
  customer_service: ["customer_service", "client_replies", "comments_dm"],
  other: [],
};

/**
 * خصم حسب مستوى الاستخدام العام: كلما زاد اعتماده على AI في هذا المجال، قلّت "الفجوة" المتبقية.
 */
const LEVEL_DISCOUNT: Record<AIUsageAnswers["level"], number> = {
  none: 1,
  sometimes: 0.85,
  regularly: 0.7,
  heavily: 0.5,
};

/**
 * AIGapFactor: 1 = فرصة كاملة غير مستغلة، أقل من 1 = المستخدم مستفيد من AI في هذه المهمة جزئيًا فعلاً.
 */
export function getAIGapFactor(task: TaskKey, aiUsage: AIUsageAnswers): number {
  const isInUsedArea = aiUsage.areas.some((area) =>
    AREA_TO_TASKS[area]?.includes(task)
  );

  if (!isInUsedArea) return 1;

  return LEVEL_DISCOUNT[aiUsage.level];
}
