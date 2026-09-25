import { NextRequest, NextResponse } from "next/server";
import { auditSubmissionSchema } from "@/lib/validation/auditSchema";
import { computeAuditResults } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase/server";

// Email sending is intentionally NOT wired up in V1 — see lib/email/sendResultEmail.ts for the
// ready-but-unused implementation and re-enable instructions.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = auditSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const submission = parsed.data;
  const results = computeAuditResults(submission);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      name: submission.lead.name,
      email: submission.lead.email,
      account_url: submission.lead.accountUrl,
      primary_platform: submission.lead.primaryPlatform,
      primary_platform_other_text: submission.lead.primaryPlatformOtherText ?? null,
      user_type: submission.userType,
      data_consent: true,
      marketing_consent: submission.lead.marketingConsent,
      language: submission.language,
      content_volume: submission.contentVolume,
      time_breakdown: submission.timeBreakdown,
      pain_points: submission.painPoints,
      vanish_task: submission.vanishTask,
      ai_usage: submission.aiUsage,
      time_value_answers: submission.timeValue,
      results,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to save audit submission:", error);
    return NextResponse.json({ error: "Could not save your result" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, results });
}
