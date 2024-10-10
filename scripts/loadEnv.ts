import { loadEnv } from 'vite';

process.env = {
  ...process.env,
  ...loadEnv('development', process.cwd(), ''),
};
