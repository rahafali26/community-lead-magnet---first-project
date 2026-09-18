import type { AdminStats } from "@/lib/admin/stats";
import { Card } from "@/components/ui/Card";

export function StatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: "إجمالي المستخدمين", value: stats.totalUsers },
    { label: "صناع محتوى فقط", value: stats.creatorCount },
    { label: "صناع محتوى + بزنس", value: stats.creatorBusinessCount },
    { label: "متوسط ساعات المحتوى", value: stats.avgContentHours.toFixed(1) },
    { label: "متوسط ساعات البزنس", value: stats.avgBusinessHours.toFixed(1) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.label} className="p-4">
          <p className="text-xs text-ink-soft">{c.label}</p>
          <p className="mt-1 text-xl font-extrabold text-ink">{c.value}</p>
        </Card>
      ))}
    </div>
  );
}
