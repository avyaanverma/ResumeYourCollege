/**
 * Default values for every resume section.
 *
 * Why these shapes:
 * - experience/projects.description → [] (array): Backend stores as string[],
 *   BulletEditor manages arrays directly, avoids type conversion on submit.
 * - experience/projects.techStack → [] (array): TagInput manages arrays.
 * - skills.items → [] (array): TagInput manages arrays.
 * - achievements → "" (string): wrapped in { value } in the form for FieldArray compat.
 * - All other fields → "" (string): standard text inputs.
 */
export const sectionDefaults = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
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
  projects: {
    title: "",
    techStack: [],
    github: "",
    live: "",
    description: [],
  },
  skills: {
    category: "",
    items: [],
  },
  certifications: {
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
  },
  achievements: "",
  languages: {
    language: "",
    proficiency: "",
  },
};

/**
 * Empty entry shapes for FieldArray append operations.
 * achievements uses { value: "" } wrapper for FieldArray compatibility.
 */
export const emptyEntry = {
  education: sectionDefaults.education,
  experience: sectionDefaults.experience,
  projects: sectionDefaults.projects,
  skills: sectionDefaults.skills,
  certifications: sectionDefaults.certifications,
  languages: sectionDefaults.languages,
  achievements: { value: "" },
};
