import { defineWorkspace } from 'vitest/config';
import { type LaunchOptions } from 'playwright';
import solid from 'vite-plugin-solid';

export default defineWorkspace([
  {
    // Runs tests in node
    // Faster but should not be used for solid or browser tests
    // Use the `.ts` extension when writing these tests
    test: {
      name: 'node',
      include: ['**/*.test.ts'],
      exclude: ['node_modules/**'],
      environment: 'node',
    },
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
  {
    // Runs tests in the browser
    // Slower but great for solid or browser tests
    // Use the `.tsx` extension when writing these tests
    plugins: [solid()],
    test: {
      name: 'browser',
      include: ['**/*.test.tsx'],
      exclude: ['node_modules/**'],
      setupFiles: ['./src/lib/testUtils/browserSetup.ts'],
      browser: {
        api: {
          // Avoids conflicts with the vite app
          port: 5200,
        },
        name: 'chromium',
        providerOptions: {
          launch: {} satisfies LaunchOptions,
        },
        enabled: true,
        provider: 'playwright',
        // Switch this to `false` if you want to see the tests running in the browser
        headless: true,
      },
    },
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
]);
