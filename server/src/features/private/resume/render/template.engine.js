import fs from "fs";
import path from "path";

const templatePath = path.resolve(
  "src/features/private/resume/render/templates/modern.tex"
);

export default function renderTemplate(sections) {
  let template = fs.readFileSync(templatePath, "utf8");

  Object.entries(sections).forEach(([key, value]) => {
    template = template.replace(
      new RegExp(`{{${key}}}`, "g"),
      value
    );
  });

  return template;
}