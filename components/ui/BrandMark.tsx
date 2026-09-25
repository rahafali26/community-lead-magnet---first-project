/**
 * Small brand mark: radar rings (scanning/analysis) + a sweep hand (time) sweeping toward a
 * detected point rendered in the secondary green — literally "the radar finds the thing worth
 * your attention." Kept to a handful of primitives so it reads clearly at 28px next to the
 * wordmark.
 */
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" className="stroke-primary" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5.5" className="stroke-primary" strokeWidth="1.2" opacity="0.55" />
      <circle cx="12" cy="12" r="1.3" className="fill-primary" />
      <line x1="12" y1="12" x2="16.5" y2="6.8" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16.5" cy="6.8" r="1.7" className="fill-secondary" />
    </svg>
  );
}
