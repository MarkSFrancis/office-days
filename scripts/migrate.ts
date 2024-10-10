import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import drizzleConfig from './drizzle-kit.config';

// Runs all pending DB migrations
// To create new migrations, use `npm run db generate`

const sql = postgres(process.env.DRIZZLE_KIT_CONNECTION_STRING as string, {
  max: 1,
});

const db = drizzle(sql, { logger: true });
await migrate(db, { migrationsFolder: drizzleConfig.out as string });
await sql.end();
