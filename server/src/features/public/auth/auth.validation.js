import { z } from "zod";

/**
 * Register Validation
 */
export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  }),
});

/**
 * Login Validation
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

/**
 * Forgot Password
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email"),
  }),
});

/**
 * Reset Password
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),

    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/),
  }),
});

/**
 * Change Password
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),

    newPassword: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/),
  }),
});