import {
  CookieOptions,
  createServerClient,
  parseCookieHeader,
} from '@supabase/ssr';
import { getWebRequest, setCookie } from 'vinxi/server';

export const createSupabaseServerClient = () => {
  const cookie = parseCookieHeader(getWebRequest().headers.get('Cookie') ?? '');

  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY,
    {
      cookies: {
        getAll: () => cookie,
        setAll: (newCookies) =>
          newCookies.forEach(({ name, value, options }) => {
            let sameSite: CookieOptions['sameSite'];
            if (typeof options.sameSite === 'boolean') {
              sameSite = options.sameSite ? 'strict' : undefined;
            } else {
              sameSite = options.sameSite;
            }

            setCookie(name, value, {
              ...options,
              sameSite,
            });
          }),
      },
    }
  );
};

export type SupabaseServerClient = ReturnType<
  typeof createSupabaseServerClient
>;
