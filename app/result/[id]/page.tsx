import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { ResultView } from "@/components/result/ResultView";
import type { AuditResults, TimeValueChoice, UserType } from "@/lib/types";

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
    .select("name, user_type, results, time_value_answers")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const timeValueAnswers = data.time_value_answers as { choice: TimeValueChoice; otherText?: string };

  return (
    <ResultView
      submissionId={id}
      name={data.name}
      userType={data.user_type as UserType}
      results={data.results as AuditResults}
      timeValueChoice={timeValueAnswers.choice}
      timeValueOtherText={timeValueAnswers.otherText}
    />
  );
}
