import { z } from "zod";

/**
 * Achievement section schema.
 * Mirrors: server validation
 * Enhances with:
 * - Each achievement must be non-empty
 * - Max length per achievement
 */
export const achievementSchema = z
  .string()
  .trim()
  .min(1, { message: "Achievement cannot be empty." })
  .max(500, { message: "Each achievement must be under 500 characters." });
