import { createEnv } from "@t3-oss/env-nextjs";
import { enum as enum_, string, url } from "zod/v4";

export const env = createEnv({
  server: {
    // Auth
    BETTER_AUTH_SECRET: process.env.NODE_ENV === "production" ? string() : string().optional(),
    BETTER_AUTH_GITHUB_CLIENT_ID: string().nonempty(),
    BETTER_AUTH_GITHUB_CLIENT_SECRET: string().nonempty(),

    // Database
    DATABASE_URL: url().nonempty(),

    // AI API
    GOOGLE_GENERATIVE_AI_API_KEY: string().nonempty(),

    // Environment
    NODE_ENV: enum_(["development", "test", "production"]).default("development"),
  },

  client: {},

  runtimeEnv: {
    // Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_GITHUB_CLIENT_ID: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
    BETTER_AUTH_GITHUB_CLIENT_SECRET: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // AI API
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,

    // Environment
    NODE_ENV: process.env.NODE_ENV,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
