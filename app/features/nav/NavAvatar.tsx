import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Loading } from '~/components/Loading';
import { UserAvatar } from '../profile/UserAvatar';
import { User } from '@supabase/supabase-js';
import { FC } from 'react';
import { LogOut } from 'lucide-react';
import { Form, Link, useNavigation } from '@remix-run/react';
import { Profile } from '../profile/api';

export interface NavAvatarProps {
  user: User;
  profile: Profile | undefined;
}

export const NavAvatar: FC<NavAvatarProps> = (props) => {
  const navigation = useNavigation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full ring-primary ring-1 focus-within:ring-1 ring-offset-2 self-center"
        >
          <UserAvatar
            email={props.user.email}
            avatarUrl={props.profile?.avatarUrl}
            firstName={props.profile?.firstName}
            lastName={props.profile?.lastName}
          />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link className="font-bold cursor-pointer" to="/profile/me">
            My profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="font-bold cursor-pointer" to="/auth/update-password">
            Change my password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Form action="/auth/sign-out" method="post">
          <DropdownMenuItem asChild>
            <button
              className="cursor-pointer flex justify-between items-center w-full"
              type="submit"
            >
              Sign out
              {navigation.formAction === '/auth/sign-out' ? (
                <Loading className="ml-2 w-6 py-0 inline-block" />
              ) : (
                <LogOut className="ml-2 w-6 py-0 inline-block" />
              )}
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
