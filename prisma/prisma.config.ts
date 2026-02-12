import { defineConfig } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local', override: true });

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL!,
    },
  },
});
