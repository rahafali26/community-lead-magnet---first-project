import type { TaskScore } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function TopTasksList({ tasks }: { tasks: TaskScore[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-extrabold text-ink mb-4">أكثر 3 مهام تستهلك وقتك</h3>
      <ol className="flex flex-col gap-3">
        {tasks.map((t, i) => (
          <li key={t.key} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-ink">
                {i + 1}
              </span>
              <span className="font-medium text-ink">{t.label}</span>
            </span>
            <span className="text-sm text-ink-soft whitespace-nowrap">
              ~{t.hours.toFixed(1).replace(/\.0$/, "")} ساعة/شهر
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
