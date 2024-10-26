import React, { FC, useMemo } from 'react';
import { UserAvatar } from './UserAvatar';

export interface UserDisplayProps {
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const UserDisplay: FC<UserDisplayProps> = ({
  firstName,
  lastName,
  email,
  avatarUrl,
}) => {
  const displayName = useMemo(() => {
    let displayName = '';

    if (firstName) {
      if (lastName) {
        displayName = `${firstName} ${lastName}`;
      } else {
        displayName = firstName;
      }
    } else if (lastName) {
      displayName = lastName;
    } else {
      displayName = email ?? '';
    }

    return displayName;
  }, [firstName, lastName, email]);

  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        avatarUrl={avatarUrl}
        email={email}
        firstName={firstName}
        lastName={lastName}
      />
      <span>{displayName}</span>
    </div>
  );
};
