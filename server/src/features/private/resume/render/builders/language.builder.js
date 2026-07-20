import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildLanguages(languages = []) {
  if (!languages.length) return '';

  let latex = '\\section*{Languages}\n';

  languages.forEach((language) => {
    const name = escapeLatex(language.language ?? '');
    const proficiency = escapeLatex(language.proficiency ?? '');

    latex += `${name} (${proficiency})\\\\\n`;
  });

  return latex;
}
