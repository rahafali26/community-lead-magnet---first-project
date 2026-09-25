import type { AdminStats } from "@/lib/admin/stats";
import { Card } from "@/components/ui/Card";

export function OpenAnswersTable({ answers }: { answers: AdminStats["openAnswers"] }) {
  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
        Open-text answers
      </h3>
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="text-start text-text-secondary border-b border-border">
            <th className="py-2 px-2">Name</th>
            <th className="py-2 px-2">Task to eliminate/automate</th>
            <th className="py-2 px-2">Other (pain points)</th>
            <th className="py-2 px-2">Other (AI usage)</th>
            <th className="py-2 px-2">Other (time value)</th>
            <th className="py-2 px-2">Other (platform)</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a, i) => (
            <tr key={i} className="border-b border-border/60 align-top">
              <td className="py-2 px-2 font-medium text-text-primary whitespace-nowrap">{a.name}</td>
              <td className="py-2 px-2 text-text-secondary">{a.vanishTask || "—"}</td>
              <td className="py-2 px-2 text-text-secondary">{a.painOtherText || "—"}</td>
              <td className="py-2 px-2 text-text-secondary">{a.aiUsageOtherText || "—"}</td>
              <td className="py-2 px-2 text-text-secondary">{a.timeValueOtherText || "—"}</td>
              <td className="py-2 px-2 text-text-secondary">{a.platformOtherText || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {answers.length === 0 && (
        <p className="text-sm text-text-secondary py-4 text-center">No answers yet.</p>
      )}
    </Card>
  );
}
