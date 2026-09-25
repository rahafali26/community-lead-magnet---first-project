import { useLocale } from "@/lib/i18n/LocaleProvider";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { dict } = useLocale();
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full rounded-full bg-surface-muted overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-text-secondary tabular-nums">
        {dict.common.stepOf(current, total)}
      </p>
    </div>
  );
}
