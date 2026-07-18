import { Router } from "express";

import authController from "./auth.controller.js";
import authenticate from "../../../middlewares/authenticate.middleware.js";
import {validate} from "../../../middlewares/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

const router = Router();

/**
 * Public Routes
 */

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

/**
 * Protected Routes
 */

router.post(
  "/logout",
  authenticate,
  authController.logout
);

router.get(
  "/me",
  authenticate,
  authController.me
);


export default router;