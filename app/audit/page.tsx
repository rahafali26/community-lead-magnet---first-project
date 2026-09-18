"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuditStore } from "@/store/auditStore";
import { getSteps } from "@/lib/auditSteps";
import { trackEvent } from "@/lib/analytics";
import type { AuditSubmission, LeadFormData, ProblemKey } from "@/lib/types";
import {
  BUSINESS_TASK_GROUPS,
  BUSINESS_TASK_LABELS,
  CONTENT_TASK_KEYS,
  CONTENT_TASK_LABELS,
} from "@/lib/types";
import {
  AI_USAGE_AREA_OPTIONS,
  AI_USAGE_LEVEL_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  CLIENTS_COUNT_OPTIONS,
  PLATFORMS_COUNT_OPTIONS,
  PRODUCTION_STYLE_OPTIONS,
  PROBLEMS_OPTIONS,
  TEAM_OPTIONS,
  TIME_VALUE_OPTIONS,
  VOLUME_OPTIONS,
} from "@/lib/auditOptions";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { SingleChoiceStep } from "@/components/audit/SingleChoiceStep";
import { MultiChoiceStep } from "@/components/audit/MultiChoiceStep";
import { OpenTextStep } from "@/components/audit/OpenTextStep";
import { TaskHoursStep } from "@/components/audit/TaskHoursStep";
import { GatedResultsForm } from "@/components/audit/GatedResultsForm";
import { ResultPreview } from "@/components/audit/ResultPreview";
import { computeAuditResults } from "@/lib/scoring";

