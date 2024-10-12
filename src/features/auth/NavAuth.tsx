import { A, createAsync } from '@solidjs/router';
import { SubmitButton } from '~/components/form/SubmitButton';
import { Component, Show, Suspense } from 'solid-js';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/form/Form';
import { authApi } from './api';

export const NavAuth: Component = () => {
  const user = createAsync(() => authApi.getUser());

  return (
    <Suspense>
      <Show
        when={user()}
        fallback={
          <div class="flex gap-2">
            <Button as={A} href="/auth/sign-in" variant="outline">
              Sign in
            </Button>
            <Button as={A} href="/auth/sign-up">
              Sign up
            </Button>
          </div>
        }
      >
        <LogoutButton />
      </Show>
    </Suspense>
  );
};

const LogoutButton: Component = () => (
  <Form action={authApi.signOut}>
    <SubmitButton variant="secondary">Logout</SubmitButton>
  </Form>
);
