import express from 'express';

const createApp = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.json({
      message: 'Server working fine.',
    });
  });

  return app;
};

export default createApp;
