import React, { useState } from "react";
import { useController } from "react-hook-form";

/**
 * TagInput component for comma-separated array fields.
 *
 * Used for:
 * - skills.items
 * - projects.techStack
 *
 * Features:
 * - Type and press Enter/Space/Comma to add tags
 * - Click × to remove tags
 * - Auto-deduplicate (case-insensitive)
 * - Visual tag chips with remove button
 * - Keyboard accessible
 *
 * Why this over comma-separated string:
 * - Better UX: visual tags are clearer than comma-separated text
 * - Easy to remove individual items
 * - No parsing on submit (already array)
 * - Backend expects string[] for items and techStack
 */
export const TagInput = React.memo(function TagInput({
  name,
  label,
  control,
  placeholder = "Type and press Enter to add",
  duplicateFilter = true,
  helperText = "",
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [inputValue, setInputValue] = useState("");
  const hasError = !!error;
  const tags = Array.isArray(field.value) ? field.value : [];

  const normalize = (val) => val.toLowerCase().trim();

  const addTag = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Auto-deduplicate if enabled
    if (
      duplicateFilter &&
      tags.some((t) => normalize(t) === normalize(trimmed))
    ) {
      setInputValue("");
      return;
    }

    field.onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (index) => {
    field.onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={`field tag-input${hasError ? " field--error" : ""}`}>
      {label && <label className="field__label">{label}</label>}
      <div className="tag-input__container">
        <div className="tag-input__tags">
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="tag-input__tag">
              <span className="tag-input__tag-text">{tag}</span>
              <button
                type="button"
                className="tag-input__tag-remove"
                onClick={() => removeTag(index)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="tag-input__input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue.trim() && addTag(inputValue)}
            placeholder={tags.length === 0 ? placeholder : ""}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        </div>
      </div>
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

TagInput.displayName = "TagInput";
