import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { ChoiceCard } from "@/components/ui/ChoiceCard";

interface Option<V extends string> {
  value: V;
  label: string;
  description?: string;
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
}: SingleChoiceStepProps<V>) {
  return (
    <StepShell title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-3" role="radiogroup" aria-label={title}>
        {options.map((opt) => (
          <ChoiceCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
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
