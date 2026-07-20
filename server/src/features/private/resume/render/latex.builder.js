import buildPersonal from "./builders/personal.builder.js";
import buildSummary from "./builders/summary.builder.js";
import buildEducation from "./builders/education.builder.js";
import buildExperience from "./builders/experience.builder.js";
import buildProjects from "./builders/projects.builder.js";
import buildSkills from "./builders/skill.builder.js";
import buildLanguages from "./builders/language.builder.js";
import buildCertifications from "./builders/certification.builder.js";
import { escapeLatex } from "../../../../utils/escapeLatex.js";

export default function buildLatexSections(resume) {

    return {

        PERSONAL: buildPersonal(resume.personal),

        SUMMARY: buildSummary(resume.summary),

        EDUCATION: buildEducation(resume.education),

        EXPERIENCE: buildExperience(resume.experience),

        PROJECTS: buildProjects(resume.projects),

        SKILLS: buildSkills(resume.skills),

        LANGUAGES: buildLanguages(resume.languages),

        CERTIFICATIONS: buildCertifications(resume.certifications),

        ACHIEVEMENTS: (resume.achievements?.length
          ? `\\section*{Achievements}\n\\begin{itemize}\n${resume.achievements.map((item) => `\\item ${escapeLatex(item)}`).join("\n")}\n\\end{itemize}`
          : "")

    };

}
