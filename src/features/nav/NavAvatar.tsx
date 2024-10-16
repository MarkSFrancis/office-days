import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Loading } from '~/components/Loading';
import LogOut from 'lucide-solid/icons/log-out';
import { Component, Suspense } from 'solid-js';
import { A, useSubmission } from '@solidjs/router';
import { authApi } from '../auth/api';
import { Form } from '~/components/form/Form';
import { Profile } from '../profile/api';
import { UserAvatar } from '../profile/UserAvatar';
import { User } from '@supabase/supabase-js';

export interface NavAvatarProps {
  user: User;
  profile: () => Profile | undefined;
}

export const NavAvatar: Component<NavAvatarProps> = (props) => {
  const signingOut = useSubmission(authApi.signOut);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        variant="secondary"
        size="icon"
        class="rounded-full ring-primary ring-1 focus-within:ring-1 ring-offset-2 self-center"
        as={Button}
      >
        <Suspense fallback={<Loading class="inline-block" />}>
          <UserAvatar
            email={props.user.email}
            avatarUrl={props.profile()?.avatarUrl}
            firstName={props.profile()?.firstName}
            lastName={props.profile()?.lastName}
          />
        </Suspense>
        <span class="sr-only">Toggle user menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          class="font-bold cursor-pointer"
          href="/dash/profile"
          as={A}
        >
          My profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Form action={authApi.signOut}>
          <DropdownMenuItem
            class="cursor-pointer flex justify-between items-center"
            as="button"
            type="submit"
          >
            Sign out
            {signingOut.pending ? (
              <Loading class="ml-2 w-6 py-0 inline-block" />
            ) : (
              <LogOut class="ml-2 w-6 py-0 inline-block" />
            )}
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
