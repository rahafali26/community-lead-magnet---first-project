import { getDictionary } from "@/lib/i18n/getDictionary";
import { BUSINESS_TASK_KEYS, type Locale, type TaskKey } from "@/lib/types";

export function taskLabel(task: TaskKey, locale: Locale): string {
  const dict = getDictionary(locale);
  const isBusinessTask = (BUSINESS_TASK_KEYS as readonly string[]).includes(task);
  const labels = isBusinessTask ? dict.audit.q3.businessTaskLabels : dict.audit.q3.contentTaskLabels;
  return labels[task] ?? task;
}
