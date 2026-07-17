import express from 'express';
import pinoHttp from 'pino-http';
import logger from './logger/pino.js';
import securityMiddleware from './middlewares/securityMiddleware.js';

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

  app.get('/', (req, res) => {
    res.json({
      message: 'Server working fine.',
    });
  });

  return app;
};

export default createApp;
