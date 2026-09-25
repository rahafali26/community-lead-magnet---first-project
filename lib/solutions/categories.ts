import type {
  AIUsageArea,
  AIUsageLevel,
  CategoryId,
  PainPointKey,
  TaskKey,
} from "@/lib/types";

/** Which task(s) roll up into each of the 15 categories. Business tasks are never merged. */
export const CATEGORY_TASKS: Record<CategoryId, TaskKey[]> = {
  research_ideas: ["content_ideas", "research"],
  planning: ["content_planning"],
  writing: ["hooks_writing", "scripts_captions"],
  filming: ["filming"],
  editing: ["editing"],
  design: ["design"],
  scheduling_publishing: ["scheduling_publishing"],
  client_communication: ["comments_dm"],
  analytics: ["performance_analysis"],
  business_sales: ["sales"],
  business_client_communication: ["client_communication"],
  business_delivery: ["delivery_fulfillment"],
  business_admin: ["admin_work"],
  business_team: ["team_management"],
  business_marketing: ["marketing"],
};

/** Automation potential per task (1 = manual by nature, 5 = highly automatable). */
export const AUTOMATION_POTENTIAL: Record<TaskKey, number> = {
  content_ideas: 4,
  research: 4,
  content_planning: 3,
  hooks_writing: 4,
  scripts_captions: 4,
  filming: 1,
  editing: 3,
  design: 3,
  scheduling_publishing: 5,
  comments_dm: 2,
  performance_analysis: 4,

  sales: 3,
  client_communication: 2,
  delivery_fulfillment: 2,
  admin_work: 5,
  team_management: 2,
  marketing: 4,
};

/** Question 4 pain-point selection → categories it boosts (+2 points each, per the plan). */
export const PAIN_TO_CATEGORIES: Record<PainPointKey, CategoryId[]> = {
  research_ideas: ["research_ideas"],
  planning: ["planning"],
  writing: ["writing"],
  filming: ["filming"],
  editing: ["editing"],
  design: ["design"],
  scheduling_publishing: ["scheduling_publishing"],
  comments_dm: ["client_communication"],
  business_client_tasks: [
    "business_sales",
    "business_client_communication",
    "business_delivery",
    "business_admin",
    "business_team",
    "business_marketing",
  ],
  other: [],
};

/** Question 6 AI-usage areas → categories where that usage reduces the AI gap. */
export const AI_AREA_TO_CATEGORIES: Record<AIUsageArea, CategoryId[]> = {
  research_ideas: ["research_ideas"],
  planning: ["planning"],
  writing: ["writing", "business_marketing"],
  design: ["design", "business_marketing"],
  editing: ["editing"],
  analytics: ["analytics"],
  client_communication: ["client_communication", "business_client_communication", "business_sales"],
  automation: ["scheduling_publishing", "business_admin", "business_delivery"],
  other: [],
};

export const AI_LEVEL_DISCOUNT: Record<AIUsageLevel, number> = {
  none: 1,
  sometimes: 0.85,
  regularly: 0.7,
  core: 0.5,
};

/** Simple deterministic keyword match for Question 5 (no LLM). Lowercased substring match. */
export const VANISH_TASK_KEYWORDS: Record<CategoryId, string[]> = {
  research_ideas: ["idea", "research", "فكرة", "أفكار", "بحث"],
  planning: ["plan", "خطة", "تخطيط", "تنظيم"],
  writing: ["writ", "script", "caption", "hook", "كتاب", "سكربت", "كابشن", "هوك"],
  filming: ["film", "shoot", "record", "تصوير", "تصويري"],
  editing: ["edit", "montage", "مونتاج", "تعديل"],
  design: ["design", "تصميم"],
  scheduling_publishing: ["schedul", "publish", "post", "جدول", "نشر"],
  client_communication: ["comment", "dm", "message", "تعليق", "رسائل", "رسالة"],
  analytics: ["analytic", "metric", "insight", "تحليل", "إحصائ", "أداء"],
  business_sales: ["sale", "lead", "بيع", "مبيع", "عميل محتمل"],
  business_client_communication: ["client", "customer", "عميل", "عملاء"],
  business_delivery: ["deliver", "fulfil", "order", "تسليم", "طلب", "تنفيذ"],
  business_admin: ["invoic", "admin", "paperwork", "فاتورة", "إداري", "أوراق"],
  business_team: ["team", "staff", "فريق", "موظف"],
  business_marketing: ["market", "campaign", "ads", "تسويق", "حملة", "إعلان"],
};
