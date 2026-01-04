import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL_POSTGRESQL || process.env.DATABASE_URL || "",
  },
  seed: {
    script: "tsx prisma/seed.ts",
  },
});

