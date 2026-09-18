import { TASK_HOURS_OPTIONS, type TaskHoursValue } from "@/lib/types";

interface TaskHoursRowProps {
  label: string;
  value?: TaskHoursValue;
  onChange: (value: TaskHoursValue) => void;
}

export function TaskHoursRow({ label, value, onChange }: TaskHoursRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-ink/10 pb-4 last:border-0 last:pb-0">
      <p className="font-bold text-ink text-sm">{label}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {TASK_HOURS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-medium transition ${
              value === opt.value
                ? "border-accent bg-accent text-white"
                : "border-ink/10 bg-white text-ink-soft hover:border-ink/25"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
