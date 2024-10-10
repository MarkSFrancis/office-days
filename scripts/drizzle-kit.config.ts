import './loadEnv';
import { defineConfig } from 'drizzle-kit';
import { config } from '../drizzle.config';

export default defineConfig({
  ...config,
  dbCredentials: {
    url: process.env.DRIZZLE_KIT_CONNECTION_STRING as string,
  },
});
