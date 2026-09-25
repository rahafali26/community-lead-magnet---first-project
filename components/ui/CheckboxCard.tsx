import { Check } from "lucide-react";

interface CheckboxCardProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function CheckboxCard({ label, checked, disabled, onClick }: CheckboxCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled && !checked}
      onClick={onClick}
      className={`w-full text-start rounded-2xl border-2 px-5 py-3 transition flex items-center gap-3 ${
        checked
          ? "border-primary bg-primary-soft"
          : "border-border bg-surface hover:border-primary/50 disabled:opacity-40 disabled:hover:border-border"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked ? "border-primary bg-primary" : "border-border bg-surface"
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="font-medium text-text-primary">{label}</span>
    </button>
  );
}
