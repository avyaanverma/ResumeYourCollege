import { z } from "zod";
import { ISO_DATE_REGEX, isValidUrl } from "./helpers";

/**
 * Certification section schema.
 * Mirrors: server validation
 * Enhances with:
 * - Title max length
 * - Issuer max length
 * - Issue date format validation
 * - Credential URL validation
 */
export const certificationSchema = z.object({
  title: z
    .string({
      message: "Please enter the certification title.",
    })
    .trim()
    .min(1, { message: "Please enter the certification title." })
    .max(200, { message: "Certification title must be under 200 characters." }),

  issuer: z
    .string({
      message: "Please enter the issuing organization.",
    })
    .trim()
    .min(1, { message: "Please enter the issuing organization." })
    .max(200, {
      message: "Issuer name must be under 200 characters.",
    }),

  issueDate: z
    .string({
      message: "Please select a valid issue date.",
    })
    .regex(ISO_DATE_REGEX, {
      message: "Please select a valid issue date.",
    }),

  credentialUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => isValidUrl(val), {
      message:
        "Please enter a valid credential URL (e.g., https://certificate.example.com).",
    }),
});
