import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildCertifications(certifications = []) {
  if (!certifications.length) return '';

  let latex = '\\section*{Certifications}\n';

  certifications.forEach((certification) => {
    const name = escapeLatex(certification.title ?? '');
    const issuer = escapeLatex(certification.issuer ?? '');
    const date = escapeLatex(certification.issueDate ?? '');
    const credentialUrl = certification.credentialUrl
      ? escapeLatex(certification.credentialUrl)
      : '';

    latex += `
\\textbf{${name}}

${issuer}

${date}
${credentialUrl ? `\\\\${credentialUrl}` : ''}

\\vspace{0.2cm}

`;
  });

  return latex;
}
