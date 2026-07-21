import React from "react";

/**
 * Displays a validation error message.
 * Used for cross-field validation errors (e.g., date range, currentlyWorking).
 *
 * These errors are attached to specific fields via schema.refine() path,
 * so they appear inline with the relevant input.
 *
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {string} [props.field] - Optional field identifier for aria-describedby
 */
export const FormError = React.memo(function FormError({ message, field }) {
  if (!message) return null;

  return (
    <span
      id={field ? `${field}-error` : undefined}
      className="field__error field__error--cross"
      role="alert"
    >
      {message}
    </span>
  );
});

FormError.displayName = "FormError";
