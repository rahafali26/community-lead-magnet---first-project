"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminStats } from "@/lib/admin/stats";
import { Card } from "@/components/ui/Card";

const AI_LEVEL_LABELS: Record<string, string> = {
  none: "ما يستخدمه",
  sometimes: "أحيانًا",
  regularly: "بشكل مستمر",
  heavily: "يعتمد عليه بشكل كبير",
};

function ChartCard({ title, data }: { title: string; data: { label: string; value: number }[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-extrabold text-ink mb-4">{title}</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#241f2e" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function ChartsSection({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="أكثر المشاكل تكرارًا"
        data={stats.topProblems.map((p) => ({ label: p.label, value: p.count }))}
      />
      <ChartCard
        title="أكثر المهام استهلاكًا للوقت (إجمالي ساعات)"
        data={stats.topTimeConsumingTasks.map((t) => ({
          label: t.label,
          value: Math.round(t.totalHours),
        }))}
      />
      <ChartCard
        title="أكثر أنواع الأتمتة المطلوبة"
        data={stats.topAutomationRequests.map((t) => ({ label: t.label, value: t.count }))}
      />
      <ChartCard
        title="مستوى استخدام AI"
        data={stats.aiUsageDistribution.map((a) => ({
          label: AI_LEVEL_LABELS[a.level],
          value: a.count,
        }))}
      />
    </div>
  );
}
