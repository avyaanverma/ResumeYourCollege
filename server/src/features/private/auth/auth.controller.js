// src/modules/public/auth/controller/auth.controller.js
import authService from "./auth.service.js";
import asyncHandler from "../../../../utils/asyncHandler.js";
import ApiResponse from "../../../../utils/ApiResponse.js";
import env from "../../../../config/env.js";
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } =
      await authService.register(req.body);

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

    const { user, accessToken, refreshToken } =
      await authService.login(email, password);

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

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);

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