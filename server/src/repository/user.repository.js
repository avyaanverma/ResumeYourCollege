import User from "../model/user.model.js";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id).select("-password -refreshToken");
  }

  async findByEmail(email) {
    return await User.findOne({
      email: email.toLowerCase(),
    }).select("+password +refreshToken");
  }

  async findPublicByEmail(email) {
    return await User.findOne({
      email: email.toLowerCase(),
    });
  }

  async updateById(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async updateRefreshToken(id, refreshToken) {
    return await User.findByIdAndUpdate(
      id,
      { refreshToken },
      { new: true }
    ).select("+refreshToken");
  }

  async clearRefreshToken(id) {
    return await User.findByIdAndUpdate(
      id,
      { refreshToken: null },
      { new: true }
    );
  }

  async updateLastLogin(id) {
    return await User.findByIdAndUpdate(
      id,
      { lastLogin: new Date() },
      { new: true }
    );
  }

  async verifyEmail(id) {
    return await User.findByIdAndUpdate(
      id,
      { isEmailVerified: true },
      { new: true }
    );
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  async existsByEmail(email) {
    return await User.exists({
      email: email.toLowerCase(),
    });
  }
}

export default new UserRepository();