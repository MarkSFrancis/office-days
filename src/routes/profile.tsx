import { ParentProps } from 'solid-js';
import { RouteDefinition } from '@solidjs/router';
import { authApi } from '~/features/auth/api';

export const route = {
  async preload() {
    await authApi.getUser();
  },
} satisfies RouteDefinition;

export default function ProfilePage(props: ParentProps) {
  return props.children;
}
