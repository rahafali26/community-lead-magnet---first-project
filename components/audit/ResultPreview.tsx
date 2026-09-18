import type { AuditResults } from "@/lib/types";

interface ResultPreviewProps {
  results: AuditResults;
}

export function ResultPreview({ results }: ResultPreviewProps) {
  return (
    <div className="mb-6 rounded-2xl bg-accent-soft p-5">
      <p className="text-sm font-bold text-ink mb-3">تحليلك جاهز 👀</p>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-ink-soft">إجمالي وقتك شهريًا</p>
          <p className="text-3xl font-extrabold text-ink blur-sm select-none">
            {results.totalHours.toFixed(0)} ساعة
          </p>
        </div>
        <div className="h-10 w-px bg-ink/10" />
        <div>
          <p className="text-xs text-ink-soft">أعلى فرصة أتمتة</p>
          <p className="text-lg font-bold text-ink blur-sm select-none">
            {results.automationPriorities[0]?.label ?? "—"}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        عبّي بياناتك تحت عشان تشوفي الأرقام كاملة + Quick Win مناسب لك.
      </p>
    </div>
  );
}
