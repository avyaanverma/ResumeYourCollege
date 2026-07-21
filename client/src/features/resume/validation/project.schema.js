import { z } from "zod";
import { GITHUB_URL_REGEX, createDuplicateCheckRefinement } from "./helpers";

/**
 * Projects section schema.
 * Mirrors: server validation
 * Enhances with:
 * - GitHub URL validation
 * - Live URL validation
 * - Duplicate techStack detection
 * - Minimum one technology required
 * - Description as string[] with bullet validation
 */
export const projectSchema = z.object({
  title: z
    .string({
      message: "Please enter the project title.",
    })
    .trim()
    .min(1, { message: "Please enter the project title." })
    .max(100, { message: "Project title must be under 100 characters." }),

  techStack: z
    .array(
      z.string().trim().min(1, { message: "Technology name cannot be empty." }),
      {
        message: "Please add at least one technology.",
      },
    )
    .min(1, { message: "Please add at least one technology." })
    .superRefine(createDuplicateCheckRefinement("technology")),

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
          "Please enter a valid GitHub URL (e.g., https://github.com/username/repo).",
      },
    ),

  live: z
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
          "Please enter a valid live URL (e.g., https://yourproject.com).",
      },
    ),

  description: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: "Bullet point cannot be empty." })
        .max(300, {
          message: "Each bullet point must be under 300 characters.",
        }),
      {
        message:
          "Please add at least one description bullet point (e.g., • Built with React...).",
      },
    )
    .min(1, {
      message:
        "Please add at least one description bullet point (e.g., • Built with React...).",
    }),
});
