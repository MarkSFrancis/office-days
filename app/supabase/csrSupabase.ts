import { createBrowserClient } from '@supabase/ssr';

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );
};
