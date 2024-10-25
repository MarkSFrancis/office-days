import { useNavigate } from '@remix-run/react';
import { isBrowser } from '@supabase/ssr';
import { useMutation } from '@tanstack/react-query';
import { ComponentProps, forwardRef, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { SectionLoading } from '~/components/Loading';
import { profileApi } from '~/features/profile/api';

export const AcceptInvite = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    const initialRender = useRef(true);

    const invite = useMutation({
      mutationFn: profileApi.acceptInvite,
      onError: (error) => {
        console.error(error);
        toast.error('Failed to accept invite');
        navigate('/auth/sign-in');
      },
      onSuccess: () => {
        toast.success(
          <div className="space-y-2">
            <p>Welcome to Office days! It's great to have you here ❤️</p>
            <p>To get started, set a password</p>
          </div>
        );
        setLoaded(true);
      },
    });

    useEffect(() => {
      if (isBrowser() && initialRender.current) {
        initialRender.current = false;
        invite.mutate();
      }
    }, []);

    if (!loaded) {
      return <SectionLoading />;
    }

    return (
      <div {...props} ref={ref}>
        <noscript className="bg-card/80 p-4">
          If you're accepting an invite from an email, you must have Javascript
          enabled
        </noscript>
        {props.children}
      </div>
    );
  }
);
