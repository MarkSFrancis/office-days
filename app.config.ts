import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
    rollupConfig: {
      external: ['cloudflare:sockets'],
    },
  },
});
