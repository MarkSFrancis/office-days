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

            try {
              // Operation will fail if the web request has already started to be processed
              setCookie(name, value, {
                ...options,
                sameSite,
              });
            } catch (err) {
              if (err instanceof Error && 'code' in err) {
                if (err.code === 'ERR_HTTP_HEADERS_SENT') {
                  console.info(
                    'Failed to set cookie because the headers have already been sent'
                  );
                  return;
                }
              } else {
                console.error('Error setting cookie', err);
              }
            }
          }),
      },
    }
  );
};

export type SupabaseServerClient = ReturnType<
  typeof createSupabaseServerClient
>;
