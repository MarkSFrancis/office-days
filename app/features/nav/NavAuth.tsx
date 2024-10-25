import { Button } from '~/components/ui/button';
import { NavAvatar } from '../nav/NavAvatar';
import { User } from '@supabase/supabase-js';
import { FC } from 'react';
import { Profile } from '../profile/api';
import { Link } from '@remix-run/react';

export interface NavAuthProps {
  user: User | undefined;
  profile: Profile | undefined;
}

export const NavAuth: FC<NavAuthProps> = (props) => {
  if (props.user) {
    return <NavAvatar user={props.user} profile={props.profile} />;
  }

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <Link to="/auth/sign-in">Sign in</Link>
      </Button>
      <Button>
        <Link to="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
};
