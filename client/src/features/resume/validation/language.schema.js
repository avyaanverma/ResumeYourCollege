import { z } from "zod";
import { PROFICIENCY_LEVELS } from "../constants/proficiency";

/**
 * Language section schema.
 * Mirrors: server validation
 * Enhances with:
 * - Language name required
 * - Proficiency must be a valid enum value
 */
export const languageSchema = z.object({
  language: z
    .string({
      message: "Please enter a language name.",
    })
    .trim()
    .min(1, { message: "Please enter a language name." })
    .max(50, { message: "Language name must be under 50 characters." }),

  proficiency: z
    .string({
      message: "Please select your proficiency level.",
    })
    .trim()
    .min(1, { message: "Please select your proficiency level." })
    .refine(
      (val) => {
        return Object.values(PROFICIENCY_LEVELS).includes(val);
      },
      {
        message:
          "Please select a valid proficiency level: Beginner, Intermediate, Advanced, or Native.",
      },
    ),
});
