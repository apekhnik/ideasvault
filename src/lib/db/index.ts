import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/ideas';

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | null = null;

function createDb(): Db {
  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
  const match = rawUrl.match(/postgres(?:ql)?:\/\/[^\s"']+/);
  const connectionString = match ? match[0] : "";
  return drizzle(neon(connectionString), { schema });
}

// Lazy proxy — neon() is only called on the first actual query, not at module load time
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    if (!_db) _db = createDb();
    return (_db as never)[prop];
  },
});

export { schema };
