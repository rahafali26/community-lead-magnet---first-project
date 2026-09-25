import { Resend } from "resend";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { resolveProblemSolution } from "@/lib/solutions/resolveProblem";
import type { AuditResults, Locale, UserType } from "@/lib/types";

/**
 * NOT WIRED UP IN V1 — per project requirements, results are not emailed automatically and
 * there is no "send me a copy" button. This module is kept ready but unimported by any active
 * code path (no route or component calls it). To re-enable later: call `sendResultEmail` from
 * `app/api/submit-audit/route.ts` after saving the submission, and/or add back a UI button that
 * posts to a small API route calling this function with a submission id.
 */

function formatHours(h: number): string {
  return h.toFixed(1).replace(/\.0$/, "");
}

function buildEmailHtml(
  name: string,
  userType: UserType,
  results: AuditResults,
  locale: Locale
): string {
  const dict = getDictionary(locale);
  const resolvedProblems = results.topProblems.map((sig) => resolveProblemSolution(sig, locale));
  const rtl = locale === "ar";

  const problemsHtml = resolvedProblems
    .map(
      (p) => `<h3>${p.problemLabel}</h3><p>${p.diagnosis}</p><p><strong>${p.quickWinTitle}</strong>: ${p.quickWinDescription}</p>`
    )
    .join("");

  const businessLine =
    userType === "creator_business"
      ? `<p>${dict.results.businessHoursLabel}: <strong>${formatHours(results.businessHoursTotal)}</strong></p>`
      : "";

  return `
    <div dir="${rtl ? "rtl" : "ltr"}" style="font-family: Arial, sans-serif; color:#241f2e; max-width:560px; margin:0 auto;">
      <h2>${dict.results.greeting(name)}</h2>
      <p>${dict.results.contentHoursLabel}: <strong>${formatHours(results.contentHoursTotal)}</strong></p>
      ${businessLine}
      <p>${dict.results.totalHoursLabel}: <strong>${formatHours(results.totalHours)}</strong></p>
      ${problemsHtml}
      <p style="margin-top:24px; font-size:12px; color:#6b6470;">${dict.common.disclaimer}</p>
    </div>
  `;
}

export async function sendResultEmail(params: {
  to: string;
  name: string;
  userType: UserType;
  results: AuditResults;
  locale: Locale;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromAddress) {
    console.warn("RESEND_API_KEY or RESEND_FROM_EMAIL not set — skipping email send.");
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const dict = getDictionary(params.locale);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: params.to,
    subject: dict.pdf.title,
    html: buildEmailHtml(params.name, params.userType, params.results, params.locale),
  });

  if (error) {
    console.error("Failed to send result email:", error);
    return { skipped: false, error };
  }

  return { skipped: false };
}
