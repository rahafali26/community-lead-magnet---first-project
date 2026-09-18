interface CheckboxCardProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

export function CheckboxCard({ label, checked, onClick }: CheckboxCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={`w-full text-right rounded-2xl border-2 px-5 py-3 transition flex items-center gap-3 ${
        checked
          ? "border-accent bg-accent-soft"
          : "border-ink/10 bg-white hover:border-ink/25"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked ? "border-accent bg-accent" : "border-ink/25 bg-white"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
            <path
              d="M2 6l2.5 2.5L10 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="font-medium text-ink">{label}</span>
    </button>
  );
}
