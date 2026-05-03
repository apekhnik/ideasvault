import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/ideas';

const connectionString = process.env.DATABASE_URL;

// Создаем функцию для получения инстанса БД, чтобы не инициализировать его сразу при билде
const createDb = () => {
  if (!connectionString) {
    // Возвращаем прокси или заглушку, которая упадет только при реальном вызове
    return {} as any;
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
};

export const db = createDb();
