import React from "react";
import { useController } from "react-hook-form";

/**
 * Production-grade Input component integrated with React Hook Form.
 *
 * Features:
 * - Uses useController instead of register for better control
 * - React.memo to prevent unnecessary re-renders
 * - Accessible with aria-invalid and aria-describedby
 * - Helper text that hides when error is present
 * - User-friendly error message display
 * - Supports all HTML input types (text, email, number, url, tel)
 *
 * @param {Object} props
 * @param {string} props.name - Field name (e.g., "entries.0.institution")
 * @param {string} props.label - Display label
 * @param {Object} props.control - React Hook Form control
 * @param {string} props.type - Input type (default: "text")
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.helperText - Helpful hint shown when no error
 * @param {Object} props.rest - Additional input attributes
 */
export const Input = React.memo(function Input({
  name,
  label,
  control,
  type = "text",
  placeholder = "",
  helperText = "",
  ...rest
}) {
  const {
    field,
    fieldState: { error, invalid },
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
        type={type}
        placeholder={placeholder}
        {...field}
        value={field.value ?? ""}
        className={`field__input${hasError ? " field__input--error" : ""}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        autoComplete={
          type === "email" ? "email" : type === "tel" ? "tel" : "off"
        }
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

Input.displayName = "Input";
