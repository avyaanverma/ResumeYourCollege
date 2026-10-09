import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

import env from "../../../config/env.js";
import logger from "../../../logger/pino.js";
import ApiError from "../../../utils/ApiError.js";
import userRepository from "../../../repository/user.repository.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt.utils.js";

class AuthService {
  async forgotPassword(email) {
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_FROM) {
      throw new ApiError(503, "Password reset email is not configured");
    }

    const user = await userRepository.findPublicByEmail(email);
    if (!user) return;

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await userRepository.setPasswordResetToken(user.email, tokenHash, expiresAt);

    const resetUrl = new URL("/reset-password", env.CLIENT_URL || env.CORS_ORIGIN.split(",")[0].trim());
    resetUrl.searchParams.set("token", token);

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE === "true",
      ...(env.SMTP_USER && env.SMTP_PASSWORD
        ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } }
        : {}),
    });

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: user.email,
        subject: "Reset your ResumeYourCollege password",
        text: `Use this link to reset your password within one hour:\n\n${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Use the link below to reset your password within one hour.</p><p><a href="${resetUrl.toString()}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (error) {
      await userRepository.clearPasswordResetToken(user.email);
      logger.error(
        { errorCode: error.code || "SMTP_SEND_FAILED" },
        "Password reset email delivery failed"
      );
      throw new ApiError(502, "Could not send the password reset email");
    }
  }

  async resetPassword(token, password) {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userRepository.resetPassword(tokenHash, hashedPassword);

    if (!user) {
      throw new ApiError(400, "This password reset link is invalid or expired");
    }
  }

  async register(payload) {
    const {
      firstName,
      lastName,
      email,
      password,
    } = payload;

    const existingUser = await userRepository.existsByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    await userRepository.updateRefreshToken(
      user._id,
      refreshToken
    );

    return {
      user: await userRepository.findById(user._id),
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    await userRepository.updateRefreshToken(
      user._id,
      refreshToken
    );

    await userRepository.updateLastLogin(user._id);

    return {
      user: await userRepository.findById(user._id),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
  }

}

export default new AuthService();