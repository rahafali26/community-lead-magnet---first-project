import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl bg-surface border border-border shadow-[0_2px_20px_rgba(36,31,46,0.05)] ${className}`}
      {...props}
    />
  );
}
