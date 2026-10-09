import { Router } from "express";

import resumeRoutes from "./resume/resume.routes.js";
import promptRoutes from "./prompt.routes.js";

const router = Router();

router.use("/resumes", resumeRoutes);
router.use("/prompt", promptRoutes);

export default router;