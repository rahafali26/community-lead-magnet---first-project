import type { AuditResults, UserType } from "@/lib/types";
import { Card } from "@/components/ui/Card";

function formatHours(h: number): string {
  return h.toFixed(1).replace(/\.0$/, "");
}

export function ResultSummaryCards({
  results,
  userType,
}: {
  results: AuditResults;
  userType: UserType;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Card className="p-5">
        <p className="text-xs text-ink-soft">ساعات المحتوى شهريًا</p>
        <p className="mt-1 text-2xl font-extrabold text-ink">
          {formatHours(results.contentHoursTotal)}
        </p>
      </Card>

      {userType === "creator_business" && (
        <Card className="p-5">
          <p className="text-xs text-ink-soft">ساعات البزنس شهريًا</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">
            {formatHours(results.businessHoursTotal)}
          </p>
        </Card>
      )}

      <Card className="p-5">
        <p className="text-xs text-ink-soft">إجمالي وقتك شهريًا</p>
        <p className="mt-1 text-2xl font-extrabold text-ink">
          {formatHours(results.totalHours)}
        </p>
      </Card>

      {userType === "creator_business" && results.contentVsBusinessRatio !== null && (
        <Card className="p-5">
          <p className="text-xs text-ink-soft">نسبة المحتوى مقابل البزنس</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">
            {Math.round(results.contentVsBusinessRatio * 100)}٪ / {" "}
            {Math.round((1 - results.contentVsBusinessRatio) * 100)}٪
          </p>
        </Card>
      )}
      <p className="col-span-full text-xs text-ink-soft">
        هذي أرقام تقديرية مبنية على إجاباتك، مو قياسًا دقيقًا لوقتك الفعلي.
      </p>
    </div>
  );
}