export default function AuditPage() {
  const router = useRouter();
  const store = useAuditStore();
  const [submitError, setSubmitError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemsSelected = (store.problems.selected ?? []) as ProblemKey[];
  const steps = useMemo(
    () => getSteps(store.userType, problemsSelected),
    [store.userType, problemsSelected]
  );

  const currentStepId = steps[store.step] ?? steps[0];

  useEffect(() => {
    trackEvent("started_audit");
    // يُسجَّل مرة واحدة عند دخول الصفحة فقط
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goNext() {
    if (store.step >= steps.length - 1) return;
    store.next();
  }

  function goBack() {
    store.back();
  }

  async function handleFinalSubmit(lead: LeadFormData) {
    setIsSubmitting(true);
    setSubmitError(undefined);

    const submission: AuditSubmission = {
      userType: store.userType!,
      content: store.content as AuditSubmission["content"],
      business:
        store.userType === "creator_business"
          ? (store.business as AuditSubmission["business"])
          : undefined,
      problems: {
        selected: problemsSelected,
        otherText: store.problems.otherText,
        automationWishText: store.problems.automationWishText ?? "",
      },
      aiUsage: store.aiUsage as AuditSubmission["aiUsage"],
      timeValue: store.timeValue!,
      lead,
    };

    trackEvent("completed_audit");
    if (lead.marketingConsent) trackEvent("marketing_opt_in");

    try {
      const res = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data?.error ?? "صار خطأ، حاولي مرة ثانية.");
        setIsSubmitting(false);
        return;
      }

      store.reset();
      router.push(`/result/${data.id}`);
    } catch {
      setSubmitError("تعذر الاتصال بالخادم، تأكدي من الإنترنت وحاولي مرة ثانية.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-14">
        <div className="mb-8">
          <ProgressBar current={store.step + 1} total={steps.length} />
        </div>

        <Card className="p-6 sm:p-8">
          {currentStepId === "user_type" && (
            <SingleChoiceStep
              title="أي وصف أقرب لك؟"
              options={[
                { value: "creator", label: "صانع محتوى" },
                { value: "creator_business", label: "صانع محتوى + صاحب بزنس" },
              ]}
              value={store.userType}
              onChange={(v) => {
                store.setUserType(v);
                trackEvent("completed_profile", { userType: v });
              }}
              onNext={goNext}
              showBack={false}
            />
          )}

          {currentStepId === "content_volume" && (
            <SingleChoiceStep
              title="كم قطعة محتوى تنتجين تقريبًا شهريًا؟"
              options={VOLUME_OPTIONS}
              value={store.content.volume}
              onChange={(v) => store.updateContent({ volume: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "platforms_count" && (
            <SingleChoiceStep
              title="كم عدد المنصات اللي تنشرين عليها؟"
              options={PLATFORMS_COUNT_OPTIONS}
              value={store.content.platformsCount}
              onChange={(v) => store.updateContent({ platformsCount: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "production_style" && (
            <SingleChoiceStep
              title="كيف طريقة إنتاجك للمحتوى؟"
              options={PRODUCTION_STYLE_OPTIONS}
              value={store.content.productionStyle}
              onChange={(v) => store.updateContent({ productionStyle: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "content_tasks" && (
            <TaskHoursStep
              title="كم ساعة تقريبًا تأخذ منك كل مهمة شهريًا؟"
              subtitle="مهام صناعة المحتوى"
              tasks={CONTENT_TASK_KEYS.map((key) => ({ key, label: CONTENT_TASK_LABELS[key] }))}
              values={store.content.taskHours ?? {}}
              onChange={(key, value) =>
                store.updateContent({
                  taskHours: { ...store.content.taskHours, [key]: value },
                })
              }
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "vanish_task" && (
            <OpenTextStep
              title="لو تقدر تختفي عنك مهمة واحدة من صناعة المحتوى للأبد، وش بتختار؟"
              placeholder="اكتبي إجابتك هنا..."
              value={store.content.vanishTaskText ?? ""}
              onChange={(v) => store.updateContent({ vanishTaskText: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "business_type" && (
            <SingleChoiceStep
              title="وش نوع البزنس؟"
              options={BUSINESS_TYPE_OPTIONS}
              value={store.business.businessType}
              onChange={(v) => store.updateBusiness({ businessType: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "business_team" && (
            <SingleChoiceStep
              title="كيف شكل الفريق عندك؟"
              options={TEAM_OPTIONS}
              value={store.business.team}
              onChange={(v) => store.updateBusiness({ team: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "business_clients" && (
            <SingleChoiceStep
              title="كم عدد عملائك النشطين تقريبًا؟"
              options={CLIENTS_COUNT_OPTIONS}
              value={store.business.clientsCount}
              onChange={(v) => store.updateBusiness({ clientsCount: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId.startsWith("business_tasks_") &&
            (() => {
              const groupIndex = Number(currentStepId.split("_").pop());
              const group = BUSINESS_TASK_GROUPS[groupIndex];
              return (
                <TaskHoursStep
                  title="كم ساعة تقريبًا تأخذ منك كل مهمة شهريًا؟"
                  subtitle={group.title}
                  tasks={group.keys.map((key) => ({ key, label: BUSINESS_TASK_LABELS[key] }))}
                  values={store.business.taskHours ?? {}}
                  onChange={(key, value) =>
                    store.updateBusiness({
                      taskHours: { ...store.business.taskHours, [key]: value },
                    })
                  }
                  onBack={goBack}
                  onNext={goNext}
                />
              );
            })()}

          {currentStepId === "problems" && (
            <MultiChoiceStep
              title="وش أكثر شيء تحسين أنه يضغط عليك حاليًا؟"
              options={PROBLEMS_OPTIONS}
              values={problemsSelected}
              onChange={(v) => store.updateProblems({ selected: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "problems_other" && (
            <OpenTextStep
              title="ودك تفصّلين أكثر؟"
              placeholder="اكتبي التفاصيل هنا..."
              value={store.problems.otherText ?? ""}
              onChange={(v) => store.updateProblems({ otherText: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "automation_wish" && (
            <OpenTextStep
              title="وش أكثر شيء تتمنين يصير تلقائيًا في شغلك؟"
              placeholder="اكتبي إجابتك هنا..."
              value={store.problems.automationWishText ?? ""}
              onChange={(v) => store.updateProblems({ automationWishText: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "ai_usage_level" && (
            <SingleChoiceStep
              title="كيف تستخدمين أدوات الذكاء الاصطناعي حاليًا؟"
              options={AI_USAGE_LEVEL_OPTIONS}
              value={store.aiUsage.level}
              onChange={(v) => store.updateAIUsage({ level: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "ai_usage_areas" && (
            <MultiChoiceStep
              title="في وش تستخدمين AI؟"
              options={AI_USAGE_AREA_OPTIONS}
              values={store.aiUsage.areas ?? []}
              onChange={(v) => store.updateAIUsage({ areas: v })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "time_value" && (
            <SingleChoiceStep
              title="لو وفرتي 5 ساعات من وقتك كل شهر، وش بتسوين فيها؟"
              options={TIME_VALUE_OPTIONS}
              value={store.timeValue}
              onChange={(v) => store.setTimeValue(v)}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "gated_form" && (
            <>
              <ResultPreview
                results={computeAuditResults({
                  userType: store.userType!,
                  content: store.content as AuditSubmission["content"],
                  business:
                    store.userType === "creator_business"
                      ? (store.business as AuditSubmission["business"])
                      : undefined,
                  problems: {
                    selected: problemsSelected,
                    otherText: store.problems.otherText,
                    automationWishText: store.problems.automationWishText ?? "",
                  },
                  aiUsage: store.aiUsage as AuditSubmission["aiUsage"],
                  timeValue: store.timeValue!,
                  lead: {} as LeadFormData,
                })}
              />
              <GatedResultsForm
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
                errorMessage={submitError}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
