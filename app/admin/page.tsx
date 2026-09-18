import { createAdminClient } from "@/lib/supabase/server";
import { computeAdminStats, type SubmissionRow } from "@/lib/admin/stats";
import { StatsCards } from "@/components/admin/StatsCards";
import { ChartsSection } from "@/components/admin/ChartsSection";
import { OpenAnswersTable } from "@/components/admin/OpenAnswersTable";
import { ExportButton } from "@/components/admin/ExportButton";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("submissions")
    .select(
      "id, created_at, name, email, user_type, content_answers, business_answers, problems, ai_usage, results"
    )
    .order("created_at", { ascending: false });

  const stats = computeAdminStats((data ?? []) as SubmissionRow[]);

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-ink">لوحة الإدارة</h1>
          <div className="flex items-center gap-3">
            <ExportButton />
            <LogoutButton />
          </div>
        </div>

        <StatsCards stats={stats} />
        <ChartsSection stats={stats} />
        <OpenAnswersTable answers={stats.openAnswers} />
      </div>
    </div>
  );
}
