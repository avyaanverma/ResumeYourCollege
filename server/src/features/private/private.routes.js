import { Router } from "express";

import resumeRoutes from "./resume/resume.routes.js";

const router = Router();

router.use("/resumes", resumeRoutes);

export default router;