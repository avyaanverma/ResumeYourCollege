import { z } from "zod";
import {
  RESUME_SECTIONS,
  RESUME_VISIBILITY,
  RESUME_TEMPLATES,
} from "../../../constants/resume.constants.js";

const personalSchema = z.object({
  fullName: z.string().trim().min(1).max(100),

  email: z.string().trim().email(),

  phone: z.string().trim().optional(),

  location: z.string().trim().optional(),

  linkedin: z.string().trim().optional(),

  github: z.string().trim().optional(),

  portfolio: z.string().trim().optional(),
});

const educationSchema = z.object({
  institution: z.string().trim().min(1),

  degree: z.string().trim().min(1),

  fieldOfStudy: z.string().trim().optional(),

  startDate: z.iso.date(),

  endDate: z.iso.date(),

  cgpa: z.string().optional(),

  description: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().trim().min(1),

  position: z.string().trim().min(1),

  location: z.string().optional(),

  startDate: z.iso.date(),

  endDate: z.iso.date(),

  currentlyWorking: z.boolean(),

  description: z.array(z.string()),
});

const projectSchema = z.object({
  title: z.string().trim().min(1),

  techStack: z.array(z.string()),

  github: z.string().optional(),

  live: z.string().optional(),

  description: z.array(z.string()),
});

const skillSchema = z.object({
  category: z.string(),

  items: z.array(z.string()),
});

const certificationSchema = z.object({
  title: z.string(),

  issuer: z.string(),

  issueDate: z.iso.date(),

  credentialUrl: z.string().optional(),
});

const languageSchema = z.object({
  language: z.string(),

  proficiency: z.string(),
});

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(100).optional(),

    template: z
      .enum(Object.values(RESUME_TEMPLATES))
      .optional(),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    section: z.enum(Object.values(RESUME_SECTIONS)),

    data: z.any(),
  }),
});

export const updateVisibilitySchema = z.object({
  body: z.object({
    visibility: z.enum(Object.values(RESUME_VISIBILITY)),
  }),
});

export const updateTemplateSchema = z.object({
  body: z.object({
    template: z.enum(Object.values(RESUME_TEMPLATES)),
  }),
});

export const sectionValidators = {
  [RESUME_SECTIONS.PERSONAL]: personalSchema,

  [RESUME_SECTIONS.SUMMARY]: z.string(),

  [RESUME_SECTIONS.EDUCATION]: z.array(educationSchema),

  [RESUME_SECTIONS.EXPERIENCE]: z.array(experienceSchema),

  [RESUME_SECTIONS.PROJECTS]: z.array(projectSchema),

  [RESUME_SECTIONS.SKILLS]: z.array(skillSchema),

  [RESUME_SECTIONS.CERTIFICATIONS]: z.array(
    certificationSchema
  ),

  [RESUME_SECTIONS.ACHIEVEMENTS]: z.array(z.string()),

  [RESUME_SECTIONS.LANGUAGES]: z.array(languageSchema),
};