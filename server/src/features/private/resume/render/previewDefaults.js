export default function addPreviewDefaults(resume) {
  const source = resume?.toObject ? resume.toObject() : { ...resume };
  const personal = { ...source.personal };

  for (const [field, label] of Object.entries({
    fullName: "Your name",
    email: "your.email@example.com",
    phone: "Phone number",
    location: "City, Country",
    linkedin: "LinkedIn profile",
    github: "GitHub profile",
    portfolio: "Portfolio URL",
  })) {
    if (!personal[field]) personal[field] = label;
  }

  return {
    ...source,
    personal,
    summary: source.summary || "Add a concise professional summary tailored to your target role.",
    education: source.education?.length ? source.education : [{
      institution: "Institution name",
      degree: "Degree and field of study",
      fieldOfStudy: "",
      startDate: "Start date",
      endDate: "End date",
      cgpa: "GPA / grade",
      description: "",
    }],
    experience: source.experience?.length ? source.experience : [{
      company: "Company or organization",
      position: "Role or position",
      location: "Location",
      startDate: "Start date",
      endDate: "End date",
      currentlyWorking: false,
      description: ["Add a result-focused accomplishment and quantify the impact where possible."],
    }],
    projects: source.projects?.length ? source.projects : [{
      title: "Project name",
      techStack: ["Technology 1", "Technology 2"],
      github: "",
      live: "",
      description: ["Describe the problem, your solution, and its measurable outcome."],
    }],
    skills: source.skills?.length ? source.skills : [{
      category: "Technical Skills",
      items: ["Add relevant skills"],
    }],
    certifications: source.certifications?.length ? source.certifications : [{
      title: "Certification name",
      issuer: "Issuing organization",
      issueDate: "Date",
      credentialUrl: "",
    }],
    achievements: source.achievements?.length
      ? source.achievements
      : ["Add a relevant award, achievement, or leadership contribution."],
    languages: source.languages?.length ? source.languages : [{
      language: "Language",
      proficiency: "Proficiency",
    }],
  };
}
