import mongoose from 'mongoose';
import logger from '../logger/pino.js';

async function connectToDB(url) {
  try {
    await mongoose.connect(url);
    logger.info('Database connected');
  } catch (error) {
    logger.error({ err: error }, 'Database connection failed');
  }
}

export default connectToDB;
