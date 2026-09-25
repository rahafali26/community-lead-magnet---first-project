import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, hint, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={`rounded-xl border-2 border-border px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:border-primary outline-none transition resize-none ${className}`}
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...props}
        />
        {hint && (
          <p id={`${id}-hint`} className="text-xs text-text-secondary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
