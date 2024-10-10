import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const getDbClient = () => {
  const pool = postgres(import.meta.env.SUPABASE_DB_CONNECTION_STRING);

  const db = drizzle(pool, { schema });

  return db;
};

export type DB = ReturnType<typeof getDbClient>;
