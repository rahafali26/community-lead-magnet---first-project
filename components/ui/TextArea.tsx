import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, hint, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-bold text-ink">
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={`rounded-xl border-2 border-ink/10 px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-accent outline-none transition resize-none ${className}`}
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...props}
        />
        {hint && (
          <p id={`${id}-hint`} className="text-xs text-ink-soft">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
