import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { TextArea } from "@/components/ui/TextArea";

interface OpenTextStepProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  required?: boolean;
}

export function OpenTextStep({
  title,
  subtitle,
  placeholder,
  value,
  onChange,
  onBack,
  onNext,
  required = false,
}: OpenTextStepProps) {
  return (
    <StepShell title={title} subtitle={subtitle}>
      <TextArea
        id="open-text-step"
        label=""
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={required && value.trim().length === 0}
      />
    </StepShell>
  );
}
