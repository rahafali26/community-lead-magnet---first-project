import type { TaskKey } from "@/lib/types";

/**
 * قابلية كل مهمة للأتمتة (1 = يدوية بطبيعتها، 5 = قابلة جدًا للأتمتة).
 * قيم ثابتة قابلة للتعديل بسهولة دون المساس بباقي المعادلة.
 */
export const AUTOMATION_POTENTIAL: Record<TaskKey, number> = {
  // محتوى
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

  // بزنس
  lead_research: 4,
  lead_outreach: 3,
  lead_followup: 4,
  client_replies: 2,
  meetings: 1,
  customer_service: 2,
  service_delivery: 1,
  order_prep: 3,
  invoicing: 5,
  file_organizing: 4,
  admin_tasks: 4,
  task_distribution: 3,
  team_followup: 3,
  internal_meetings: 1,
  campaigns: 3,
  offers: 3,
  business_marketing: 3,
};
