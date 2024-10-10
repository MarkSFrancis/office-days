import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import CircleUser from 'lucide-solid/icons/circle-user';
import { Component, createMemo } from 'solid-js';

export const UserAvatar: Component<{
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}> = (props) => {
  const fallbackAvatar = createMemo(() => {
    let avatarText = '';

    if (props.firstName) {
      if (props.lastName) {
        avatarText = `${props.firstName.at(0) ?? ''}${props.lastName.at(0) ?? ''}`;
      } else {
        avatarText = props.firstName.substring(0, 1);
      }
    } else if (props.lastName) {
      avatarText = props.lastName.substring(0, 1);
    } else if (props.email) {
      avatarText = props.email.substring(0, 1);
    }

    return avatarText.toLocaleUpperCase();
  }, [props]);

  return (
    <Avatar class="bg-secondary text-secondary-foreground">
      {!!props.avatarUrl && <AvatarImage src={props.avatarUrl} />}
      <AvatarFallback>{fallbackAvatar() || <CircleUser />}</AvatarFallback>
    </Avatar>
  );
};
