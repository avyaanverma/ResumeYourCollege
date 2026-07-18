import jwt from 'jsonwebtoken';
import env from "../config/env.js"
export const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ _id: userId }, env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};
