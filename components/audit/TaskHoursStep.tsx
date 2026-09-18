import { StepShell } from "./StepShell";
import { StepNavigation } from "./StepNavigation";
import { TaskHoursRow } from "./TaskHoursRow";
import type { TaskHoursValue } from "@/lib/types";

interface TaskHoursStepProps<K extends string> {
  title: string;
  subtitle?: string;
  tasks: { key: K; label: string }[];
  values: Partial<Record<K, TaskHoursValue>>;
  onChange: (key: K, value: TaskHoursValue) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TaskHoursStep<K extends string>({
  title,
  subtitle,
  tasks,
  values,
  onChange,
  onBack,
  onNext,
}: TaskHoursStepProps<K>) {
  const allAnswered = tasks.every((t) => values[t.key] !== undefined);

  return (
    <StepShell title={title} subtitle={subtitle}>
      <div className="flex flex-col gap-4">
        {tasks.map((t) => (
          <TaskHoursRow
            key={t.key}
            label={t.label}
            value={values[t.key]}
            onChange={(v) => onChange(t.key, v)}
          />
        ))}
      </div>
      <StepNavigation onBack={onBack} onNext={onNext} nextDisabled={!allAnswered} />
    </StepShell>
  );
}
