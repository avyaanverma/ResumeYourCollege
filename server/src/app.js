import express from 'express';
import pinoHttp from 'pino-http';
import logger from './logger/pino.js';
import securityMiddleware from './middlewares/securityMiddleware.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import { appConstants } from './constants/appConstants.js';
import authRoutes from "./features/public/auth/auth.routes.js"

const createApp = () => {
  const app = express();
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/metrics',
      },
    })
  );
  securityMiddleware(app);

  app.use(`${appConstants.API_PREFIX}/public/auth`, authRoutes)

  app.use(errorMiddleware);

  return app;
};


export default createApp;
