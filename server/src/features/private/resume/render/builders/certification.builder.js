import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildCertifications(certifications = []) {
  if (!certifications.length) return '';

  let latex = '\\section*{Certifications}\n';

  certifications.forEach((certification) => {
    const name = escapeLatex(certification.name ?? '');
    const issuer = escapeLatex(certification.issuer ?? '');
    const date = escapeLatex(certification.date ?? '');

    latex += `
\\textbf{${name}}

${issuer}

${date}

\\vspace{0.2cm}

`;
  });

  return latex;
}
