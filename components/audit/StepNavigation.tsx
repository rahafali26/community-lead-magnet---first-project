import { Button } from "@/components/ui/Button";

interface StepNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
}

export function StepNavigation({
  onBack,
  onNext,
  nextLabel = "التالي",
  nextDisabled,
  showBack = true,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      {showBack && onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          رجوع
        </Button>
      ) : (
        <span />
      )}
      <Button type="button" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );
}
