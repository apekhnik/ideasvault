import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/ideas';

// Позволяет Neon работать в разных окружениях стабильнее
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  if (process.env.NODE_ENV === 'production') {
    console.warn("⚠️ DATABASE_URL is missing!");
  }
}

const sql = neon(connectionString || "");
export const db = drizzle(sql, { schema });
export { schema };
