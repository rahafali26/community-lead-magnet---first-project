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

function ChartCard({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number }[];
}) {
  return (
    <Card className="p-6">
      <h3 className="font-heading text-lg font-bold text-text-primary mb-4">{title}</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="label" width={160} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} />
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
        title="Most common pain points (%)"
        data={stats.topPainPoints.map((p) => ({ label: p.label, value: p.percentage }))}
      />
      <ChartCard
        title="Top automation opportunities (%)"
        data={stats.topAutomationOpportunities.map((p) => ({ label: p.label, value: p.percentage }))}
      />
      <ChartCard
        title="AI usage level (%)"
        data={stats.aiUsageDistribution.map((a) => ({ label: a.label, value: a.percentage }))}
      />
      <ChartCard
        title="Language distribution (%)"
        data={stats.languageDistribution.map((l) => ({ label: l.label, value: l.percentage }))}
      />
    </div>
  );
}
