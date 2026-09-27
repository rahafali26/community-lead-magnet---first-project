"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuditStore } from "@/store/auditStore";
import { AUDIT_STEPS, TOTAL_AUDIT_QUESTIONS } from "@/lib/auditSteps";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { AuditSubmission, LeadFormData, PainPointKey, TimeValueChoice } from "@/lib/types";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { SingleChoiceStep } from "@/components/audit/SingleChoiceStep";
import { MultiChoiceStep } from "@/components/audit/MultiChoiceStep";
import { OpenTextStep } from "@/components/audit/OpenTextStep";
import { ContentVolumeStep } from "@/components/audit/ContentVolumeStep";
import { TimeBreakdownStep } from "@/components/audit/TimeBreakdownStep";
import { AIUsageStep } from "@/components/audit/AIUsageStep";
import { GatedResultsForm } from "@/components/audit/GatedResultsForm";

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-gradient" />}>
      <AuditPageInner />
    </Suspense>
  );
}

function AuditPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useAuditStore();
  const { dict, locale } = useLocale();
  const [submitError, setSubmitError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wantsFreshStart = searchParams.get("fresh") === "1";
  const [readyToRender, setReadyToRender] = useState(!wantsFreshStart);

  const currentStepId = AUDIT_STEPS[store.step];
  const onLeadCapture = store.step >= AUDIT_STEPS.length;

  useEffect(() => {
    trackEvent("started_audit");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Start Analysis" navigates here with ?fresh=1 instead of resetting the store at click time.
  // zustand's `persist` middleware rehydrates from localStorage ASYNCHRONOUSLY — a reset fired
  // synchronously on click can be silently overwritten moments later if that rehydration (e.g.
  // still in flight from this browser tab's very first load) resolves afterward, restoring an
  // old persisted answer (like a previously-checked Question-4 pain from an unrelated earlier
  // session) into what the user believes is a brand-new audit. Gating the reset on confirmed
  // hydration completion — rather than racing it — removes that window entirely.
  useEffect(() => {
    if (!wantsFreshStart) return;

    function resetAndReveal() {
      useAuditStore.getState().reset();
      setReadyToRender(true);
      router.replace("/audit");
    }

    if (useAuditStore.persist.hasHydrated()) {
      resetAndReveal();
      return;
    }

    const unsubscribe = useAuditStore.persist.onFinishHydration(resetAndReveal);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsFreshStart]);

  function goNext() {
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
      contentVolume: store.contentVolume as AuditSubmission["contentVolume"],
      timeBreakdown: store.timeBreakdown as AuditSubmission["timeBreakdown"],
      painPoints: store.painPoints as AuditSubmission["painPoints"],
      vanishTask: store.vanishTask,
      aiUsage: store.aiUsage as AuditSubmission["aiUsage"],
      timeValue: store.timeValue as AuditSubmission["timeValue"],
      lead,
      language: locale,
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
        setSubmitError(data?.error ?? dict.leadCapture.genericError);
        setIsSubmitting(false);
        return;
      }

      store.reset();
      router.push(`/result/${data.id}`);
    } catch {
      setSubmitError(dict.leadCapture.genericError);
      setIsSubmitting(false);
    }
  }

  // Render nothing until a pending "fresh start" reset has actually applied — prevents a
  // flash of stale, previously-persisted answers (from an earlier session) before reset() runs.
  if (!readyToRender) {
    return <div className="min-h-screen hero-gradient" />;
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            {!onLeadCapture && (
              <ProgressBar current={store.step + 1} total={TOTAL_AUDIT_QUESTIONS} />
            )}
          </div>
          <LanguageToggle />
        </div>

        <Card className="p-6 sm:p-8">
          {currentStepId === "q1" && (
            <SingleChoiceStep
              title={dict.audit.q1.title}
              options={[
                { value: "creator", label: dict.audit.q1.options.creator },
                { value: "creator_business", label: dict.audit.q1.options.creator_business },
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

          {currentStepId === "q2" && (
            <ContentVolumeStep
              volume={store.contentVolume.volume}
              platforms={store.contentVolume.platforms ?? []}
              otherText={store.contentVolume.platformOtherText ?? ""}
              onVolumeChange={(v) => store.updateContentVolume({ volume: v })}
              onPlatformsChange={(platforms) => store.updateContentVolume({ platforms })}
              onOtherTextChange={(t) => store.updateContentVolume({ platformOtherText: t })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "q3" && (
            <TimeBreakdownStep
              isBusiness={store.userType === "creator_business"}
              contentValues={store.timeBreakdown.contentTaskHours ?? {}}
              onContentChange={(key, value) =>
                store.updateTimeBreakdown({
                  contentTaskHours: { ...store.timeBreakdown.contentTaskHours, [key]: value },
                })
              }
              businessValues={store.timeBreakdown.businessTaskHours ?? {}}
              onBusinessChange={(key, value) =>
                store.updateTimeBreakdown({
                  businessTaskHours: { ...store.timeBreakdown.businessTaskHours, [key]: value },
                })
              }
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "q4" && (
            <MultiChoiceStep<PainPointKey>
              title={dict.audit.q4.title}
              subtitle={dict.audit.q4.subtitle}
              options={(Object.keys(dict.audit.q4.options) as PainPointKey[]).map((key) => ({
                value: key,
                label: dict.audit.q4.options[key],
              }))}
              values={store.painPoints.selected ?? []}
              onChange={(selected) => store.updatePainPoints({ selected })}
              maxSelected={3}
              maxHint={dict.audit.q4.maxHint}
              otherValue="other"
              otherText={store.painPoints.otherText ?? ""}
              onOtherTextChange={(t) => store.updatePainPoints({ otherText: t })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "q5" && (
            <OpenTextStep
              title={dict.audit.q5.title}
              subtitle={dict.audit.q5.subtitle}
              placeholder={dict.audit.q5.placeholder}
              value={store.vanishTask}
              onChange={store.setVanishTask}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "q6" && (
            <AIUsageStep
              level={store.aiUsage.level}
              areas={store.aiUsage.areas ?? []}
              otherText={store.aiUsage.otherText ?? ""}
              onLevelChange={(level) => store.updateAIUsage({ level })}
              onAreasChange={(areas) => store.updateAIUsage({ areas })}
              onOtherTextChange={(t) => store.updateAIUsage({ otherText: t })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {currentStepId === "q7" && (
            <SingleChoiceStep<TimeValueChoice>
              title={dict.audit.q7.title}
              subtitle={dict.audit.q7.subtitle}
              options={(Object.keys(dict.audit.q7.options) as TimeValueChoice[]).map((key) => ({
                value: key,
                label: dict.audit.q7.options[key],
              }))}
              value={store.timeValue.choice}
              onChange={(choice) => store.updateTimeValue({ choice })}
              otherValue="other"
              otherText={store.timeValue.otherText ?? ""}
              onOtherTextChange={(t) => store.updateTimeValue({ otherText: t })}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {onLeadCapture && (
            <GatedResultsForm
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              errorMessage={submitError}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
