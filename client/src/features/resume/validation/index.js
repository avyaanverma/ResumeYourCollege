import { z } from "zod";
import { personalSchema } from "./personal.schema";
import { summarySchema } from "./summary.schema";
import { educationSchema } from "./education.schema";
import { experienceSchema } from "./experience.schema";
import { projectSchema } from "./project.schema";
import { skillSchema } from "./skill.schema";
import { certificationSchema } from "./certification.schema";
import { languageSchema } from "./language.schema";
import { achievementSchema } from "./achievement.schema";

/**
 * Maps each resume section to its corresponding Zod schema.
 *
 * Principles:
 * 1. Single Source of Truth - These schemas mirror the backend validation
 * 2. Array sections are wrapped in z.array() at this level
 * 3. Non-array sections (personal, summary) are used directly
 * 4. The generic ResumeSectionForm uses this map to dynamically load validation
 *
 * Why this is scalable:
 * - Adding a new section only requires: schema file → import → add to map
 * - No changes needed to form components, hooks, or renderers
 * - The map is the central registry, consumed by useSectionForm
 */
export const sectionSchemas = {
  personal: personalSchema,
  summary: summarySchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  achievements: z.array(
    z.object({
      value: achievementSchema,
    }),
  ),
};

/**
 * Maps section IDs to their human-readable label.
 */
export const sectionLabels = {
  personal: "Profile",
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
};

/**
 * Maps section IDs to the next step in the wizard flow.
 */
export const nextSection = {
  personal: "education",
  education: "experience",
  experience: "projects",
  projects: "skills",
  skills: "achievements",
  achievements: "certifications",
  certifications: "languages",
  languages: "review",
};

/**
 * Defines which sections are array-based (use FieldArray) vs single-entry.
 */
export const isArraySection = {
  personal: false,
  summary: false,
  education: true,
  experience: true,
  projects: true,
  skills: true,
  certifications: true,
  achievements: true,
  languages: true,
};

/**
 * Defines the field that serves as the array wrapper name in the form.
 * For array sections, useForm manages `entries` as the field array name.
 */
export const ARRAY_FIELD_NAME = "entries";
