import { useLocale } from "@/lib/i18n/LocaleProvider";

function formatHours(h: number): string {
  return h.toFixed(1).replace(/\.0$/, "");
}

export function OverallSummary({
  totalHours,
  topProblemLabel,
  timeValueLabel,
}: {
  totalHours: number;
  topProblemLabel?: string;
  timeValueLabel: string;
}) {
  const { dict, locale } = useLocale();
  const hours = formatHours(totalHours);

  let text: string;
  if (locale === "ar") {
    text = `بناءً على إجاباتك، وقتك الشهري تقريبًا ${hours} ساعة.`;
    if (topProblemLabel) text += ` أعلى فرصة عندك حاليًا: ${topProblemLabel}.`;
    text += ` وأنت قلت لو رجعت لك هذي الساعات بتحب تستخدمها في: ${timeValueLabel}. وهذا بالضبط وين يقدر يوديك الحل المقترح تحت.`;
  } else {
    text = `Based on your answers, your monthly time comes to roughly ${hours} hours.`;
    if (topProblemLabel) text += ` Your top opportunity right now: ${topProblemLabel}.`;
    text += ` You said you'd want to use recovered time on: ${timeValueLabel} — that's exactly what the solution below can help move you toward.`;
  }

  return (
    <div className="rounded-3xl bg-primary p-6 text-white shadow-[0_2px_20px_rgba(36,31,46,0.05)]">
      <h3 className="font-heading text-lg font-bold mb-2">{dict.results.summaryHeading}</h3>
      <p className="text-sm leading-relaxed text-white/90">{text}</p>
    </div>
  );
}
