import type { ReactNode } from "react";

interface StepShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StepShell({ title, subtitle, children }: StepShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-text-primary">{title}</h2>
        {subtitle && <p className="mt-2 text-text-secondary">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
