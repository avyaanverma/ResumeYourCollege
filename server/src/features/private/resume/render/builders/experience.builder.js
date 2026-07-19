import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildExperience(experience = []) {
  if (!experience.length) return '';

  let latex = '\\section*{Experience}\n';

  experience.forEach((exp) => {
    const position = escapeLatex(exp.position ?? '');
    const company = escapeLatex(exp.company ?? '');
    const startDate = escapeLatex(exp.startDate ?? '');
    const endDate = escapeLatex(exp.endDate ?? '');
    const description = (exp.description ?? []).map((d) => escapeLatex(d));

    latex += `
\\textbf{${position}}

${company} \\hfill ${startDate} -- ${endDate}

\\begin{itemize}
`;

    description.forEach((point) => {
      latex += `\\item ${point}\n`;
    });

    latex += `
\\end{itemize}

`;
  });

  return latex;
}
