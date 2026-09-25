import { type InputHTMLAttributes, forwardRef } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-bold text-text-primary">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`rounded-xl border-2 px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:border-primary outline-none transition ${
            error ? "border-error" : "border-border"
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-text-secondary">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
