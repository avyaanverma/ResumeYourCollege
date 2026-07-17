import createApp from './src/app.js';
import env from './src/config/env.js';
import connectToDB from './src/db/db.js';
import logger from './src/logger/pino.js';

const startServer = () => {
  const server = createApp();
  connectToDB(env.MONGO_URI);
  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'Server listening');
  });
};

startServer();
