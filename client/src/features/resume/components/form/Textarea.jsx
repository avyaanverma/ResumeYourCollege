import React from "react";
import { useController } from "react-hook-form";

/**
 * Production-grade Textarea component integrated with React Hook Form.
 *
 * Features:
 * - React.memo for performance
 * - Helper/error text display
 * - Character count (optional via maxLength)
 * - Accessible
 */
export const Textarea = React.memo(function Textarea({
  name,
  label,
  control,
  placeholder = "",
  helperText = "",
  maxLength,
  rows = 4,
  ...rest
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const hasError = !!error;
  const charCount = (field.value || "").length;

  return (
    <div className={`field${hasError ? " field--error" : ""}`}>
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
        </label>
      )}
      <textarea
        id={name}
        placeholder={placeholder}
        {...field}
        value={field.value ?? ""}
        className={`field__textarea${hasError ? " field__textarea--error" : ""}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        rows={rows}
        maxLength={maxLength}
        {...rest}
      />
      {maxLength && !hasError && (
        <span className="field__charcount">
          {charCount}/{maxLength}
        </span>
      )}
      {helperText && !hasError && (
        <span className="field__helper">{helperText}</span>
      )}
      {hasError && (
        <span id={`${name}-error`} className="field__error" role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";
