import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildPersonal(personal = {}) {
  const fullName = escapeLatex(personal.fullName ?? '');
  const email = escapeLatex(personal.email ?? '');
  const phone = escapeLatex(personal.phone ?? '');
  const location = escapeLatex(personal.location ?? '');

  return `
\\begin{center}
{\\LARGE \\textbf{${fullName}}} \\\\[4pt]

${email} \\quad
${phone} \\quad
${location}
\\end{center}
`;
}
