import { type PlatformProxy } from 'wrangler';

// .dev.vars and other bindings
interface Env {
  SUPABASE_DB_CONNECTION_STRING: string;
  DRIZZLE_KIT_CONNECTION_STRING: string;
  SUPABASE_SERVICE_KEY: string;
}

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
