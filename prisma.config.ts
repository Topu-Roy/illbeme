import "dotenv/config";
import { defineConfig, env as prismaEnv } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: prismaEnv("DATABASE_URL"),
  },
});
