import { z } from "zod";
import {
  ISO_DATE_REGEX,
  createDateRangeRefinement,
  createCurrentlyWorkingRefinement,
} from "./helpers";

/**
 * Experience section schema.
 * Mirrors: server validation
 * Enhances with:
 * - Conditional endDate validation (currentlyWorking logic)
 * - Description as string[] with bullet validation
 * - Date range refinement
 */
export const experienceSchema = z
  .object({
    company: z
      .string({
        message: "Please enter the company name.",
      })
      .trim()
      .min(1, { message: "Please enter the company name." })
      .max(100, { message: "Company name must be under 100 characters." }),

    position: z
      .string({
        message: "Please enter your position.",
      })
      .trim()
      .min(1, { message: "Please enter your position." })
      .max(100, { message: "Position must be under 100 characters." }),

    location: z
      .string()
      .trim()
      .max(200, { message: "Location must be under 200 characters." })
      .optional()
      .or(z.literal("")),

    startDate: z
      .string({
        message: "Please select a valid start date.",
      })
      .regex(ISO_DATE_REGEX, {
        message: "Please select a valid start date.",
      }),

    endDate: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val || val === "") return true;
          return ISO_DATE_REGEX.test(val);
        },
        { message: "Please select a valid end date." },
      ),

    currentlyWorking: z.boolean().default(false),

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
            "Please add at least one description bullet point (e.g., • Led a team of...).",
        },
      )
      .min(1, {
        message:
          "Please add at least one description bullet point (e.g., • Led a team of...).",
      }),
  })
  .refine(createCurrentlyWorkingRefinement().refinement, {
    message: createCurrentlyWorkingRefinement().message,
    path: createCurrentlyWorkingRefinement().path,
  })
  .refine(createDateRangeRefinement().refinement, {
    message: createDateRangeRefinement().message,
    path: createDateRangeRefinement().path,
  });
