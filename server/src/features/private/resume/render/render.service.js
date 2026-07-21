import fs from "fs/promises";
import path from "path";
import { execa } from "execa";

import ResumeRepository from "../../../../repository/resume.repository.js";

import buildLatexSections from "./latex.builder.js";
import renderTemplate from "./template.engine.js";

class RenderService {

    async exportPDF(resumeId, userId) {

        const resume = await ResumeRepository.findByIdAndOwner(
            resumeId,
            userId
        );

        if (!resume) {
            throw new Error("Resume not found");
        }

        const sections = buildLatexSections(resume);

        const latex = renderTemplate(sections);

        const outputDir = path.join(
            process.cwd(),
            "src/features/private/resume/render/output"
        );

        await fs.mkdir(outputDir, { recursive: true });

        const texPath = path.join(outputDir, "resume.tex");

        await fs.writeFile(texPath, latex);

        try {
            const result = await execa("tectonic", [
                texPath,
                "--outdir",
                outputDir
            ]);

            console.log("PDF Generated Successfully");
            console.log(result.stdout);
        }
        catch (err) {
            console.error("========== TECTONIC ERROR ==========");
            console.error("Message:", err.message);
            console.error("Exit Code:", err.exitCode);
            console.error("STDOUT:\n", err.stdout);
            console.error("STDERR:\n", err.stderr);
            console.error(err);

        throw err;
}

        return path.join(outputDir, "resume.pdf");

    }

}

export default new RenderService();