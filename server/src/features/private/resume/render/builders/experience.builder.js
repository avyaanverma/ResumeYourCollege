import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildExperience(experience = []) {
  if (!experience.length) return '';

  let latex = '\\section*{Experience}\n';

  experience.forEach((exp) => {
    const position = escapeLatex(exp.position ?? '');
    const company = escapeLatex(exp.company ?? '');
    const location = escapeLatex(exp.location ?? '');
    const startDate = escapeLatex(exp.startDate ?? '');
    const endDate = exp.currentlyWorking ? 'Present' : escapeLatex(exp.endDate ?? '');
    const description = (exp.description ?? [])
      .map((d) => escapeLatex(d))
      .filter(Boolean);

    latex += `
\\textbf{${position}}

${company}${location ? `, ${location}` : ''} \\hfill ${startDate} -- ${endDate} \\\\
\\relax
`;

    if (description.length) {
      latex += '\\begin{itemize}\n';
      description.forEach((point) => {
        latex += `\\item ${point}\n`;
      });
      latex += '\\end{itemize}\n';
    }

    latex += '\n';
  });

  return latex;
}
