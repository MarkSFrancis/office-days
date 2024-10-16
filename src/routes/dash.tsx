import { ParentProps } from 'solid-js';
import { redirect, RouteDefinition } from '@solidjs/router';
import { authApi } from '~/features/auth/api';

export const route = {
  async preload({ location }) {
    const user = await authApi.getUser();

    const href = `${location.pathname}?${location.search}${location.hash}`;

    if (!user) {
      throw redirect(
        `/auth/sign-in?${new URLSearchParams({ redirect: href })}`
      );
    }
  },
} satisfies RouteDefinition;

export default function DashPage(props: ParentProps) {
  return props.children;
}
