import { sectionValidators } from "./resume.validation.js";
import ApiError from "../../../utils/ApiError.js";

export default function validateResumeSection(section, data) {
  const validator = sectionValidators[section];

  if (!validator) {
    throw new ApiError(400, "Invalid resume section");
  }

  const result = validator.safeParse(data);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0].message);
  }

  return result.data;
}