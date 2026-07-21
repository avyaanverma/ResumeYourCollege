import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { updateResumeSection } from "../../resumeApi";
import { setCurrentResume } from "../../resumeSlice";
import { useSectionForm } from "../../hooks/useSectionForm";
import { Input, Textarea } from "../form";
import { nextSection } from "../../validation";

/**
 * ProfileSection - Dedicated form for the Profile (personal + summary) section.
 *
 * This is NOT array-based, so it uses a different form structure than ArraySectionRenderer.
 * It still leverages the same Zod schema, zodResolver, and reusable form components.
 *
 * Why a separate component:
 * - Profile is a single-object section (not an array)
 * - It combines personal + summary into one form
 * - Different layout and UX from array sections
 * - Still benefits from shared validation schemas and components
 */
export function ProfileSection() {
  const current = useSelector((state) => state.resume.current);
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useSectionForm("personal");

  // Reset form when server data loads
  useEffect(() => {
    if (!current) return;

    reset({
      fullName: current.personal?.fullName || "",
      email: current.personal?.email || "",
      phone: current.personal?.phone || "",
      location: current.personal?.location || "",
      linkedin: current.personal?.linkedin || "",
      github: current.personal?.github || "",
      portfolio: current.personal?.portfolio || "",
      summary: current.summary || "",
    });
  }, [current, reset]);

  // Handle form submission
  const onSubmit = useCallback(
    async (values) => {
      try {
        // Update personal section
        let resume = await updateResumeSection(resumeId, "personal", {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone || "",
          location: values.location || "",
          linkedin: values.linkedin || "",
          github: values.github || "",
          portfolio: values.portfolio || "",
        });

        // Update summary section
        resume = await updateResumeSection(
          resumeId,
          "summary",
          values.summary || "",
        );

        dispatch(setCurrentResume(resume));
        toast.success("Profile saved successfully");

        const next = nextSection.personal;
        if (next) {
          navigate(`/resume/${resumeId}/${next}`);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          "Could not save profile. Please try again.";
        toast.error(message);
      }
    },
    [resumeId, dispatch, navigate],
  );

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section className="form-page">
      <h1>Profile</h1>
      <p>This information appears at the top of your resume.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <Input
            name="fullName"
            label="Full Name"
            control={control}
            placeholder="e.g., John Doe"
          />

          <Input
            name="email"
            label="Email"
            type="email"
            control={control}
            placeholder="e.g., john.doe@example.com"
          />

          <Input
            name="phone"
            label="Phone"
            type="tel"
            control={control}
            placeholder="e.g., +1 234 567 8900"
          />

          <Input
            name="location"
            label="Location"
            control={control}
            placeholder="e.g., San Francisco, CA"
          />

          <Input
            name="linkedin"
            label="LinkedIn URL"
            type="url"
            control={control}
            placeholder="https://linkedin.com/in/username"
          />

          <Input
            name="github"
            label="GitHub URL"
            type="url"
            control={control}
            placeholder="https://github.com/username"
          />

          <Input
            name="portfolio"
            label="Portfolio URL"
            type="url"
            control={control}
            placeholder="https://yourportfolio.com"
          />

          <div className="full">
            <Textarea
              name="summary"
              label="Professional Summary"
              control={control}
              placeholder="Brief overview of your professional background and career goals..."
              maxLength={1000}
              rows={4}
            />
          </div>
        </div>

        {hasErrors && (
          <p className="form-error-summary" role="alert">
            Please fix the errors above before saving.
          </p>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </form>
    </section>
  );
}
