import type { TaskScore } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function AutomationPriorityList({ tasks }: { tasks: TaskScore[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-extrabold text-ink mb-1">أكبر فرص لتقليل العمل اليدوي</h3>
      <p className="text-xs text-ink-soft mb-4">
        ترتيب حسب الوقت المستهلك وإمكانية الأتمتة — للأولوية فقط، مو وعد بعدد ساعات محدد.
      </p>
      <ul className="flex flex-col gap-2">
        {tasks.map((t, i) => (
          <li
            key={t.key}
            className="flex items-center justify-between gap-4 rounded-xl bg-accent-soft/60 px-4 py-2.5"
          >
            <span className="text-sm font-medium text-ink">
              {i + 1}. {t.label}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
