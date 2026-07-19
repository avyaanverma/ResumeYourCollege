import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildSkills(skills = []) {
  if (!skills.length) return '';

  let latex = '\\section*{Skills}\n';

  skills.forEach((skill) => {
    const category = escapeLatex(skill.category ?? '');
    const items = (skill.items ?? []).map((i) => escapeLatex(i));

    latex += `

\\textbf{${category}}

${items.join(', ')}

`;
  });

  return latex;
}
