import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { updateResumeSection } from "../../resumeApi";
import { setCurrentResume } from "../../resumeSlice";
import { useSectionForm } from "../../hooks/useSectionForm";
import { useSectionFieldArray } from "../../hooks/useSectionFieldArray";
import { EntryRenderer } from "./EntryRenderer";
import { sectionLabels, nextSection, ARRAY_FIELD_NAME } from "../../validation";

/**
 * ArraySectionRenderer - Generic renderer for all array-based resume sections.
 *
 * Handles:
 * - Dynamic Zod schema loading via useSectionForm
 * - Field array management via useSectionFieldArray
 * - Reset from server data
 * - Submit with API call and navigation
 *
 * SOLID Principles:
 * - Open/Closed: Add new sections by adding to sectionSchemas + EntryRenderer cases
 * - Single Responsibility: Only manages array sections
 * - Dependency Inversion: Depends on abstract hooks and components
 *
 * @param {string} section - The resume section to render
 */
export function ArraySectionRenderer({ section }) {
  const current = useSelector((state) => state.resume.current);
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sectionData = current?.[section] || [];

  // Initialize form with dynamic schema
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useSectionForm(section, sectionData);

  // Initialize field array
  const { fields, append, remove } = useSectionFieldArray(control, section);

  // Reset form when server data loads
  useEffect(() => {
    if (!current) return;

    let data;
    if (section === "achievements") {
      data = (current.achievements || []).map((v) => ({ value: v }));
    } else {
      data = current[section] || [];
    }

    reset({ [ARRAY_FIELD_NAME]: data });
  }, [current, section, reset]);

  // Handle form submission
  const onSubmit = useCallback(
    async (values) => {
      try {
        let data;
        if (section === "achievements") {
          data = (values.entries || [])
            .map((e) => e.value)
            .filter((v) => v && v.trim());
        } else {
          data = values.entries || [];
        }

        const resume = await updateResumeSection(resumeId, section, data);
        dispatch(setCurrentResume(resume));
        toast.success(`${sectionLabels[section]} saved successfully`);

        const next = nextSection[section];
        if (next) {
          navigate(`../${next}`);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          `Could not save ${sectionLabels[section]}. Please try again.`;
        toast.error(message);
      }
    },
    [resumeId, section, dispatch, navigate],
  );

  const label = sectionLabels[section] || section;
  const singularLabel = label.toLowerCase() || "entry";
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section className="form-page">
      <h1>{label}</h1>
      <p>
        Add as many entries as you need. Changes are saved when you continue.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {fields.length === 0 && (
          <div className="empty-state">
            <p>No {label.toLowerCase()} added yet.</p>
          </div>
        )}

        {fields.map((field, index) => (
          <fieldset className="entry-card" key={field._id || field.id}>
            <div className="entry-card__header">
              <span className="entry-card__title">
                {label.slice(0, -1)} #{index + 1}
              </span>
              <button
                type="button"
                className="remove entry-card__remove"
                onClick={() => remove(index)}
                aria-label={`Remove ${singularLabel} #${index + 1}`}
              >
                Remove
              </button>
            </div>

            <EntryRenderer
              section={section}
              index={index}
              control={control}
              errors={errors}
            />
          </fieldset>
        ))}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => append()}
          >
            + Add {singularLabel}
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </div>

        {hasErrors && (
          <p className="form-error-summary" role="alert">
            Please fix the errors above before saving.
          </p>
        )}
      </form>
    </section>
  );
}
