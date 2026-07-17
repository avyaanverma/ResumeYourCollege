import { config } from 'dotenv';
import { z } from 'zod';
import {appConstants} from "../constants/index.js"
config();

const envSchema = z.object({
  PORT: z.coerce.number().default(appConstants.DEFAULT_PORT),
  MONGO_URI: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.log('❌Invalid environment variables');
  console.log(result.error.flatten().fieldErrors);
  process.exit(1);
}

export default result.data;
