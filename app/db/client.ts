import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { AppLoadContext } from '@remix-run/cloudflare';

export const getDbClient = (context: AppLoadContext) => {
  const db = drizzle({
    schema,
    connection: {
      url: context.cloudflare.env.SUPABASE_DB_CONNECTION_STRING,
      max: 10,
    },
  });

  return db;
};

export type DB = ReturnType<typeof getDbClient>;