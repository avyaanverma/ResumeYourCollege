import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildEducation(education = []) {
  if (!education.length) return '';

  let latex = '\\section*{Education}\n';

  education.forEach((edu) => {
    const institution = escapeLatex(edu.institution ?? '');
    const degree = escapeLatex(edu.degree ?? '');
    const fieldOfStudy = edu.fieldOfStudy ? escapeLatex(edu.fieldOfStudy) : '';
    const startDate = escapeLatex(edu.startDate ?? '');
    const endDate = escapeLatex(edu.endDate ?? '');
    const cgpa = edu.cgpa ? escapeLatex(edu.cgpa) : '';

    latex += `
\\textbf{${institution}} \\\\
${degree} ${fieldOfStudy ? `in ${fieldOfStudy}` : ''} \\hfill ${startDate} -- ${endDate} \\\\
${cgpa ? `CGPA: ${cgpa}` : ''}

\\vspace{0.2cm}

`;
  });

  return latex;
}
