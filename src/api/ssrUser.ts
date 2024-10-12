'use server';
import { setSsrContext, tryGetSsrContext } from './middlewareFactory';
import { AuthSessionMissingError, UserResponse } from '@supabase/supabase-js';
import { redirect } from '@solidjs/router';
import { getUrl } from '~/lib/apiEnv';
import { getSupabaseClient } from '~/supabase/supabase';

const shouldAskUserToLogin = (userResponse: UserResponse) => {
  if (userResponse.error) {
    if (userResponse.error instanceof AuthSessionMissingError) {
      return true;
    }

    // @see https://supabase.com/docs/guides/auth/debugging/error-codes#auth-error-codes-table
    // ^ Look for error code descriptions that say something like "Ask the user"

    switch (userResponse.error.code) {
      case 'anonymous_provider_disabled':
      case 'flow_state_not_found':
      case 'flow_state_expired':
      case 'insufficient_aal':
      case 'otp_expired':
      case 'reauthentication_needed':
      case 'reauthentication_not_valid':
      case 'saml_provider_disabled':
      case 'saml_relay_state_expired':
      case 'saml_relay_state_not_found':
      case 'session_not_found':
      case 'user_not_found':
        return true;
      default:
        return false;
    }
  }

  if (userResponse.data.user.is_anonymous) {
    return true;
  }

  return false;
};

const MIDDLEWARE_KEY = 'auth';

export const tryGetSsrUser = async () => {
  const ctx = tryGetSsrContext<UserResponse>(MIDDLEWARE_KEY);

  if (!ctx) {
    const user = await getSupabaseClient().auth.getUser();
    setSsrContext(MIDDLEWARE_KEY, user);

    return user;
  }

  return ctx;
};

export const getSsrUser = async () => {
  const ctx = await tryGetSsrUser();

  if (shouldAskUserToLogin(ctx)) {
    // TODO - improve state handling when redirecting to login
    throw redirect(
      '/auth/sign-in?' + new URLSearchParams({ state: getUrl() }).toString()
    );
  }

  if (ctx.error) {
    throw new Error(ctx.error.message);
  }

  return ctx.data.user;
};
