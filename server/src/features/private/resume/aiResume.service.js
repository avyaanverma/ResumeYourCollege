import { generateText, Output } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

import env from "../../../config/env.js";
import logger from "../../../logger/pino.js";
import ApiError from "../../../utils/ApiError.js";
import ResumeService from "./resume.service.js";
import validateResumeSection from "./validateResumeSection.js";
import { generatedResumeSchema } from "./aiResume.validation.js";

const nonResumeTask = /\b(?:solve|answer|explain|debug)\b[\s\S]{0,80}\b(?:dsa|leetcode|coding challenge|algorithm problem)\b/i;

const generatedPromptSchema = generatedResumeSchema.extend({
  title: z.string().trim().min(1).max(100),
});

const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

class AIResumeService {
  async createFromPrompt(userId, prompt) {
    if (!/\b(resume|cv|curriculum vitae)\b/i.test(prompt) || nonResumeTask.test(prompt)) {
      throw new ApiError(400, "This assistant only creates resumes. Ask for a resume or CV, not answers to unrelated tasks.");
    }

    if (!env.GROQ_API_KEY) {
      throw new ApiError(503, "AI resume generation is not configured on the server");
    }

    let generated;
    try {
      ({ output: generated } = await generateText({
        model: groq(env.GROQ_MODEL),
        output: Output.object({ schema: generatedPromptSchema }),
        maxRetries: 1,
        maxOutputTokens: 5000,
        abortSignal: AbortSignal.timeout(45_000),
        system: [
          "Create a professional resume as structured data matching the supplied schema.",
          "Use only personal and career facts explicitly provided by the user; never invent names, contact details, employers, degrees, dates, metrics, or credentials.",
          "If a section has no factual source material, return an empty string or empty array for that section.",
          "Only include education and experience entries when all required facts, including valid YYYY-MM-DD dates, are available.",
          "Keep the output focused on resume content. Never answer unrelated requests.",
        ].join(" "),
        prompt,
      }));
    } catch (error) {
      logger.error(
        {
          errorName: error.name || "AIProviderError",
          errorCode: error.code,
          statusCode: error.statusCode,
        },
        "Groq resume generation failed"
      );
      throw new ApiError(502, "Groq could not generate a valid resume. Please revise your prompt and try again.");
    }

    const sections = {};
    if (generated.personal.fullName || generated.personal.email) {
      sections.personal = validateResumeSection("personal", generated.personal);
    }
    if (generated.summary.trim()) {
      sections.summary = validateResumeSection("summary", generated.summary);
    }

    for (const section of [
      "education",
      "experience",
      "projects",
      "skills",
      "certifications",
      "achievements",
      "languages",
    ]) {
      if (generated[section].length) {
        sections[section] = validateResumeSection(section, generated[section]);
      }
    }

    const resume = await ResumeService.createResume(userId, {
      title: generated.title,
      template: "modern",
    });

    try {
      for (const [section, data] of Object.entries(sections)) {
        await ResumeService.updateResume(resume._id, userId, { section, data });
      }
      return await ResumeService.getResumeById(resume._id, userId);
    } catch (error) {
      try {
        await ResumeService.deleteResume(resume._id, userId);
      } catch (cleanupError) {
        logger.error(
          { err: cleanupError, resumeId: resume._id },
          "Could not remove partially generated AI resume"
        );
      }
      throw error;
    }
  }
}

export default new AIResumeService();
