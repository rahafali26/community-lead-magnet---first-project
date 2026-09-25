import type { TaskHoursValue } from "@/lib/types";

interface TaskHoursRowProps {
  label: string;
  value?: TaskHoursValue;
  options: { value: number; label: string }[];
  onChange: (value: TaskHoursValue) => void;
}

export function TaskHoursRow({ label, value, options, onChange }: TaskHoursRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-4 last:border-0 last:pb-0">
      <p className="font-bold text-text-primary text-sm">{label}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value as TaskHoursValue)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-medium transition ${
              value === opt.value
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text-secondary hover:border-primary/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
