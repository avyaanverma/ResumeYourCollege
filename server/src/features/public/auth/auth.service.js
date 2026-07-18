import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../../../config/env.js";
import ApiError from "../../../utils/ApiError.js";
import userRepository from "../../../repository/user.repository.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt.utils.js";

class AuthService {
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
      user,
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
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
  }

}

export default new AuthService();