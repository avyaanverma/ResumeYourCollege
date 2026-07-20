import ResumeService from "./resume.service.js";
import RenderService from "./render/render.service.js";

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


    exportPDF = asyncHandler(async (req, res) => {

    const pdfPath = await RenderService.exportPDF(
        req.params.id,
        req.user._id
    );

    const resume = await ResumeService.getResumeById(req.params.id, req.user._id);
    const safeName = (resume.personal.fullName || resume.title || "resume")
      .replace(/[^a-z0-9 _-]/gi, "")
      .trim()
      .replace(/\s+/g, "-");
    res.download(pdfPath, `${safeName || "resume"}-resume.pdf`);

});
}

export default new ResumeController();
