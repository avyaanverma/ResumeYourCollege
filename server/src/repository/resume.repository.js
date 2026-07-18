import Resume from "../model/resume.model.js";

class ResumeRepository {
  async create(data) {
    return await Resume.create(data);
  }

  async findById(id) {
    return await Resume.findById(id);
  }

  async findByIdAndOwner(resumeId, ownerId) {
    return await Resume.findOne({
      _id: resumeId,
      owner: ownerId,
    });
  }

  async findAllByOwner(ownerId) {
    return await Resume.find({
      owner: ownerId,
    }).sort({
      updatedAt: -1,
    });
  }

  async updateById(resumeId, updateData) {
    return await Resume.findByIdAndUpdate(
      resumeId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async deleteById(resumeId) {
    return await Resume.findByIdAndDelete(resumeId);
  }

  async exists(resumeId, ownerId) {
    return await Resume.exists({
      _id: resumeId,
      owner: ownerId,
    });
  }

  async updateSection(resumeId, section, data) {
    return await Resume.findByIdAndUpdate(
      resumeId,
      {
        [section]: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async changeVisibility(resumeId, visibility) {
    return await Resume.findByIdAndUpdate(
      resumeId,
      {
        visibility,
      },
      {
        new: true,
      }
    );
  }

  async changeTemplate(resumeId, template) {
    return await Resume.findByIdAndUpdate(
      resumeId,
      {
        template,
      },
      {
        new: true,
      }
    );
  }
}

export default new ResumeRepository();