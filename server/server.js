import createApp from './src/app.js';
import env from './config/env.js';
import connectToDB from './db/db.js';

const startServer = () => {
  const server = createApp();
  connectToDB(env.MONGO_URI);
  server.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
