import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const getDbClient = () => {
  const pool = postgres(process.env.SUPABASE_DB_CONNECTION_STRING, {
    prepare: false,
  });

  const db = drizzle(pool, { schema });

  return db;
};

export type DB = ReturnType<typeof getDbClient>;
