import {config} from "dotenv";
import {z} from "zod";
config();

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    MONGO_URI: z.string().default("Nothing")
});

const result = envSchema.safeParse(process.env);

if(!result.success){
    console.log("❌Invalid environment variables");
    process.exit(1);
}

export default result.data;