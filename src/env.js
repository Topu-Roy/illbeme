import { createEnv } from "@t3-oss/env-nextjs";
import { enum as enum_, string, url } from "zod";

export const env = createEnv({
  server: {
    // Environment
    NODE_ENV: enum_(["development", "test", "production"]).default("development"),

    // DB
    DATABASE_URL: url(),

    // AI
    GOOGLE_GENERATIVE_AI_API_KEY: string().nonempty(),

    // Auth
    BETTER_AUTH_SECRET: string().nonempty(),
    BETTER_AUTH_URL: url(),
    BETTER_AUTH_GITHUB_CLIENT_ID: string().nonempty(),
    BETTER_AUTH_GITHUB_CLIENT_SECRET: string().nonempty(),
  },
  client: {},
  runtimeEnv: {
    // Environment
    NODE_ENV: process.env.NODE_ENV,

    // DB
    DATABASE_URL: process.env.DATABASE_URL,

    // AI
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,

    // Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_GITHUB_CLIENT_ID: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
    BETTER_AUTH_GITHUB_CLIENT_SECRET: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
