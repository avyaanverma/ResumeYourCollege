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
  CLIENT_URL: z.string().url().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z.enum(['true', 'false']).default('false'),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
}).refine(
  ({ SMTP_USER, SMTP_PASSWORD }) =>
    Boolean(SMTP_USER) === Boolean(SMTP_PASSWORD),
  {
    message: 'SMTP_USER and SMTP_PASSWORD must be configured together',
    path: ['SMTP_PASSWORD'],
  }
);

const result = envSchema.safeParse(process.env);

if (!result.success) {
  logger.error(
    { errors: result.error.flatten().fieldErrors },
    'Invalid environment variables'
  );
  process.exit(1);
}

export default result.data;
