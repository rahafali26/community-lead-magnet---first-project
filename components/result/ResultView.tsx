"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { resolveAllProblems } from "@/lib/solutions/resolveProblem";
import { OverallSummary } from "./OverallSummary";
import { TimeBreakdown } from "./TimeBreakdown";
import { ProblemSolutionCard } from "./ProblemSolutionCard";
import { ViewTracker } from "./ViewTracker";
import type { AuditResults, TimeValueChoice, UserType } from "@/lib/types";

interface ResultViewProps {
  submissionId: string;
  name: string;
  userType: UserType;
  results: AuditResults;
  timeValueChoice: TimeValueChoice;
  timeValueOtherText?: string;
}

export function ResultView({
  submissionId,
  name,
  userType,
  results,
  timeValueChoice,
  timeValueOtherText,
}: ResultViewProps) {
  const { dict, locale } = useLocale();

  const resolvedProblems = resolveAllProblems(results.topProblems, locale);

  const timeValueLabel =
    timeValueChoice === "other" && timeValueOtherText
      ? timeValueOtherText
      : dict.audit.q7.options[timeValueChoice];

  return (
    <div className="min-h-screen hero-gradient">
      <ViewTracker submissionId={submissionId} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-text-secondary text-sm">{dict.results.greeting(name)}</p>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
              {dict.results.pageTitle}
            </h1>
          </div>
          <LanguageToggle />
        </div>

        <OverallSummary
          totalHours={results.totalHours}
          topProblemLabel={resolvedProblems[0]?.problemLabel}
          timeValueLabel={timeValueLabel}
        />

        <TimeBreakdown results={results} userType={userType} />

        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary mb-3">
            {dict.results.topProblemsHeading}
          </h2>

          {resolvedProblems.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <p className="font-bold text-text-primary mb-1">{dict.results.noProblemsTitle}</p>
              <p className="text-sm text-text-secondary">{dict.results.noProblemsBody}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {resolvedProblems.map((p, i) => (
                <ProblemSolutionCard
                  key={p.categoryId}
                  problem={p}
                  index={i}
                  submissionId={submissionId}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-text-secondary">{dict.common.disclaimer}</p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/api/submissions/${submissionId}/report?lang=${locale}`}
            onClick={() => trackEvent("downloaded_report", undefined, submissionId)}
          >
            <Button>
              <Download className="h-4 w-4" />
              {dict.results.downloadReport}
            </Button>
          </a>
          <Link href="/">
            <Button variant="ghost">{dict.results.backHome}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
