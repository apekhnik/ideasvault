import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/ideas';

// На этапе сборки Vercel переменная может отсутствовать.
// Мы не выбрасываем ошибку сразу, чтобы билд прошел успешно.
const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
