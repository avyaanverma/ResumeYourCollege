/**
 * Shared validation helpers for resume schemas.
 * Mirrors backend validation logic to maintain consistency.
 */

// ISO date format regex (YYYY-MM-DD)
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// URL validation patterns
export const GITHUB_URL_REGEX = /^https?:\/\/(www\.)?github\.com\/.+/i;
export const LINKEDIN_URL_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/i;

// Email regex (comprehensive but not overly strict for UX)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex - supports international formats
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

/**
 * Creates a refinement that checks if endDate >= startDate.
 * Used by education and experience schemas.
 */
export function createDateRangeRefinement() {
  return {
    refinement: (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    message: "End date must be after start date.",
    path: ["endDate"],
  };
}

/**
 * Creates a refinement for conditional endDate validation.
 * If currentlyWorking is true, endDate is optional.
 */
export function createCurrentlyWorkingRefinement() {
  return {
    refinement: (data) => {
      if (data.currentlyWorking) return true;
      return !!data.endDate;
    },
    message: "Please enter an end date or check 'Currently working'.",
    path: ["endDate"],
  };
}

/**
 * Creates a superRefine callback that detects duplicate values in an array.
 * Used for techStack and skills arrays.
 */
export function createDuplicateCheckRefinement(fieldName) {
  return (arr, ctx) => {
    const seen = new Map();
    arr.forEach((item, idx) => {
      if (!item || (typeof item === "string" && !item.trim())) return;
      const key = typeof item === "string" ? item.toLowerCase().trim() : item;
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate ${fieldName} "${item}" is not allowed.`,
          path: [idx],
        });
      }
      seen.set(key, idx);
    });
  };
}

/**
 * Validates that a string is a properly formatted URL.
 * Returns true if valid or empty (for optional fields).
 */
export function isValidUrl(url) {
  if (!url || url.trim() === "") return true;
  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}
