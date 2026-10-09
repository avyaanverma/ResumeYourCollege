import { z } from "zod";

export const aiResumeRequestSchema = z.object({
  body: z.object({
    prompt: z
      .string()
      .trim()
      .min(20, "Add more detail so the resume can be tailored")
      .max(3000, "Prompt must be 3,000 characters or fewer"),
  }),
});

export const generatedResumeSchema = z.object({
  title: z.string().trim().min(1).max(100),
  personal: z.object({
    fullName: z.string().max(100),
    email: z.string().max(254),
    phone: z.string().max(30),
    location: z.string().max(200),
    linkedin: z.string().max(300),
    github: z.string().max(300),
    portfolio: z.string().max(300),
  }),
  summary: z.string().max(1000),
  education: z.array(z.object({
    institution: z.string().max(100),
    degree: z.string().max(100),
    fieldOfStudy: z.string().max(100),
    startDate: z.string().max(10),
    endDate: z.string().max(10),
    cgpa: z.string().max(20),
    description: z.string().max(500),
  })).max(10),
  experience: z.array(z.object({
    company: z.string().max(100),
    position: z.string().max(100),
    location: z.string().max(200),
    startDate: z.string().max(10),
    endDate: z.string().max(10),
    currentlyWorking: z.boolean(),
    description: z.array(z.string().max(300)).max(8),
  })).max(10),
  projects: z.array(z.object({
    title: z.string().max(100),
    techStack: z.array(z.string().max(60)).max(20),
    github: z.string().max(300),
    live: z.string().max(300),
    description: z.array(z.string().max(300)).max(8),
  })).max(10),
  skills: z.array(z.object({
    category: z.string().max(50),
    items: z.array(z.string().max(60)).max(40),
  })).max(20),
  certifications: z.array(z.object({
    title: z.string().max(120),
    issuer: z.string().max(120),
    issueDate: z.string().max(10),
    credentialUrl: z.string().max(300),
  })).max(20),
  achievements: z.array(z.string().max(300)).max(20),
  languages: z.array(z.object({
    language: z.string().max(60),
    proficiency: z.string().max(60),
  })).max(20),
});
