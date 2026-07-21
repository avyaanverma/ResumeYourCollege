import React from "react";
import { useController } from "react-hook-form";

/**
 * BulletEditor component for string[] fields like description.
 *
 * Used for:
 * - experience.description
 * - projects.description
 *
 * Architecture Decision: Option B (Custom Bullet Editor)
 *
 * Tradeoffs between Option A (textarea string → convert on submit) vs Option B (bullet editor):
 *
 * Option A - Textarea with conversion:
 * + Simple to implement
 * + Familiar UI
 * - Requires string→array conversion on submit
 * - No per-bullet validation
 * - Hard to remove individual bullets
 * - Must parse line breaks, which can be fragile
 *
 * Option B - Bullet Editor (selected):
 * + Data is already string[] in form state → no conversion needed
 * + Each bullet has its own input for clean editing
 * + Easy add/remove individual bullets
 * + Can validate each bullet independently
 * + Better UX with bullet markers (•)
 * + Backend already expects string[]
 * - Slightly more complex component
 * - More DOM nodes (but React.memo handles this)
 *
 * For a production app, Option B is the clear winner because:
 * - It eliminates an entire class of data transformation bugs
 * - Better aligns with the backend data model
 * - Provides superior UX
 */
export const BulletEditor = React.memo(function BulletEditor({
  name,
  label,
  control,
  placeholder = "Enter a bullet point",
  maxBullets = 15,
  helperText = "",
}) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const hasError = !!error;
  const bullets = Array.isArray(field.value) ? field.value : [];

  const addBullet = () => {
    if (bullets.length >= maxBullets) return;
    field.onChange([...bullets, ""]);
  };

  const removeBullet = (index) => {
    field.onChange(bullets.filter((_, i) => i !== index));
  };

  const updateBullet = (index, value) => {
    const next = [...bullets];
    next[index] = value;
    field.onChange(next);
  };

  const handleBulletKeyDown = (index, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // If current bullet has content, add new bullet below
      if (bullets[index]?.trim()) {
        addBullet();
      }
    }
    if (e.key === "Backspace" && !bullets[index] && bullets.length > 1) {
      removeBullet(index);
    }
  };

  return (
    <div className={`field bullet-editor${hasError ? " field--error" : ""}`}>
      {label && <label className="field__label">{label}</label>}
      <div className="bullet-editor__list">
        {bullets.map((bullet, index) => (
          <div key={index} className="bullet-editor__row">
            <span className="bullet-editor__marker" aria-hidden="true">
              •
            </span>
            <input
              className={`bullet-editor__input${hasError && !bullet.trim() ? " bullet-editor__input--error" : ""}`}
              value={bullet}
              onChange={(e) => updateBullet(index, e.target.value)}
              onKeyDown={(e) => handleBulletKeyDown(index, e)}
              placeholder={placeholder}
              aria-label={`${label} bullet point ${index + 1}`}
            />
            <button
              type="button"
              className="bullet-editor__remove"
              onClick={() => removeBullet(index)}
              aria-label={`Remove bullet point ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {bullets.length < maxBullets && (
        <button
          type="button"
          className="bullet-editor__add"
          onClick={addBullet}
        >
          + Add bullet point
        </button>
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

BulletEditor.displayName = "BulletEditor";
