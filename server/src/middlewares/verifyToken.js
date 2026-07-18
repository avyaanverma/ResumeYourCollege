import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie (you could also use Authorization header)
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded._id; // Attach user ID to request for protected routes
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    return next(new ApiError(401, 'Access denied. Invalid token.'));
  }
};
