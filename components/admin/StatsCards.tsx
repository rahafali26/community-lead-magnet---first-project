import type { AdminStats } from "@/lib/admin/stats";
import { Card } from "@/components/ui/Card";

export function StatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Creators only", value: stats.creatorCount },
    { label: "Creators + Business", value: stats.creatorBusinessCount },
    { label: "Avg. content hours", value: stats.avgContentHours.toFixed(1) },
    { label: "Avg. business hours", value: stats.avgBusinessHours.toFixed(1) },
    { label: "Avg. total hours", value: stats.avgTotalHours.toFixed(1) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <Card key={c.label} className="p-4">
          <p className="text-xs text-text-secondary">{c.label}</p>
          <p className="mt-1 text-xl font-extrabold text-text-primary tabular-nums">{c.value}</p>
        </Card>
      ))}
    </div>
  );
}
