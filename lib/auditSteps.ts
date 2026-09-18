import { BUSINESS_TASK_GROUPS } from "@/lib/types";
import type { ProblemKey, UserType } from "@/lib/types";

export type StepId =
  | "user_type"
  | "content_volume"
  | "platforms_count"
  | "production_style"
  | "content_tasks"
  | "vanish_task"
  | "business_type"
  | "business_team"
  | "business_clients"
  | `business_tasks_${number}`
  | "problems"
  | "problems_other"
  | "automation_wish"
  | "ai_usage_level"
  | "ai_usage_areas"
  | "time_value"
  | "gated_form";

export function getSteps(
  userType: UserType | undefined,
  problemsSelected: ProblemKey[]
): StepId[] {
  const steps: StepId[] = [
    "user_type",
    "content_volume",
    "platforms_count",
    "production_style",
    "content_tasks",
    "vanish_task",
  ];

  if (userType === "creator_business") {
    steps.push(
      "business_type",
      "business_team",
      "business_clients",
      ...BUSINESS_TASK_GROUPS.map((_, i) => `business_tasks_${i}` as StepId)
    );
  }

  steps.push("problems");

  if (problemsSelected.includes("other")) {
    steps.push("problems_other");
  }

  steps.push(
    "automation_wish",
    "ai_usage_level",
    "ai_usage_areas",
    "time_value",
    "gated_form"
  );

  return steps;
}
