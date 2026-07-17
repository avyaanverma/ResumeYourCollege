import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { StatusCodes } from 'http-status-codes';
import env from '../config/env.js';
import { appConstants } from '../constants/index.js';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) =>
  origin.trim()
);

const securityMiddleware = (app) => {
  app.set(
    'trust proxy',
    env.NODE_ENV === appConstants.NODE_ENV.PRODUCTION ? 1 : false
  );

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        const isAllowed = !origin || allowedOrigins.includes(origin);
        callback(null, isAllowed);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(compression());
  app.use(express.json({ limit: env.PAYLOAD_LIMIT, strict: true }));
  app.use(express.urlencoded({ extended: false, limit: env.PAYLOAD_LIMIT }));
  app.use(cookieParser());
  app.use(hpp());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      skip: (req) => req.path === '/health' || req.path === '/metrics',
      handler: (_req, res) => {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
          message: 'Too many requests. Please try again later.',
        });
      },
    })
  );
};

export default securityMiddleware;
