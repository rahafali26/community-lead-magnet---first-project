import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { CheckboxCard } from "@/components/ui/CheckboxCard";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { ContentVolume, Platform } from "@/lib/types";

interface ContentVolumeStepProps {
  volume?: ContentVolume;
  platforms: Platform[];
  otherText: string;
  onVolumeChange: (v: ContentVolume) => void;
  onPlatformsChange: (platforms: Platform[]) => void;
  onOtherTextChange: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const VOLUMES: ContentVolume[] = ["1-4", "5-8", "9-15", "16-30", "30+"];
const PLATFORMS: Platform[] = ["instagram", "tiktok", "youtube", "linkedin", "x", "other"];

export function ContentVolumeStep({
  volume,
  platforms,
  otherText,
  onVolumeChange,
  onPlatformsChange,
  onOtherTextChange,
  onBack,
  onNext,
}: ContentVolumeStepProps) {
  const { dict } = useLocale();
  const { q2 } = dict.audit;

  function togglePlatform(p: Platform) {
    onPlatformsChange(
      platforms.includes(p) ? platforms.filter((x) => x !== p) : [...platforms, p]
    );
  }

  const canProceed = volume !== undefined && platforms.length > 0;

  return (
    <StepShell title={q2.title}>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={q2.title}>
        {VOLUMES.map((v) => (
          <ChoiceCard
            key={v}
            label={q2.volumeOptions[v]}
            selected={volume === v}
            onClick={() => onVolumeChange(v)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <h3 className="font-heading text-lg font-bold text-text-primary">{q2.platformLabel}</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PLATFORMS.map((p) => (
            <CheckboxCard
              key={p}
              label={q2.platformOptions[p]}
              checked={platforms.includes(p)}
              onClick={() => togglePlatform(p)}
            />
          ))}
        </div>
        {platforms.includes("other") && (
          <TextField
            id="content-volume-other"
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
