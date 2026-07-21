import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../../../../config/env.js";
import ApiError from "../../../../utils/ApiError.js";
import userRepository from "../../../../repository/user.repository.js";

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

    const accessToken = this.generateAccessToken(user._id);

    const refreshToken = this.generateRefreshToken(user._id);

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

    const accessToken = this.generateAccessToken(user._id);

    const refreshToken = this.generateRefreshToken(user._id);

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

  generateAccessToken(userId) {
    return jwt.sign(
      {
        id: userId,
      },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      {
        id: userId,
      },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      }
    );
  }
}

export default new AuthService();