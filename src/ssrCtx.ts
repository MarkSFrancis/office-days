import { DB, getDbClient } from '~/db/client';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { lazyInit } from '~/lib/lazyInit';
import {
  CookieOptions,
  createServerClient,
  parseCookieHeader,
} from '@supabase/ssr';
import { getWebRequest, setCookie } from 'vinxi/http';

export interface Ctx {
  readonly db: DB;
}

const ctxStore = new AsyncLocalStorage<Ctx>();

export const runWithCtx = <T>(fn: () => T) => {
  const lazyDb = lazyInit(() => getDbClient());

  return ctxStore.run(
    {
      get db() {
        return lazyDb();
      },
    },
    fn
  );
};

export const tryGetCtx = () => ctxStore.getStore();
export const getCtx = () => {
  const ctx = tryGetCtx();
  if (!ctx) throw new Error('No ctx found');

  return ctx;
};

export interface AuthCtx {
  readonly supabase: SupabaseClient;
  readonly user: User;
}

const authCtxStore = new AsyncLocalStorage<AuthCtx>();

export const ssrWithAuthCtx = async <T>(fn: () => T) => {
  const cookie = parseCookieHeader(getWebRequest().headers.get('Cookie') ?? '');

  const supabase = createServerClient(
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  return authCtxStore.run(
    {
      supabase,
      user,
    },
    fn
  );
};

export const getSsrCurrentUser = () => getSsrAuthCtx().user;

export const tryGetSsrAuthCtx = () => authCtxStore.getStore();
export const getSsrAuthCtx = () => {
  const ctx = tryGetSsrAuthCtx();
  if (!ctx) throw new Error('No auth ctx found');

  return ctx;
};
