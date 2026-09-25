import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { TaskHoursRow } from "./TaskHoursRow";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  BUSINESS_TASK_KEYS,
  CONTENT_TASK_KEYS,
  type BusinessTaskKey,
  type ContentTaskKey,
  type TaskHoursValue,
} from "@/lib/types";

interface TimeBreakdownStepProps {
  isBusiness: boolean;
  contentValues: Partial<Record<ContentTaskKey, TaskHoursValue>>;
  onContentChange: (key: ContentTaskKey, value: TaskHoursValue) => void;
  businessValues: Partial<Record<BusinessTaskKey, TaskHoursValue>>;
  onBusinessChange: (key: BusinessTaskKey, value: TaskHoursValue) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TimeBreakdownStep({
  isBusiness,
  contentValues,
  onContentChange,
  businessValues,
  onBusinessChange,
  onBack,
  onNext,
}: TimeBreakdownStepProps) {
  const { dict } = useLocale();
  const { q3 } = dict.audit;

  const contentDone = CONTENT_TASK_KEYS.every((k) => contentValues[k] !== undefined);
  const businessDone = !isBusiness || BUSINESS_TASK_KEYS.every((k) => businessValues[k] !== undefined);

  return (
    <StepShell title={q3.title} subtitle={q3.subtitle}>
      <div className="flex flex-col gap-4">
        {CONTENT_TASK_KEYS.map((key) => (
          <TaskHoursRow
            key={key}
            label={q3.contentTaskLabels[key]}
            value={contentValues[key]}
            options={q3.hoursOptions}
            onChange={(v) => onContentChange(key, v)}
          />
        ))}
      </div>

      {isBusiness && (
        <div className="flex flex-col gap-4 pt-2">
          <h3 className="font-heading text-lg font-bold text-text-primary">
            {q3.businessSectionTitle}
          </h3>
          <div className="flex flex-col gap-4">
            {BUSINESS_TASK_KEYS.map((key) => (
              <TaskHoursRow
                key={key}
                label={q3.businessTaskLabels[key]}
                value={businessValues[key]}
                options={q3.hoursOptions}
                onChange={(v) => onBusinessChange(key, v)}
              />
            ))}
          </div>
        </div>
      )}

      <StepNavigation onBack={onBack} onNext={onNext} nextDisabled={!contentDone || !businessDone} />
    </StepShell>
  );
}
