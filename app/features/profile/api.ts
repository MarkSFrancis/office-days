import { queryOptions } from '@tanstack/react-query';
import { createSupabaseBrowserClient } from '~/supabase/csrSupabase';

export interface Profile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

/**
 * Client-side queries for the Profile / auth feature.
 */
export const profileApi = {
  rootKey: 'profile',
  /**
   * Accept a supabase email invitation. Must be done on the client as supabase uses the hash fragment, which is not passed to the server.
   */
  acceptInvite: async () => {
    const supabase = createSupabaseBrowserClient();

    // Might be accepting an invite
    const hashParams = new URLSearchParams(
      // Remove the leading #
      window.location.hash.substring(1)
    );

    const refreshToken = hashParams.get('refresh_token');
    const accessToken = hashParams.get('access_token');

    if (refreshToken && accessToken) {
      const refreshResult = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (refreshResult.error) {
        throw refreshResult.error;
      }
    }

    const session = await supabase.auth.getSession();
    if (session.error) {
      throw session.error;
    } else if (!session.data.session) {
      throw new Error('No session found');
    }

    return {
      acceptedInvite: !!refreshToken,
      user: session.data.session.user,
    };
  },
};
