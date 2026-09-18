import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { CheckboxCard } from "@/components/ui/CheckboxCard";

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
}: MultiChoiceStepProps<V>) {
  function toggle(v: V) {
    if (values.includes(v)) {
      onChange(values.filter((x) => x !== v));
    } else {
      onChange([...values, v]);
    }
  }

  return (
    <StepShell title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <CheckboxCard
            key={opt.value}
            label={opt.label}
            checked={values.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={values.length < minSelected}
      />
    </StepShell>
  );
}
