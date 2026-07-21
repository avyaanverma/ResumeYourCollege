import React from "react";
import { useController } from "react-hook-form";

/**
 * Production-grade Checkbox component integrated with React Hook Form.
 *
 * Used for:
 * - currentlyWorking toggle in Experience
 * - Any boolean field
 *
 * Design:
 * - Uses useController for controlled state
 * - Label acts as click target for better UX
 * - Accessible with proper aria attributes
 */
export const Checkbox = React.memo(function Checkbox({
  name,
  label,
  control,
  helperText = "",
  ...rest
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const hasError = !!error;

  return (
    <div className={`field field--checkbox${hasError ? " field--error" : ""}`}>
      <label className="field__checkbox-label">
        <input
          id={name}
          type="checkbox"
          {...field}
          checked={!!field.value}
          className="field__checkbox"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...rest}
        />
        <span className="field__checkbox-text">{label}</span>
      </label>
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

Checkbox.displayName = "Checkbox";
