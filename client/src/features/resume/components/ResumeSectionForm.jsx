import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateResumeSection } from "../resumeApi";
import { setCurrentResume } from "../resumeSlice";

const labels = {
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
};
const defaults = {
  education: {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    cgpa: "",
    description: "",
  },
  experience: {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: [],
  },
  projects: { title: "", techStack: [], github: "", live: "", description: [] },
  skills: { category: "", items: [] },
  certifications: { title: "", issuer: "", issueDate: "", credentialUrl: "" },
  achievements: "",
  languages: { language: "", proficiency: "" },
};
const next = {
  education: "experience",
  experience: "projects",
  projects: "skills",
  skills: "achievements",
  achievements: "certifications",
  certifications: "languages",
  languages: "review",
};
function Text({ register, name, label, required = false, type = "text" }) {
  return (
    <label className="field">
      {label}
      <input
        type={type}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
      />
    </label>
  );
}
export default function ResumeSectionForm({ section }) {
  const current = useSelector((s) => s.resume.current);
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { entries: [] } });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });
  useEffect(() => {
    if (current)
      reset({
        entries:
          section === "achievements"
            ? (current.achievements || []).map((value) => ({ value }))
            : current[section] || [],
      });
  }, [current, section, reset]);
  async function submit(values) {
    const data =
  section === "achievements"
    ? values.entries.map((x) => x.value).filter(Boolean)
    : values.entries.map((entry) => ({
        ...entry,

        description:
          section === "experience" || section === "projects"
            ? typeof entry.description === "string"
              ? entry.description.split("\n").filter(Boolean)
              : entry.description || []
            : entry.description,

        techStack:
          typeof entry.techStack === "string"
            ? entry.techStack
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            : entry.techStack || [],

        items:
          typeof entry.items === "string"
            ? entry.items
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            : entry.items || [],
      }));
    try {
      const resume = await updateResumeSection(resumeId, section, data);
      dispatch(setCurrentResume(resume));
      toast.success("Saved");
      navigate(`../${next[section]}`);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Could not save this section",
      );
    }
  }
  return (
    <section className="form-page">
      <h1>{labels[section]}</h1>
      <p>
        Add as many entries as you need. Changes are saved when you continue.
      </p>
      <form onSubmit={handleSubmit(submit)}>
        {fields.map((field, index) => (
          <fieldset className="entry-card" key={field.id}>
            <button
              type="button"
              className="remove"
              onClick={() => remove(index)}
            >
              Remove
            </button>
            {section === "achievements" ? (
              <Text
                register={register}
                name={`entries.${index}.value`}
                label="Achievement"
                required
              />
            ) : (
              <Entry section={section} index={index} register={register} />
            )}{" "}
          </fieldset>
        ))}
        <button
          type="button"
          className="secondary-button"
          onClick={() => append(defaults[section])}
        >
          + Add {labels[section].slice(0, -1) || "entry"}
        </button>
        <button className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </section>
  );
}
function Entry({ section, index, register }) {
  const n = `entries.${index}`;
  if (section === "education")
    return (
      <div className="form-grid">
        <Text
          register={register}
          name={`${n}.institution`}
          label="Institution"
          required
        />
        <Text
          register={register}
          name={`${n}.degree`}
          label="Degree"
          required
        />
        <Text
          register={register}
          name={`${n}.fieldOfStudy`}
          label="Field of study"
        />
        <Text register={register} name={`${n}.startDate`} label="Start date" />
        <Text register={register} name={`${n}.endDate`} label="End date" />
        <Text register={register} name={`${n}.cgpa`} label="CGPA" />
        <label className="field full">
          Description
          <textarea {...register(`${n}.description`)} />
        </label>
      </div>
    );
  if (section === "experience")
    return (
      <div className="form-grid">
        <Text
          register={register}
          name={`${n}.company`}
          label="Company"
          required
        />
        <Text
          register={register}
          name={`${n}.position`}
          label="Position"
          required
        />
        <Text register={register} name={`${n}.location`} label="Location" />
        <Text register={register} name={`${n}.startDate`} label="Start date" />
        <Text register={register} name={`${n}.endDate`} label="End date" />
        <label className="field">
          <input type="checkbox" {...register(`${n}.currentlyWorking`)} />{" "}
          Currently working
        </label>
        <label className="field full">
          Description (one point per line)
          <textarea {...register(`${n}.description`)} />
        </label>
      </div>
    );
  if (section === "projects")
    return (
      <div className="form-grid">
        <Text
          register={register}
          name={`${n}.title`}
          label="Project title"
          required
        />
        <Text
          register={register}
          name={`${n}.techStack`}
          label="Tech stack (comma separated)"
        />
        <Text register={register} name={`${n}.github`} label="GitHub URL" />
        <Text register={register} name={`${n}.live`} label="Live URL" />
        <label className="field full">
          Description (one point per line)
          <textarea {...register(`${n}.description`)} />
        </label>
      </div>
    );
  if (section === "skills")
    return (
      <div className="form-grid">
        <Text register={register} name={`${n}.category`} label="Category" />
        <Text
          register={register}
          name={`${n}.items`}
          label="Skills (comma separated)"
        />
      </div>
    );
  if (section === "languages")
    return (
      <div className="form-grid">
        <Text register={register} name={`${n}.language`} label="Language" />
        <Text
          register={register}
          name={`${n}.proficiency`}
          label="Proficiency"
        />
      </div>
    );
  return (
    <div className="form-grid">
      <Text register={register} name={`${n}.title`} label="Title" />
      <Text register={register} name={`${n}.issuer`} label="Issuer" />
      <Text register={register} name={`${n}.issueDate`} label="Issue date" />
      <Text
        register={register}
        name={`${n}.credentialUrl`}
        label="Credential URL"
      />
    </div>
  );
}
