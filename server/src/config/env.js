import { config } from 'dotenv';
import { z } from 'zod';
import { appConstants } from '../constants/index.js';
import logger from '../logger/pino.js';
config({ quiet: true });

const envSchema = z.object({
  PORT: z.coerce.number().default(appConstants.DEFAULT_PORT),
  MONGO_URI: z.string(),
  NODE_ENV: z.string().default(appConstants.NODE_ENV.DEVELOPMENT),
  PAYLOAD_LIMIT: z.string().default(appConstants.SECURITY.PAYLOAD_LIMIT),
  CORS_ORIGIN: z.string().default(appConstants.SECURITY.CORS_ORIGIN),
  ACCESS_TOKEN_SECRET: z.string(),

  REFRESH_TOKEN_SECRET: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  logger.error(
    { errors: result.error.flatten().fieldErrors },
    'Invalid environment variables'
  );
  process.exit(1);
}

export default result.data;
