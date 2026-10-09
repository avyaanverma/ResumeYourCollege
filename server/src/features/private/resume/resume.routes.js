import { Router } from "express";

import ResumeController from "./resume.controller.js";

import authenticate from "../../../middlewares/authenticate.middleware.js";
import {validate} from "../../../middlewares/validate.middleware.js";

import {
  createResumeSchema,
  updateResumeSchema,
} from "./resume.validation.js";
import { previewParamsSchema } from "./preview.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Resume CRUD
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  validate(createResumeSchema),
  ResumeController.createResume
);

router.get(
  "/",
  authenticate,
  ResumeController.getAllResumes
);

router.post(
  "/:id/preview",
  authenticate,
  validate(previewParamsSchema),
  ResumeController.createPreview
);

router.get(
  "/:id/preview/:previewId/pdf",
  authenticate,
  validate(previewParamsSchema),
  ResumeController.getPreview
);

router.delete(
  "/:id/preview/:previewId",
  authenticate,
  validate(previewParamsSchema),
  ResumeController.deletePreview
);

router.get(
  "/:id",
  authenticate,
  ResumeController.getResumeById
);

router.patch(
  "/:id",
  authenticate,
  validate(updateResumeSchema),
  ResumeController.updateResume
);

router.delete(
  "/:id",
  authenticate,
  ResumeController.deleteResume
);

router.get(
    "/:id/export/pdf",
    authenticate,
    ResumeController.exportPDF
);


export default router;