import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { computeAdminStats, type SubmissionRow } from "@/lib/admin/stats";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, created_at, name, email, user_type, language, content_volume, time_breakdown, pain_points, vanish_task, ai_usage, time_value_answers, results"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not fetch data" }, { status: 500 });
  }

  const stats = computeAdminStats((data ?? []) as SubmissionRow[]);
  return NextResponse.json(stats);
}
