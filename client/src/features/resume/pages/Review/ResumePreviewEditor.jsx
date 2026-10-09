import { sectionSchemas } from "../../validation";

const sections = [
  {
    id: "personal",
    title: "Contact details",
    fields: [
      ["fullName", "Full name"],
      ["email", "Email", "email"],
      ["phone", "Phone"],
      ["location", "Location"],
      ["linkedin", "LinkedIn URL", "url"],
      ["github", "GitHub URL", "url"],
      ["portfolio", "Portfolio URL", "url"],
    ],
  },
  { id: "summary", title: "Professional summary", scalar: true },
  {
    id: "education",
    title: "Education",
    fields: [
      ["institution", "Institution"],
      ["degree", "Degree"],
      ["fieldOfStudy", "Field of study"],
      ["startDate", "Start date", "date"],
      ["endDate", "End date", "date"],
      ["cgpa", "GPA / grade"],
      ["description", "Description", "textarea"],
    ],
    empty: { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", cgpa: "", description: "" },
  },
  {
    id: "experience",
    title: "Experience",
    fields: [
      ["company", "Company"],
      ["position", "Position"],
      ["location", "Location"],
      ["startDate", "Start date", "date"],
      ["endDate", "End date", "date"],
      ["currentlyWorking", "Currently working here", "checkbox"],
      ["description", "Accomplishments (one per line)", "lines"],
    ],
    empty: { company: "", position: "", location: "", startDate: "", endDate: "", currentlyWorking: false, description: [] },
  },
  {
    id: "projects",
    title: "Projects",
    fields: [
      ["title", "Project title"],
      ["techStack", "Technologies (comma separated)", "comma"],
      ["github", "GitHub URL", "url"],
      ["live", "Live URL", "url"],
      ["description", "Highlights (one per line)", "lines"],
    ],
    empty: { title: "", techStack: [], github: "", live: "", description: [] },
  },
  {
    id: "skills",
    title: "Skills",
    fields: [
      ["category", "Category"],
      ["items", "Skills (comma separated)", "comma"],
    ],
    empty: { category: "", items: [] },
  },
  {
    id: "certifications",
    title: "Certifications",
    fields: [
      ["title", "Certification"],
      ["issuer", "Issuer"],
      ["issueDate", "Issue date", "date"],
      ["credentialUrl", "Credential URL", "url"],
    ],
    empty: { title: "", issuer: "", issueDate: "", credentialUrl: "" },
  },
  { id: "achievements", title: "Achievements", scalar: true, list: true },
  {
    id: "languages",
    title: "Languages",
    fields: [
      ["language", "Language"],
      ["proficiency", "Proficiency"],
    ],
    empty: { language: "", proficiency: "" },
  },
];

const hasContent = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => (
      Array.isArray(item) ? item.length > 0 : Boolean(item)
    ));
  }
  return Boolean(value);
};

export function getSectionValidation(section, value) {
  const data = section === "achievements"
    ? value.map((entry) => ({ value: entry }))
    : value;
  const result = sectionSchemas[section].safeParse(data);
  return { valid: result.success, message: result.success ? "" : result.error.issues[0]?.message };
}

function setSectionField(setDraft, section, index, field, value, scalar) {
  setDraft((current) => {
    if (scalar && section === "summary") return { ...current, summary: value };
    if (scalar && section === "achievements") {
      const entries = [...current.achievements];
      entries[index] = value;
      return { ...current, achievements: entries };
    }
    if (section === "personal") {
      return { ...current, personal: { ...current.personal, [field]: value } };
    }
    const entries = [...current[section]];
    entries[index] = { ...entries[index], [field]: value };
    return { ...current, [section]: entries };
  });
}

function toDisplayValue(value, kind) {
  if (kind === "comma") return (value || []).join(", ");
  if (kind === "lines") return (value || []).join("\n");
  return value ?? "";
}

function fromDisplayValue(value, kind) {
  if (kind === "comma") return value.split(",").map((item) => item.trim()).filter(Boolean);
  if (kind === "lines") return value.split("\n").map((item) => item.trim()).filter(Boolean);
  return value;
}

