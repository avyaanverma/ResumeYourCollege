import { escapeLatex } from '../../../../../utils/escapeLatex.js';

export default function buildProjects(projects = []) {
  if (!projects.length) return '';

  let latex = '\\section*{Projects}\n';

  projects.forEach((project) => {
    const title = escapeLatex(project.title ?? '');
    const techStack = (project.techStack ?? []).map((t) => escapeLatex(t));
    const description = (project.description ?? []).map((d) => escapeLatex(d));

    latex += `
\\textbf{${title}}

`;

    if (techStack.length) {
      latex += `
\\textit{${techStack.join(', ')}}

`;
    }

    latex += '\\begin{itemize}\n';

    description.forEach((point) => {
      latex += `\\item ${point}\n`;
    });

    latex += '\\end{itemize}\n';
  });

  return latex;
}
