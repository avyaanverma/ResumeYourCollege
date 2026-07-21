import { useFieldArray } from "react-hook-form";
import { emptyEntry } from "../constants/defaults";
import { ARRAY_FIELD_NAME } from "../validation";

/**
 * Custom hook wrapping useFieldArray for resume sections.
 *
 * Why this wrapper:
 * - Consistent field array name ("entries") across all sections
 * - Automatic empty entry creation per section type
 * - Single place to modify array behavior (prepend, swap, move)
 *
 * @param {Object} control - React Hook Form control object
 * @param {string} section - Section identifier
 * @returns {Object} FieldArray methods (fields, append, remove, etc.)
 */
export function useSectionFieldArray(control, section) {
  const { fields, append, remove, prepend, swap, move, update, replace } =
    useFieldArray({
      control,
      name: ARRAY_FIELD_NAME,
      keyName: "_id",
    });

  const appendEmpty = () => {
    const defaultEntry = emptyEntry[section];
    if (!defaultEntry) return;
    append(defaultEntry);
  };

  return {
    fields,
    append: appendEmpty,
    appendRaw: append,
    remove,
    prepend,
    swap,
    move,
    update,
    replace,
    isEmpty: fields.length === 0,
  };
}
