import { NextRequest, NextResponse } from "next/server";
import { auditSubmissionSchema } from "@/lib/validation/auditSchema";
import { computeAuditResults } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase/server";
import { sendResultEmail } from "@/lib/email/sendResultEmail";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const parsed = auditSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", issues: parsed.error.issues },
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
      account_url: submission.lead.accountUrl ?? null,
      primary_platform: submission.lead.primaryPlatform ?? null,
      user_type: submission.userType,
      data_consent: submission.lead.dataConsent,
      marketing_consent: submission.lead.marketingConsent,
      content_answers: submission.content,
      business_answers: submission.business ?? null,
      problems: submission.problems,
      ai_usage: submission.aiUsage,
      time_value: submission.timeValue,
      results,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("فشل حفظ نتيجة الاختبار:", error);
    return NextResponse.json({ error: "تعذر حفظ النتيجة" }, { status: 500 });
  }

  // إرسال الإيميل لا يوقف الاستجابة عن المستخدم في حال فشله
  await sendResultEmail({
    to: submission.lead.email,
    name: submission.lead.name,
    userType: submission.userType,
    results,
  }).catch((e) => console.error("خطأ غير متوقع أثناء إرسال الإيميل:", e));

  return NextResponse.json({ id: data.id, results });
}
