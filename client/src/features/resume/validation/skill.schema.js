import { z } from "zod";
import { createDuplicateCheckRefinement } from "./helpers";

/**
 * Skill section schema.
 * Mirrors: server validation
 * Enhances with:
 * - Category required
 * - At least one skill required
 * - Duplicate skill detection
 */
export const skillSchema = z.object({
  category: z
    .string({
      message:
        "Please enter a skill category (e.g., Frontend, Backend, Tools).",
    })
    .trim()
    .min(1, {
      message:
        "Please enter a skill category (e.g., Frontend, Backend, Tools).",
    })
    .max(50, { message: "Category must be under 50 characters." }),

  items: z
    .array(
      z.string().trim().min(1, { message: "Skill name cannot be empty." }),
      {
        message: "Please add at least one skill.",
      },
    )
    .min(1, { message: "Please add at least one skill." })
    .superRefine(createDuplicateCheckRefinement("skill")),
});
