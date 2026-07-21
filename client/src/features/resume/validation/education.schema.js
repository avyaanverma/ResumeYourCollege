import { z } from "zod";
import { ISO_DATE_REGEX, createDateRangeRefinement } from "./helpers";

/**
 * Education section schema.
 * Mirrors: server validation
 * Enhances with: max lengths, CGPA range, date range validation.
 */
export const educationSchema = z
  .object({
    institution: z
      .string({
        message: "Please enter your institution name.",
      })
      .trim()
      .min(1, { message: "Please enter your institution name." })
      .max(100, {
        message: "Institution name must be under 100 characters.",
      }),

    degree: z
      .string({
        message: "Please enter your degree.",
      })
      .trim()
      .min(1, { message: "Please enter your degree." })
      .max(100, { message: "Degree must be under 100 characters." }),

    fieldOfStudy: z
      .string()
      .trim()
      .max(100, {
        message: "Field of study must be under 100 characters.",
      })
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
      .string({
        message: "Please select a valid end date.",
      })
      .regex(ISO_DATE_REGEX, {
        message: "Please select a valid end date.",
      }),

    cgpa: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val || val === "") return true;
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0 && num <= 10;
        },
        { message: "CGPA must be between 0 and 10." },
      ),

    description: z
      .string()
      .trim()
      .max(500, {
        message: "Description must be under 500 characters.",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine(createDateRangeRefinement().refinement, {
    message: createDateRangeRefinement().message,
    path: createDateRangeRefinement().path,
  });
