import React from "react";
import {
  Input,
  Textarea,
  DatePicker,
  Checkbox,
  TagInput,
  BulletEditor,
  FormError,
} from "../form";
import { PROFICIENCY_OPTIONS } from "../../constants/proficiency";

/**
 * EntryRenderer dynamically renders the correct form fields
 * based on the section type.
 *
 * SOLID Principles applied:
 * - Single Responsibility: Each section type maps to a specific set of fields
 * - Open/Closed: Adding a new section means adding a new case, not modifying existing code
 * - Liskov Substitution: All renderers receive the same props interface
 * - Interface Segregation: Each renderer only receives the props it needs
 * - Dependency Inversion: Depends on abstract form components, not concrete implementations
 *
 * @param {Object} props
 * @param {string} props.section - Section identifier
 * @param {number} props.index - Index in the field array
 * @param {Object} props.control - React Hook Form control
 * @param {Object} props.errors - Form errors object
 */
const EntryRenderer = React.memo(function EntryRenderer({
  section,
  index,
  control,
  errors,
}) {
  const base = `entries.${index}`;
  const entryErrors = errors?.entries?.[index];

  switch (section) {
    case "education":
      return (
        <EducationFields
          base={base}
          control={control}
          entryErrors={entryErrors}
        />
      );

    case "experience":
      return (
        <ExperienceFields
          base={base}
          control={control}
          entryErrors={entryErrors}
        />
      );

    case "projects":
      return (
        <ProjectFields
          base={base}
          control={control}
          entryErrors={entryErrors}
        />
      );

    case "skills":
      return (
        <SkillFields base={base} control={control} entryErrors={entryErrors} />
      );

    case "certifications":
      return (
        <CertificationFields
          base={base}
          control={control}
          entryErrors={entryErrors}
        />
      );

    case "languages":
      return (
        <LanguageFields
          base={base}
          control={control}
          entryErrors={entryErrors}
        />
      );

    case "achievements":
      return (
        <AchievementFields
          base={base}
          control={control}
          entryErrors={entryErrors}
        />
      );

    default:
      return <p className="form-error">Unknown section type: {section}</p>;
  }
});

/* ------------------------------------------------------------------ */
/*  Education Fields                                                   */
/* ------------------------------------------------------------------ */
function EducationFields({ base, control, entryErrors }) {
  return (
    <div className="form-grid">
      <Input
        name={`${base}.institution`}
        label="Institution"
        control={control}
      />
      <Input name={`${base}.degree`} label="Degree" control={control} />
      <Input
        name={`${base}.fieldOfStudy`}
        label="Field of Study"
        control={control}
      />
      <DatePicker
        name={`${base}.startDate`}
        label="Start Date"
        control={control}
      />
      <DatePicker
        name={`${base}.endDate`}
        label="End Date"
        control={control}
        helperText={
          entryErrors?.endDate ? "" : "End date must be after start date"
        }
      />
      <Input
        name={`${base}.cgpa`}
        label="CGPA"
        type="number"
        step="0.1"
        min="0"
        max="10"
        control={control}
        helperText="Enter a value between 0 and 10"
      />
      <Textarea
        name={`${base}.description`}
        label="Description"
        control={control}
        maxLength={500}
        rows={3}
      />
      {entryErrors?.endDate?.type === "refine" && (
        <FormError
          message={entryErrors.endDate.message}
          field={`${base}.endDate`}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Experience Fields                                                  */
/* ------------------------------------------------------------------ */
function ExperienceFields({ base, control, entryErrors }) {
  return (
    <div className="form-grid">
      <Input name={`${base}.company`} label="Company" control={control} />
      <Input name={`${base}.position`} label="Position" control={control} />
      <Input
        name={`${base}.location`}
        label="Location"
        control={control}
        placeholder="e.g., San Francisco, CA"
      />
      <DatePicker
        name={`${base}.startDate`}
        label="Start Date"
        control={control}
      />
      <DatePicker
        name={`${base}.endDate`}
        label="End Date"
        control={control}
        helperText={
          entryErrors?.endDate ? "" : "Leave empty if currently working here"
        }
      />
      <Checkbox
        name={`${base}.currentlyWorking`}
        label="I currently work here"
        control={control}
      />
      <div className="full">
        <BulletEditor
          name={`${base}.description`}
          label="Description (bullet points)"
          control={control}
          placeholder="e.g., Led a team of 5 engineers to deliver..."
        />
      </div>
      {entryErrors?.endDate?.type === "refine" && (
        <FormError
          message={entryErrors.endDate.message}
          field={`${base}.endDate`}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Fields                                                     */
/* ------------------------------------------------------------------ */
function ProjectFields({ base, control, entryErrors }) {
  return (
    <div className="form-grid">
      <Input name={`${base}.title`} label="Project Title" control={control} />
      <div className="full">
        <TagInput
          name={`${base}.techStack`}
          label="Tech Stack"
          control={control}
          placeholder="Type technology and press Enter"
          helperText="Add at least one technology. Duplicates are automatically removed."
        />
      </div>
      <Input
        name={`${base}.github`}
        label="GitHub URL"
        type="url"
        control={control}
        placeholder="https://github.com/username/repo"
      />
      <Input
        name={`${base}.live`}
        label="Live URL"
        type="url"
        control={control}
        placeholder="https://yourproject.com"
      />
      <div className="full">
        <BulletEditor
          name={`${base}.description`}
          label="Description (bullet points)"
          control={control}
          placeholder="e.g., Built with React, Node.js, and PostgreSQL..."
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill Fields                                                       */
/* ------------------------------------------------------------------ */
function SkillFields({ base, control, entryErrors }) {
  return (
    <div className="form-grid">
      <Input
        name={`${base}.category`}
        label="Category"
        control={control}
        placeholder="e.g., Frontend, Backend, Tools"
      />
      <div className="full">
        <TagInput
          name={`${base}.items`}
          label="Skills"
          control={control}
          placeholder="Type skill and press Enter"
          helperText="Add at least one skill. Duplicates are automatically removed."
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Certification Fields                                               */
/* ------------------------------------------------------------------ */
function CertificationFields({ base, control, entryErrors }) {
  return (
    <div className="form-grid">
      <Input
        name={`${base}.title`}
        label="Certification Title"
        control={control}
      />
      <Input
        name={`${base}.issuer`}
        label="Issuing Organization"
        control={control}
      />
      <DatePicker
        name={`${base}.issueDate`}
        label="Issue Date"
        control={control}
      />
      <Input
        name={`${base}.credentialUrl`}
        label="Credential URL"
        type="url"
        control={control}
        placeholder="https://certificate.example.com/..."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Language Fields                                                    */
/* ------------------------------------------------------------------ */
function LanguageFields({ base, control, entryErrors }) {
  return (
    <div className="form-grid">
      <Input
        name={`${base}.language`}
        label="Language"
        control={control}
        placeholder="e.g., English, Spanish, Mandarin"
      />
      <div className="field">
        <label className="field__label">Proficiency</label>
        <select
          {...control.register(`${base}.proficiency`)}
          className="field__input"
        >
          <option value="">Select proficiency...</option>
          {PROFICIENCY_OPTIONS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Achievement Fields                                                 */
/* ------------------------------------------------------------------ */
function AchievementFields({ base, control, entryErrors }) {
  return (
    <Input
      name={`${base}.value`}
      label="Achievement"
      control={control}
      placeholder="e.g., Awarded 'Best Intern' for outstanding performance"
    />
  );
}

EntryRenderer.displayName = "EntryRenderer";
export { EntryRenderer };
