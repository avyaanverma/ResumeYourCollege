import React from "react";
import { useController } from "react-hook-form";

/**
 * Production-grade DatePicker component.
 * Uses <input type="date"> for native browser date picker.
 *
 * Why ISO format:
 * - Backend stores dates as ISO strings (YYYY-MM-DD)
 * - <input type="date"> natively uses YYYY-MM-DD format
 * - No conversion needed between form state and API payload
 * - Zod validates with ISO_DATE_REGEX / z.iso.date()
 * - Consistent across timezones
 * - Sortable as strings
 *
 * @param {Object} props
 * @param {string} props.name - Field name
 * @param {string} props.label - Display label
 * @param {Object} props.control - React Hook Form control
 */
export const DatePicker = React.memo(function DatePicker({
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
    <div className={`field${hasError ? " field--error" : ""}`}>
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
        </label>
      )}
      <input
        id={name}
        type="date"
        {...field}
        value={field.value ?? ""}
        className={`field__input field__date${hasError ? " field__input--error" : ""}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...rest}
      />
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

DatePicker.displayName = "DatePicker";
