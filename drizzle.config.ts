import { Config, defineConfig } from 'drizzle-kit';

export const config = {
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  migrations: {
    prefix: 'supabase',
  },
  schemaFilter: ['public'],
  out: './src/db/migrations',
} satisfies Config;

export default defineConfig(config);
