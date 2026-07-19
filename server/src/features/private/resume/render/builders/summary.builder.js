import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildSummary(summary = '') {
  if (!summary) return '';

  return `
\\section*{Summary}

${escapeLatex(summary)}
`;
}
