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
    const description = edu.description ? escapeLatex(edu.description) : '';

    latex += `
\\textbf{${institution}} \\\\
\\relax
${degree} ${fieldOfStudy ? `in ${fieldOfStudy}` : ''} \\hfill ${startDate} -- ${endDate} \\\\
${cgpa ? `CGPA: ${cgpa}` : ''}
${description ? `\\par ${description}` : ''}

\\vspace{0.2cm}

`;
  });

  return latex;
}
