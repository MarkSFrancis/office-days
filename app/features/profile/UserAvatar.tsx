import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { CircleUser } from 'lucide-react';
import { FC, useMemo } from 'react';

export const UserAvatar: FC<{
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}> = ({ avatarUrl, firstName, lastName, email }) => {
  const avatarTextFallback = useMemo(() => {
    let avatarText = '';

    if (firstName) {
      if (lastName) {
        avatarText = `${firstName.at(0) ?? ''}${lastName.at(0) ?? ''}`;
      } else {
        avatarText = firstName.substring(0, 1);
      }
    } else if (lastName) {
      avatarText = lastName.substring(0, 1);
    } else if (email) {
      avatarText = email.substring(0, 1);
    }

    if (avatarText.length) {
      return avatarText.toLocaleUpperCase();
    } else {
      return null;
    }
  }, [firstName, lastName, email]);

  return (
    <Avatar className="bg-secondary text-secondary-foreground">
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} />
      ) : (
        <AvatarFallback>
          {avatarTextFallback ? (
            <span>{avatarTextFallback}</span>
          ) : (
            <CircleUser />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
