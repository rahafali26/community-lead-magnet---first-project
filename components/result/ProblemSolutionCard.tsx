"use client";

import { useState } from "react";
import { Check, Copy, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import type { ResolvedProblem } from "@/lib/types";

export function ProblemSolutionCard({
  problem,
  index,
  submissionId,
}: {
  problem: ResolvedProblem;
  index: number;
  submissionId: string;
}) {
  const { dict } = useLocale();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(problem.promptTemplate);
      setCopied(true);
      trackEvent("copied_prompt", { categoryId: problem.categoryId }, submissionId);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard denied — silently ignore
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-t-4 border-primary bg-problem-soft p-6">
        <p className="text-xs font-bold text-primary mb-1">#{index + 1}</p>
        <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
          {problem.problemLabel}
        </h3>
        <p className="text-xs font-bold text-text-secondary mb-1">
          {dict.results.whyItMattersLabel}
        </p>
        <p className="text-sm text-text-secondary mb-3">{problem.whyItMatters}</p>
        <p className="text-xs font-bold text-text-secondary mb-1">
          {dict.results.diagnosisLabel}
        </p>
        <p className="text-sm text-text-primary">{problem.diagnosis}</p>
      </div>

      <div className="bg-secondary-soft p-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-secondary" />
          <p className="text-xs font-bold text-secondary">{dict.results.quickWinLabel}</p>
        </div>
        <h4 className="font-bold text-text-primary mb-1">{problem.quickWinTitle}</h4>
        <p className="text-sm text-text-secondary mb-4">{problem.quickWinDescription}</p>

        <p className="text-xs font-bold text-text-secondary mb-1">{dict.results.promptLabel}</p>
        <div className="rounded-xl bg-surface p-4 text-sm leading-relaxed whitespace-pre-wrap text-text-primary mb-3">
          {problem.promptTemplate}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
            copied
              ? "border-secondary bg-secondary text-white"
              : "border-border bg-surface text-text-primary hover:border-primary"
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? dict.results.copied : dict.results.copyPrompt}
        </button>
      </div>
    </Card>
  );
}
