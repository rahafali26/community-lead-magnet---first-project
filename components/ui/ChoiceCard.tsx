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
      className={`w-full text-start rounded-2xl border-2 px-5 py-4 transition ${
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-surface hover:border-primary/50"
      }`}
    >
      <span className="block font-bold text-text-primary">{label}</span>
      {description && (
        <span className="block mt-1 text-sm text-text-secondary">{description}</span>
      )}
    </button>
  );
}
