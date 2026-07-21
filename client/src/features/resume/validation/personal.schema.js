import { z } from "zod";
import {
  ISO_DATE_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  GITHUB_URL_REGEX,
  LINKEDIN_URL_REGEX,
} from "./helpers";

/**
 * Personal section schema.
 * Mirrors: server/src/features/private/resume/resume.validation.js
 * Enhances with: max length constraints, URL format validation, user-friendly messages.
 */
export const personalSchema = z.object({
  fullName: z
    .string({
      message: "Please enter your full name.",
    })
    .trim()
    .min(1, { message: "Please enter your full name." })
    .max(100, {
      message: "Full name must be under 100 characters.",
    }),

  email: z
    .string({
      message: "Please enter your email address.",
    })
    .trim()
    .min(1, { message: "Please enter your email address." })
    .regex(EMAIL_REGEX, {
      message: "Please enter a valid email address (e.g., name@example.com).",
    }),

  phone: z
    .string()
    .trim()
    .max(20, { message: "Phone number must be under 20 characters." })
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return PHONE_REGEX.test(val);
      },
      { message: "Please enter a valid phone number (e.g., +1 234 567 8900)." },
    ),

  location: z
    .string()
    .trim()
    .max(200, { message: "Location must be under 200 characters." })
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return LINKEDIN_URL_REGEX.test(val);
      },
      {
        message:
          "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username).",
      },
    ),

  github: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return GITHUB_URL_REGEX.test(val);
      },
      {
        message:
          "Please enter a valid GitHub URL (e.g., https://github.com/username).",
      },
    ),

  portfolio: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          new URL(val.trim());
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          "Please enter a valid portfolio URL (e.g., https://yourportfolio.com).",
      },
    ),
});
