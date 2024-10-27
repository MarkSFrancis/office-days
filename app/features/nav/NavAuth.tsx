import { Button } from '~/components/ui/button';
import { NavAvatar } from '../nav/NavAvatar';
import { FC } from 'react';
import { Profile } from '../profile/api';
import { Link } from '@remix-run/react';
import { useUser } from '../auth/useUser';

export interface NavAuthProps {
  profile: Profile | undefined;
}

export const NavAuth: FC<NavAuthProps> = (props) => {
  const user = useUser();

  if (user) {
    return <NavAvatar user={user} profile={props.profile} />;
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
