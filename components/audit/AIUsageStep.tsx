import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { CheckboxCard } from "@/components/ui/CheckboxCard";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { AIUsageArea, AIUsageLevel } from "@/lib/types";

interface AIUsageStepProps {
  level?: AIUsageLevel;
  areas: AIUsageArea[];
  otherText: string;
  onLevelChange: (level: AIUsageLevel) => void;
  onAreasChange: (areas: AIUsageArea[]) => void;
  onOtherTextChange: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const LEVELS: AIUsageLevel[] = ["none", "sometimes", "regularly", "core"];
const AREAS: AIUsageArea[] = [
  "research_ideas",
  "planning",
  "writing",
  "design",
  "editing",
  "analytics",
  "client_communication",
  "automation",
  "other",
];

export function AIUsageStep({
  level,
  areas,
  otherText,
  onLevelChange,
  onAreasChange,
  onOtherTextChange,
  onBack,
  onNext,
}: AIUsageStepProps) {
  const { dict } = useLocale();
  const { q6 } = dict.audit;

  function toggleArea(area: AIUsageArea) {
    onAreasChange(areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area]);
  }

  const canProceed = level !== undefined && areas.length > 0;

  return (
    <StepShell title={q6.title}>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={q6.title}>
        {LEVELS.map((l) => (
          <ChoiceCard
            key={l}
            label={q6.levelOptions[l]}
            selected={level === l}
            onClick={() => onLevelChange(l)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <h3 className="font-heading text-lg font-bold text-text-primary">{q6.areasTitle}</h3>
        {AREAS.map((area) => (
          <CheckboxCard
            key={area}
            label={q6.areaOptions[area]}
            checked={areas.includes(area)}
            onClick={() => toggleArea(area)}
          />
        ))}
        {areas.includes("other") && (
          <TextField
            id="ai-usage-other"
            label=""
            placeholder={dict.common.otherPlaceholder}
            value={otherText}
            onChange={(e) => onOtherTextChange(e.target.value)}
            autoFocus
          />
        )}
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </StepShell>
  );
}
