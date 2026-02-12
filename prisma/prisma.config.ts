import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local', override: true });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    shadowDatabaseUrl: process.env.DIRECT_URL,
  },
});
