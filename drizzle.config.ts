import { Config, defineConfig } from 'drizzle-kit';

export const config = {
  schema: './app/db/schema.ts',
  dialect: 'postgresql',
  migrations: {
    prefix: 'supabase',
  },
  schemaFilter: ['public'],
  out: './app/db/migrations',
} satisfies Config;

export default defineConfig(config);
