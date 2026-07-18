import ResumeRepository from "../../../repository/resume.repository.js";

import ApiError from "../../../utils/ApiError.js";

import validateResumeSection from "./validateResumeSection.js";

class ResumeService {
  async createResume(userId, payload) {
    const resume = await ResumeRepository.create({
      owner: userId,
      title: payload.title ?? "Untitled Resume",
      template: payload.template ?? "modern",
    });

    return resume;
  }

  async getAllResumes(userId) {
    return await ResumeRepository.findAllByOwner(userId);
  }

  async getResumeById(resumeId, userId) {
    const resume = await ResumeRepository.findByIdAndOwner(
      resumeId,
      userId
    );

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    return resume;
  }

  async updateResume(resumeId, userId, payload) {
    const resume = await ResumeRepository.findByIdAndOwner(
      resumeId,
      userId
    );

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    const { section, data } = payload;

    const validatedData = validateResumeSection(
      section,
      data
    );

    return await ResumeRepository.updateSection(
      resumeId,
      section,
      validatedData
    );
  }

  async deleteResume(resumeId, userId) {
    const resume = await ResumeRepository.findByIdAndOwner(
      resumeId,
      userId
    );

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    await ResumeRepository.deleteById(resumeId);

    return true;
  }
}

export default new ResumeService();