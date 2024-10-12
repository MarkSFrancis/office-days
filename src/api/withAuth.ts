import { getSsrSupabase, withSsrSupabase } from './withSupabase';
import { createMiddleware } from './middlewareFactory';
import { User, UserResponse } from '@supabase/supabase-js';
import { SupabaseServerClient } from '~/supabase/supabaseServer';
import { redirect } from '@solidjs/router';

const authMiddleware = createMiddleware(async () => {
  const usr = await getSsrSupabase().auth.getUser();

  if (shouldAskUserToLogin(usr)) {
    // TODO - improve state handling when redirecting to login
    throw redirect('/auth/sign-in?state=' + window.location.pathname);
  }

  if (usr.error) {
    throw new Error(usr.error.message);
  }

  return usr.data.user;
}, 'Auth');

const shouldAskUserToLogin = (userResponse: UserResponse) => {
  if (userResponse.error) {
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

export const withAuth = <TResponse>(
  next: (context: {
    user: User;
    supabase: SupabaseServerClient;
  }) => Promise<TResponse>
) =>
  withSsrSupabase((supabase) =>
    authMiddleware.withMiddleware((user) => next({ user, supabase }))
  );

export const tryGetSsrUser = authMiddleware.tryGetSsrContext;
export const getSsrUser = authMiddleware.getSsrContext;
