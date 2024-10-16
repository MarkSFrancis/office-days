import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Component, createMemo, Show } from 'solid-js';
import CircleUser from 'lucide-solid/icons/circle-user';

export const UserAvatar: Component<{
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}> = (props) => {
  const avatarTextFallback = createMemo(() => {
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

    if (avatarText.length) {
      return avatarText.toLocaleUpperCase();
    } else {
      return null;
    }
  });

  return (
    <Avatar class="bg-secondary text-secondary-foreground">
      <Show
        when={props.avatarUrl}
        fallback={
          <AvatarFallback>
            <Show when={avatarTextFallback()} fallback={<CircleUser />}>
              {(text) => text()}
            </Show>
          </AvatarFallback>
        }
      >
        <AvatarImage src={props.avatarUrl} />
      </Show>
    </Avatar>
  );
};
