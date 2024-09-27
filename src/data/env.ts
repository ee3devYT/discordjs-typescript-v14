import { z } from "zod";

const envSchema = z.object({
    TOKEN: z.string(),
    APPLICATION_ID: z.string(),
    GUILD_ID: z.string(),
    MONGO_DB_URI: z.string().url(),
    PRIVATE_COMMAND_USER_IDS: z.string().transform((ids) => ids.split(',')),
    WEBHOOK_URL: z.string().url(),
    REDIS_URI: z.string().url(),
});

envSchema.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv 
        extends z.infer<typeof envSchema> {}
    }
}
