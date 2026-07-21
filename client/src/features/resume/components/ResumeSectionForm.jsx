import React from "react";
import { ArraySectionRenderer, ProfileSection } from "./sections";
import { isArraySection } from "../validation";

/**
 * ResumeSectionForm - Orchestrator component.
 *
 * Delegates to the appropriate renderer based on section type:
 * - Array sections (education, experience, projects, skills, etc.) → ArraySectionRenderer
 * - Non-array sections (personal) → ProfileSection
 *
 * This component exists to maintain backward compatibility with existing page imports.
 * All new logic is in the delegated components.
 *
 * @param {Object} props
 * @param {string} props.section - The resume section identifier
 */
export default function ResumeSectionForm({ section }) {
  if (!isArraySection[section]) {
    // Non-array sections (personal) get dedicated renderers
    switch (section) {
      case "personal":
        return <ProfileSection />;
      default:
        return (
          <div className="form-page">
            <p className="form-error">Unknown section: {section}</p>
          </div>
        );
    }
  }

  // Array sections use the generic array renderer
  return <ArraySectionRenderer section={section} />;
}
