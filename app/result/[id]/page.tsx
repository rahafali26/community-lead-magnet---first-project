import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import type { AuditResults, UserType } from "@/lib/types";
import { ResultSummaryCards } from "@/components/result/ResultSummaryCards";
import { TopTasksList } from "@/components/result/TopTasksList";
import { AutomationPriorityList } from "@/components/result/AutomationPriorityList";
import { QuickWinCard } from "@/components/result/QuickWinCard";
import { EmailResultButton } from "@/components/result/EmailResultButton";
import { ViewTracker } from "@/components/result/ViewTracker";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .select("name, user_type, results")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const results = data.results as AuditResults;
  const userType = data.user_type as UserType;

  return (
    <div className="min-h-screen hero-gradient">
      <ViewTracker submissionId={id} />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16 flex flex-col gap-6">
        <div>
          <p className="text-ink-soft text-sm">تحليلك يا {data.name} 👇</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            نتيجة تحليل وقتك
          </h1>
        </div>

        <ResultSummaryCards results={results} userType={userType} />
        <TopTasksList tasks={results.topTasks} />
        <AutomationPriorityList tasks={results.automationPriorities} />
        <QuickWinCard quickWin={results.quickWin} submissionId={id} />

        <div className="flex flex-wrap items-center gap-3">
          <EmailResultButton submissionId={id} />
          <Link href="/">
            <Button variant="ghost">رجوع للصفحة الرئيسية</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
