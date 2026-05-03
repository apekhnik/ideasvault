import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/ideas';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ DATABASE_URL is missing. Database will not work.");
}

const sql = neon(connectionString || "");
export const db = drizzle(sql, { schema });
