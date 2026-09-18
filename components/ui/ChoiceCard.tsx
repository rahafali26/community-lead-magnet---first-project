interface ChoiceCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function ChoiceCard({ label, description, selected, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`w-full text-right rounded-2xl border-2 px-5 py-4 transition ${
        selected
          ? "border-accent bg-accent-soft"
          : "border-ink/10 bg-white hover:border-ink/25"
      }`}
    >
      <span className="block font-bold text-ink">{label}</span>
      {description && (
        <span className="block mt-1 text-sm text-ink-soft">{description}</span>
      )}
    </button>
  );
}
