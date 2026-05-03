import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!dbUrl) {
  console.error("❌ Ошибка: DATABASE_URL или POSTGRES_URL не найдены в .env.local");
}

export default defineConfig({
  schema: './src/lib/db/schema/ideas.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl!,
  },
});
