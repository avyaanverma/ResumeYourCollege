// src/modules/public/auth/controller/auth.controller.js
import authService from "./auth.service.js";
import {asyncHandler} from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import env from "../../../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
  register = asyncHandler(async (req, res) => {
    req.log.info("Registration request received");

    const { user, accessToken, refreshToken } =
      await authService.register(req.body);

    req.log.info("Registration completed successfully");

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(201)
      .json(
        new ApiResponse(
          201,
          {
            user,
            accessToken,
          },
          "User registered successfully"
        )
      );
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    req.log.info("Login request received");

    const { user, accessToken, refreshToken } =
      await authService.login(email, password);

    req.log.info("Login completed successfully");

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            user,
            accessToken,
          },
          "Login successful"
        )
      );
  });

  forgotPassword = asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "If an account exists for that email, a reset link has been sent"
      )
    );
  });

  resetPassword = asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.password);
    res.status(200).json(
      new ApiResponse(200, null, "Password reset successfully")
    );
  });

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Logout successful"
        )
      );
  });

  me = asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse(
        200,
        req.user,
        "Current user fetched successfully"
      )
    );
  });
}

export default new AuthController();