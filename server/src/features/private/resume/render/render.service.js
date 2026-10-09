import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { execa } from "execa";

import ResumeRepository from "../../../../repository/resume.repository.js";
import ApiError from "../../../../utils/ApiError.js";
import logger from "../../../../logger/pino.js";
import buildLatexSections from "./latex.builder.js";
import renderTemplate from "./template.engine.js";
import addPreviewDefaults from "./previewDefaults.js";

const previewRoot = path.join(os.tmpdir(), "resume-your-college-previews");
const previewLifetimeMs = 30 * 60 * 1000;

class RenderService {
  async compilePDF(resume, outputDir, includeDefaults = false) {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      const source = includeDefaults ? addPreviewDefaults(resume) : resume;
      const texPath = path.join(outputDir, "resume.tex");
      await fs.writeFile(texPath, renderTemplate(buildLatexSections(source)));
      await execa("tectonic", [texPath, "--outdir", outputDir]);
    } catch (error) {
      logger.error(
        { err: error, resumeId: resume._id?.toString() },
        "Resume PDF generation failed"
      );
      await fs.rm(outputDir, { recursive: true, force: true });
      throw new ApiError(500, "Could not generate the resume PDF");
    }

    return path.join(outputDir, "resume.pdf");
  }

  async getOwnedResume(resumeId, userId) {
    const resume = await ResumeRepository.findByIdAndOwner(resumeId, userId);
    if (!resume) throw new ApiError(404, "Resume not found");
    return resume;
  }

  async exportPDF(resumeId, userId) {
    const resume = await this.getOwnedResume(resumeId, userId);
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "ryc-resume-export-"));
    const pdfPath = await this.compilePDF(resume, outputDir, true);
    return { pdfPath, resume };
  }

  async createPreview(resumeId, userId) {
    const resume = await this.getOwnedResume(resumeId, userId);
    const previewId = randomUUID();
    const outputDir = path.join(previewRoot, previewId);
    await this.compilePDF(resume, outputDir, true);
    const expiresAt = new Date(Date.now() + previewLifetimeMs);

    await fs.writeFile(
      path.join(outputDir, "metadata.json"),
      JSON.stringify({
        previewId,
        resumeId: resumeId.toString(),
        userId: userId.toString(),
        expiresAt,
      })
    );
    return { previewId, expiresAt };
  }

  async getPreviewPdf(previewId, resumeId, userId) {
    const outputDir = path.join(previewRoot, previewId);
    let metadata;
    try {
      metadata = JSON.parse(
        await fs.readFile(path.join(outputDir, "metadata.json"), "utf8")
      );
    } catch (error) {
      if (error.code === "ENOENT") throw new ApiError(404, "Resume preview not found");
      throw error;
    }

    if (
      metadata.userId !== userId.toString() ||
      metadata.resumeId !== resumeId.toString()
    ) {
      throw new ApiError(404, "Resume preview not found");
    }
    if (new Date(metadata.expiresAt).getTime() <= Date.now()) {
      await fs.rm(outputDir, { recursive: true, force: true });
      throw new ApiError(410, "Resume preview expired");
    }
    return path.join(outputDir, "resume.pdf");
  }

  async deletePreview(previewId, resumeId, userId) {
    const outputDir = path.join(previewRoot, previewId);
    try {
      const metadata = JSON.parse(
        await fs.readFile(path.join(outputDir, "metadata.json"), "utf8")
      );
      if (
        metadata.userId !== userId.toString() ||
        metadata.resumeId !== resumeId.toString()
      ) {
        throw new ApiError(404, "Resume preview not found");
      }
      await fs.rm(outputDir, { recursive: true, force: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
  }

  async cleanupExpiredPreviews() {
    await fs.mkdir(previewRoot, { recursive: true });
    const entries = await fs.readdir(previewRoot, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const outputDir = path.join(previewRoot, entry.name);
      let expiresAt;
      try {
        const metadata = JSON.parse(
          await fs.readFile(path.join(outputDir, "metadata.json"), "utf8")
        );
        expiresAt = new Date(metadata.expiresAt).getTime();
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        const stats = await fs.stat(outputDir);
        expiresAt = stats.mtimeMs + previewLifetimeMs;
      }
      if (expiresAt <= Date.now()) {
        await fs.rm(outputDir, { recursive: true, force: true });
      }
    }
  }
}

const renderService = new RenderService();
renderService.cleanupExpiredPreviews().catch((error) => {
  logger.error({ err: error }, "Could not clean expired resume previews at startup");
});
const cleanupTimer = setInterval(() => {
  renderService.cleanupExpiredPreviews().catch((error) => {
    logger.error({ err: error }, "Could not clean expired resume previews");
  });
}, 5 * 60 * 1000);
cleanupTimer.unref();

export default renderService;
