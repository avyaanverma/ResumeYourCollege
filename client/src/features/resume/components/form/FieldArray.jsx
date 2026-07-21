import React from "react";
import { useSectionFieldArray } from "../../hooks/useSectionFieldArray";
import { sectionDefaults } from "../../constants/defaults";
import { ARRAY_FIELD_NAME } from "../../validation";

/**
 * Generic FieldArray wrapper for array-based resume sections.
 *
 * Provides:
 * - "Add Entry" button with default values
 * - "Remove Entry" button per entry
 * - Entry count display
 * - Empty state handling
 *
 * Usage:
 * <FieldArray control={control} section="education">
 *   {(fields, { remove }) => fields.map((field, index) => (
 *     <EntryRenderer key={field._id} section="education" index={index} control={control} />
 *   ))}
 * </FieldArray>
 *
 * @param {Object} props
 * @param {Object} props.control - React Hook Form control
 * @param {string} props.section - Section identifier
 * @param {Function} props.children - Render prop: (fields, { append, remove }) => JSX
 * @param {string} props.singularLabel - Singular label for "Add" button
 */
export function FieldArray({ control, section, children, singularLabel }) {
  const { fields, append, remove, isEmpty } = useSectionFieldArray(
    control,
    section,
  );

  const label = singularLabel || section.slice(0, -1);
  const defaultEntry = sectionDefaults[section];

  const handleAppend = () => {
    if (section === "achievements") {
      append(); // achievements use emptyEntry which is { value: "" }
    } else {
      append();
    }
  };

  return (
    <div className="field-array">
      {isEmpty && (
        <p className="field-array__empty">
          No entries yet. Click "Add {label}" to get started.
        </p>
      )}

      {children(fields, { remove })}

      <button
        type="button"
        className="secondary-button field-array__add"
        onClick={handleAppend}
      >
        + Add {label}
      </button>
    </div>
  );
}
