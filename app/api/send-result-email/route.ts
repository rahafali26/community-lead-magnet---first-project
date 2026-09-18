import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendResultEmail } from "@/lib/email/sendResultEmail";
import type { AuditResults, UserType } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;

  if (!id) {
    return NextResponse.json({ error: "معرف غير صحيح" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("name, email, user_type, results")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "لم يتم العثور على النتيجة" }, { status: 404 });
  }

  const result = await sendResultEmail({
    to: data.email,
    name: data.name,
    userType: data.user_type as UserType,
    results: data.results as AuditResults,
  });

  if (result.error) {
    return NextResponse.json({ error: "تعذر إرسال الإيميل" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
