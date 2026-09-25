import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface Option<V extends string> {
  value: V;
  label: string;
}

interface SingleChoiceStepProps<V extends string> {
  title: string;
  subtitle?: string;
  options: Option<V>[];
  value?: V;
  onChange: (value: V) => void;
  onBack?: () => void;
  onNext: () => void;
  showBack?: boolean;
  /** When set, selecting the option with this value reveals an inline text field. */
  otherValue?: V;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}

export function SingleChoiceStep<V extends string>({
  title,
  subtitle,
  options,
  value,
  onChange,
  onBack,
  onNext,
  showBack = true,
  otherValue,
  otherText,
  onOtherTextChange,
}: SingleChoiceStepProps<V>) {
  const { dict } = useLocale();
  const showOtherField = otherValue !== undefined && value === otherValue;

  return (
    <StepShell title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={title}>
        {options.map((opt) => (
          <ChoiceCard
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
        {showOtherField && (
          <TextField
            id="single-choice-other"
            label=""
            placeholder={dict.common.otherPlaceholder}
            value={otherText ?? ""}
            onChange={(e) => onOtherTextChange?.(e.target.value)}
            autoFocus
          />
        )}
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={value === undefined}
        showBack={showBack}
      />
    </StepShell>
  );
}
