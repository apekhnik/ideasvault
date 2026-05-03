import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/ideas';

// Берем любую из возможных переменных
const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

// "Умная" очистка: ищем только ту часть, которая начинается с postgres:// или postgresql://
// и заканчивается до первого пробела или кавычки.
const match = rawUrl.match(/postgres(?:ql)?:\/\/[^\s"']+/);
const connectionString = match ? match[0] : "";

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.error("❌ CRITICAL: DATABASE_URL is malformed or missing!");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { schema };
