import type { AdminStats } from "@/lib/admin/stats";
import { Card } from "@/components/ui/Card";

export function OpenAnswersTable({ answers }: { answers: AdminStats["openAnswers"] }) {
  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="font-extrabold text-ink mb-4">الإجابات المفتوحة</h3>
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="text-right text-ink-soft border-b border-ink/10">
            <th className="py-2 pl-4">الاسم</th>
            <th className="py-2 pl-4">المهمة الي يتمنى تختفي</th>
            <th className="py-2">وش يتمنى يصير تلقائي</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a, i) => (
            <tr key={i} className="border-b border-ink/5 align-top">
              <td className="py-2 pl-4 font-medium text-ink whitespace-nowrap">{a.name}</td>
              <td className="py-2 pl-4 text-ink-soft">{a.vanishTaskText || "—"}</td>
              <td className="py-2 text-ink-soft">{a.automationWishText || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {answers.length === 0 && (
        <p className="text-sm text-ink-soft py-4 text-center">ما فيه إجابات بعد.</p>
      )}
    </Card>
  );
}
