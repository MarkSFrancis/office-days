/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

namespace NodeJS {
  // Used for scripts outside of Remix, such as databae migrations
  // Do not use `process.env` in Remix code. Use `context.cloudflare.env` instead.
  interface ProcessEnv {
    // .dev.vars
    DRIZZLE_KIT_CONNECTION_STRING: string;
    SUPABASE_SERVICE_KEY: string;
  }
}
