import { z } from "zod";

/**
 * Summary section schema.
 * Optional text field with a maximum length constraint.
 */
export const summarySchema = z
  .string()
  .trim()
  .max(1000, {
    message: "Professional summary must be under 1,000 characters.",
  })
  .optional()
  .or(z.literal(""));
