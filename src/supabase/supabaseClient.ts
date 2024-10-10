import { createBrowserClient } from '@supabase/ssr';

export const supabaseClient = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
