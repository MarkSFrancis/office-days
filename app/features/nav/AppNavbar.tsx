import { cn } from '~/lib/utils';
import { OfficeDaysLogo } from './OfficeDaysLogo';
import { Link, useNavigation } from '@remix-run/react';
import { FC } from 'react';
import { NavAuth } from './NavAuth';
import { Profile } from '../profile/api';
import { Office } from '../office/api';
import { OfficeSelector } from './OfficeSelector';
import { Navbar, NavbarContent } from './Navbar';
import { useUser } from '../auth/useUser';

export interface AppNavbarProps {
  profile: Profile | undefined;
  offices: Office[];
}

export const AppNavbar: FC<AppNavbarProps> = (props) => {
  const navigation = useNavigation();
  const user = useUser();

  return (
    <Navbar>
      <div
        className={cn(
          'absolute hidden animate-opacity-pulse bg-primary/80 h-1.5 w-full',
          navigation.state !== 'idle' && 'block'
        )}
      ></div>
      <NavbarContent>
        <Link to="/" className="self-center items-center flex">
          <OfficeDaysLogo className="inline-block align-bottom mr-2" />
          <span className="text-lg">Office days</span>
        </Link>

        {!!user && <OfficeSelector offices={props.offices} />}

        <div className="flex-grow"></div>

        <NavAuth profile={props.profile} />
      </NavbarContent>
    </Navbar>
  );
};
