import ResumeService from "./resume.service.js";
import RenderService from "./render/render.service.js";
import AIResumeService from "./aiResume.service.js";
import fs from "node:fs/promises";
import path from "node:path";

import {asyncHandler} from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";

class ResumeController {
  createResume = asyncHandler(async (req, res) => {
    const resume = await ResumeService.createResume(
      req.user._id,
      req.body
    );

    res.status(201).json(
      new ApiResponse(
        201,
        resume,
        "Resume created successfully"
      )
    );
  });

  getAllResumes = asyncHandler(async (req, res) => {
    const resumes = await ResumeService.getAllResumes(
      req.user._id
    );

    res.status(200).json(
      new ApiResponse(
        200,
        resumes,
        "Resumes fetched successfully"
      )
    );
  });

  getResumeById = asyncHandler(async (req, res) => {
    const resume = await ResumeService.getResumeById(
      req.params.id,
      req.user._id
    );

    res.status(200).json(
      new ApiResponse(
        200,
        resume,
        "Resume fetched successfully"
      )
    );
  });

  updateResume = asyncHandler(async (req, res) => {
    const resume = await ResumeService.updateResume(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json(
      new ApiResponse(
        200,
        resume,
        "Resume updated successfully"
      )
    );
  });

  deleteResume = asyncHandler(async (req, res) => {
    await ResumeService.deleteResume(
      req.params.id,
      req.user._id
    );

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Resume deleted successfully"
      )
    );
  });

  createAIResume = asyncHandler(async (req, res) => {
    const resume = await AIResumeService.createFromPrompt(
      req.user._id,
      req.body.prompt
    );
    res.status(201).json(
      new ApiResponse(201, resume, "AI resume created successfully")
    );
  });

  createPreview = asyncHandler(async (req, res) => {
    const preview = await RenderService.createPreview(
      req.params.id,
      req.user._id
    );
    res.status(201).json(
      new ApiResponse(201, preview, "Resume preview generated")
    );
  });

  getPreview = asyncHandler(async (req, res) => {
    const pdfPath = await RenderService.getPreviewPdf(
      req.params.previewId,
      req.params.id,
      req.user._id
    );
    res.set("Cache-Control", "private, no-store");
    res.type("application/pdf");
    return res.sendFile(pdfPath);
  });

  deletePreview = asyncHandler(async (req, res) => {
    await RenderService.deletePreview(
      req.params.previewId,
      req.params.id,
      req.user._id
    );
    res.status(200).json(
      new ApiResponse(200, null, "Resume preview deleted")
    );
  });

  exportPDF = asyncHandler(async (req, res, next) => {

    const { pdfPath, resume } = await RenderService.exportPDF(
        req.params.id,
        req.user._id
    );

    const safeName = (resume.personal.fullName || resume.title || "resume")
      .replace(/[^a-z0-9 _-]/gi, "")
      .trim()
      .replace(/\s+/g, "-");
    res.download(pdfPath, `${safeName || "resume"}-resume.pdf`, (error) => {
      fs.rm(path.dirname(pdfPath), {
        recursive: true,
        force: true,
      }).catch((cleanupError) => {
        req.log.error({ err: cleanupError }, "Could not remove temporary PDF export");
      });
      if (error && !res.headersSent) next(error);
      else if (error) req.log.error({ err: error }, "PDF download failed after response started");
    });

});
}

export default new ResumeController();
