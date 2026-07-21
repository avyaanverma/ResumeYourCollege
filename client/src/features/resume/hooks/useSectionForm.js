import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";
import {
  sectionSchemas,
  isArraySection,
  ARRAY_FIELD_NAME,
} from "../validation";
import { sectionDefaults } from "../constants/defaults";

/**
 * Custom hook that creates a React Hook Form instance configured with:
 * - Dynamic Zod schema loading based on section type
 * - zodResolver for validation
 * - Proper default values
 * - Performance-optimized validation mode
 *
 * @param {string} section - The resume section identifier (e.g., "education", "experience")
 * @param {Array|Object|null} initialData - Pre-existing data from the server
 * @returns {Object} React Hook Form methods + helpers
 *
 * Why this approach:
 * - Single source of validation: schema is loaded dynamically from sectionSchemas map
 * - No manual "required: true" in register() calls
 * - Validation errors are automatically mapped to form fields
 * - Easy to add new sections: just add schema + defaults
 */
export function useSectionForm(section, initialData = null) {
  const sectionSchema = sectionSchemas[section];
  const isArray = isArraySection[section];
  // React Hook Form stores repeatable section values at `entries`, while the
  // section schemas validate the array itself. Wrap it so error paths become
  // `errors.entries[index].field`, which each input can display inline.
  const schema =
    isArray && sectionSchema
      ? z.object({ [ARRAY_FIELD_NAME]: sectionSchema })
      : sectionSchema;

  const getDefaultValues = useCallback(() => {
    if (!isArray) {
      // Non-array sections (personal, summary)
      if (section === "personal") {
        return { ...sectionDefaults.personal, summary: "" };
      }
      if (section === "summary") {
        return { summary: "" };
      }
    }

    // Array sections - use entries field for FieldArray
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
      if (section === "achievements") {
        return { [ARRAY_FIELD_NAME]: initialData.map((v) => ({ value: v })) };
      }
      return { [ARRAY_FIELD_NAME]: initialData };
    }

    return { [ARRAY_FIELD_NAME]: [] };
  }, [isArray, section, initialData]);

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: getDefaultValues(),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  return {
    ...form,
    isArraySection: isArray,
    schema,
  };
}
