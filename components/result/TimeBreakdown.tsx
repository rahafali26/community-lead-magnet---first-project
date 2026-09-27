"use client";

import { Card } from "@/components/ui/Card";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { resolveCategoryLabel } from "@/lib/solutions/resolveProblem";
import type { AuditResults, UserType } from "@/lib/types";

function formatHours(h: number): string {
  return h.toFixed(1).replace(/\.0$/, "");
}

export function TimeBreakdown({
  results,
  userType,
}: {
  results: AuditResults;
  userType: UserType;
}) {
  const { dict, locale } = useLocale();
  // Mirrors the canonical topProblems (same items, same #1-#3 order as the Top Problems
  // section and solution cards) instead of independently picking the highest-hour tasks —
  // otherwise this chart and the problems below it could show different things.
  const chartRows = results.topProblems.map((p) => ({
    key: p.categoryId,
    label: resolveCategoryLabel(p.categoryId, locale),
    hours: p.hours,
  }));
  const maxTaskHours = Math.max(1, ...chartRows.map((t) => t.hours));

  return (
    <Card className="p-6">
      <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
        {dict.results.timeBreakdownHeading}
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-6">
        <div>
          <p className="text-xs text-text-secondary">{dict.results.contentHoursLabel}</p>
          <p className="mt-1 text-2xl font-extrabold text-text-primary tabular-nums">
            {formatHours(results.contentHoursTotal)}
          </p>
        </div>
        {userType === "creator_business" && (
          <div>
            <p className="text-xs text-text-secondary">{dict.results.businessHoursLabel}</p>
            <p className="mt-1 text-2xl font-extrabold text-text-primary tabular-nums">
              {formatHours(results.businessHoursTotal)}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-text-secondary">{dict.results.totalHoursLabel}</p>
          <p className="mt-1 text-2xl font-extrabold text-primary tabular-nums">
            {formatHours(results.totalHours)}
          </p>
        </div>
        {userType === "creator_business" && results.contentVsBusinessRatio !== null && (
          <div className="col-span-2 sm:col-span-3">
            <p className="text-xs text-text-secondary mb-1">{dict.results.ratioLabel}</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted flex">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.round(results.contentVsBusinessRatio * 100)}%` }}
              />
              <div
                className="h-full bg-secondary"
                style={{ width: `${Math.round((1 - results.contentVsBusinessRatio) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {chartRows.map((t) => (
          <div key={t.key} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate text-xs text-text-secondary sm:w-40">
              {t.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round((t.hours / maxTaskHours) * 100)}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-end text-xs font-bold text-text-primary tabular-nums">
              {formatHours(t.hours)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
