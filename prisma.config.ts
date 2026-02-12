import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load environment variables from .env.local (takes precedence)
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "",
    shadowDatabaseUrl: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
