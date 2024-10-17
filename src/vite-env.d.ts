/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Entries from .env that are prefixed with `VITE_` and are therefore public

  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

namespace NodeJS {
  interface ProcessEnv {
    // Entries from .env that are _not_ prefixed with `VITE_` and are therefore secrets

    SUPABASE_DB_CONNECTION_STRING: string;
    DRIZZLE_KIT_CONNECTION_STRING: string;
  }
}
