import { Router } from "express";
import rateLimit from "express-rate-limit";

import ResumeController from "./resume/resume.controller.js";
import { aiResumeRequestSchema } from "./resume/aiResume.validation.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();
const promptLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => req.user._id.toString(),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "AI resume limit reached. Please try again later." },
});

router.post(
  "/",
  authenticate,
  promptLimiter,
  validate(aiResumeRequestSchema),
  ResumeController.createAIResume
);

export default router;
