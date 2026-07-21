import jwt from "jsonwebtoken";

import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import userRepository from "../repository/user.repository.js";
import logger from "../logger/pino.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;
  logger.info(req)
  // Cookie
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // Authorization Header
  if (
    !token &&
    req.headers.authorization?.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  } catch (error) {
  console.log("JWT VERIFY ERROR:", error);
  throw new ApiError(401, "Invalid or expired token");
} 

  const user = await userRepository.findById(decoded._id);
  console.log(decoded);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account has been disabled");
  }

  req.user = user;

  next();
});

export default authenticate;
