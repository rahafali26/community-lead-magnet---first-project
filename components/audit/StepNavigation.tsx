import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

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
  nextLabel,
  nextDisabled,
  showBack = true,
}: StepNavigationProps) {
  const { dict, locale } = useLocale();
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;
  const NextIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      {showBack && onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <BackIcon className="h-4 w-4" />
          {dict.common.back}
        </Button>
      ) : (
        <span />
      )}
      <Button type="button" onClick={onNext} disabled={nextDisabled}>
        {nextLabel ?? dict.common.next}
        <NextIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
