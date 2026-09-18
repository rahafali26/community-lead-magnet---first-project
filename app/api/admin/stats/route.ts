import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { computeAdminStats, type SubmissionRow } from "@/lib/admin/stats";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, created_at, name, email, user_type, content_answers, business_answers, problems, ai_usage, results"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "تعذر جلب البيانات" }, { status: 500 });
  }

  const stats = computeAdminStats((data ?? []) as SubmissionRow[]);
  return NextResponse.json(stats);
}
