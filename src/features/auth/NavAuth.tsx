import { A, createAsync } from '@solidjs/router';
import { Component, Show, Suspense } from 'solid-js';
import { Button } from '~/components/ui/button';
import { NavAvatar } from '../nav/NavAvatar';
import { profileApi } from '../profile/api';
import { User } from '@supabase/supabase-js';

export interface NavAuthProps {
  user: () => User | undefined;
}

export const NavAuth: Component<NavAuthProps> = (props) => {
  const profile = createAsync(() => profileApi.getProfile());

  return (
    <Suspense>
      <Show
        when={props.user()}
        fallback={
          <div class="flex gap-2">
            <Button as={A} href="/auth/sign-in" variant="outline">
              Sign in
            </Button>
            <Button as={A} href="/auth/sign-up">
              Sign up
            </Button>
          </div>
        }
      >
        {(user) => <NavAvatar user={user()} profile={profile} />}
      </Show>
    </Suspense>
  );
};