function InputField({ section, index, field, label, kind, value, setDraft, scalar }) {
  const inputValue = toDisplayValue(value, kind);
  const props = {
    value: inputValue,
    onChange: (event) => setSectionField(
      setDraft,
      section,
      index,
      field,
      fromDisplayValue(event.target.value, kind),
      scalar
    ),
  };

  if (kind === "checkbox") {
    return (
      <label className="preview-check-field">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => setSectionField(setDraft, section, index, field, event.target.checked, scalar)}
        />
        {label}
      </label>
    );
  }

  if (kind === "textarea" || kind === "lines" || (scalar && section === "summary")) {
    return (
      <label className="preview-field">
        {label}
        <textarea {...props} rows={kind === "lines" ? 3 : 5} />
      </label>
    );
  }

  return (
    <label className="preview-field">
      {label}
      <input type={kind || "text"} {...props} />
    </label>
  );
}

export default function ResumePreviewEditor({ resume, draft, setDraft, dirtySections, errors }) {
  return (
    <aside className="preview-editor">
      <header className="preview-editor-header">
        <h2>Edit and validate</h2>
        <p>Changes are checked before the preview is regenerated.</p>
      </header>
      <div className="preview-section-list">
        {sections.map((section) => {
          const value = draft[section.id] ?? (section.scalar ? "" : []);
          const validation = getSectionValidation(section.id, value);
          const started = hasContent(resume[section.id]);
          const status = !started ? "Template" : validation.valid ? "Valid" : "Check";
          const entries = section.id === "personal"
            ? [value]
            : section.scalar
              ? section.id === "achievements" ? value : []
              : value;

          return (
            <details className="preview-section" key={section.id} open={section.id === "personal"}>
              <summary>
                <span>{section.title}</span>
                <span className={`validation-status ${status.toLowerCase()}`}>{status}</span>
              </summary>
              <div className="preview-fields">
                {section.scalar && section.id === "summary" && (
                  <InputField section={section.id} index={0} label="Summary" value={value} setDraft={setDraft} scalar />
                )}
                {entries.map((entry, index) => (
                  <div className="preview-entry" key={`${section.id}-${index}`}>
                    {section.scalar && section.id === "achievements" ? (
                      <InputField
                        section={section.id}
                        index={index}
                        label={`Achievement ${index + 1}`}
                        value={entry}
                        setDraft={setDraft}
                        scalar
                      />
                    ) : section.id === "personal" ? (
                      section.fields.map(([field, label, kind]) => (
                        <InputField key={field} section={section.id} index={index} field={field} label={label} kind={kind} value={entry[field]} setDraft={setDraft} />
                      ))
                    ) : !section.scalar ? (
                      section.fields.map(([field, label, kind]) => (
                        <InputField key={field} section={section.id} index={index} field={field} label={label} kind={kind} value={entry[field]} setDraft={setDraft} />
                      ))
                    ) : null}
                    {!section.scalar && section.id !== "personal" && (
                      <button
                        type="button"
                        className="preview-remove-entry"
                        onClick={() => setDraft((current) => ({
                          ...current,
                          [section.id]: current[section.id].filter((_, entryIndex) => entryIndex !== index),
                        }))}
                      >
                        Remove entry
                      </button>
                    )}
                    {section.id === "achievements" && (
                      <button
                        type="button"
                        className="preview-remove-entry"
                        onClick={() => setDraft((current) => ({
                          ...current,
                          achievements: current.achievements.filter((_, entryIndex) => entryIndex !== index),
                        }))}
                      >
                        Remove achievement
                      </button>
                    )}
                  </div>
                ))}
                {section.id !== "personal" && section.id !== "summary" && (
                  <button
                    type="button"
                    className="preview-add-entry"
                    onClick={() => setDraft((current) => ({
                      ...current,
                      [section.id]: section.id === "achievements"
                        ? [...current.achievements, ""]
                        : [...current[section.id], structuredClone(section.empty)],
                    }))}
                  >
                    Add {section.id === "achievements" ? "achievement" : "entry"}
                  </button>
                )}
                {(errors[section.id] || (dirtySections.includes(section.id) && !validation.valid)) && (
                  <p className="preview-validation-error" role="alert">
                    {errors[section.id] || validation.message}
                  </p>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </aside>
  );
}
