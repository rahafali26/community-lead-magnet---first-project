import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { CheckboxCard } from "@/components/ui/CheckboxCard";
import { TextField } from "@/components/ui/TextField";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface Option<V extends string> {
  value: V;
  label: string;
}

interface MultiChoiceStepProps<V extends string> {
  title: string;
  subtitle?: string;
  options: Option<V>[];
  values: V[];
  onChange: (values: V[]) => void;
  onBack: () => void;
  onNext: () => void;
  minSelected?: number;
  maxSelected?: number;
  maxHint?: string;
  otherValue?: V;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}

export function MultiChoiceStep<V extends string>({
  title,
  subtitle,
  options,
  values,
  onChange,
  onBack,
  onNext,
  minSelected = 1,
  maxSelected,
  maxHint,
  otherValue,
  otherText,
  onOtherTextChange,
}: MultiChoiceStepProps<V>) {
  const { dict } = useLocale();
  const atMax = maxSelected !== undefined && values.length >= maxSelected;

  function toggle(v: V) {
    if (values.includes(v)) {
      onChange(values.filter((x) => x !== v));
    } else {
      if (atMax) return;
      onChange([...values, v]);
    }
  }

  const showOtherField = otherValue !== undefined && values.includes(otherValue);

  return (
    <StepShell title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const checked = values.includes(opt.value);
          return (
            <CheckboxCard
              key={opt.value}
              label={opt.label}
              checked={checked}
              disabled={atMax}
              onClick={() => toggle(opt.value)}
            />
          );
        })}
        {showOtherField && (
          <TextField
            id="multi-choice-other"
            label=""
            placeholder={dict.common.otherPlaceholder}
            value={otherText ?? ""}
            onChange={(e) => onOtherTextChange?.(e.target.value)}
            autoFocus
          />
        )}
        {atMax && maxHint && <p className="text-xs text-text-secondary">{maxHint}</p>}
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={values.length < minSelected}
      />
    </StepShell>
  );
}
