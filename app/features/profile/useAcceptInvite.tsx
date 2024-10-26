import { useNavigate } from '@remix-run/react';
import { isBrowser } from '@supabase/ssr';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { createSupabaseBrowserClient } from '~/supabase/csrSupabase';

export const useAcceptInvite = () => {
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(true);

  const initialRender = useRef(true);

  const invite = useMutation({
    mutationFn: async () => {
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
          // Log it, but try to create a session anyway. Useful if the user retries a dead link but they're already signed in
          console.error(refreshResult.error);
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
    onError: (error) => {
      console.error(error);
      toast.error('Failed to accept invite');
      navigate('/auth/sign-in');
    },
    onSuccess: (data) => {
      if (!data.acceptedInvite) {
        console.info(
          'No invite found, but user is already logged in. Redirecting to /'
        );
        // navigate('/', { replace: true });
        // return;
      }

      setIsAccepting(false);
    },
  });

  useEffect(() => {
    if (isBrowser() && initialRender.current) {
      initialRender.current = false;
      invite.mutate();
    }
  }, []);

  return useMemo(
    () => ({
      ...invite,
      isAccepting,
    }),
    [invite, isAccepting]
  );
};
