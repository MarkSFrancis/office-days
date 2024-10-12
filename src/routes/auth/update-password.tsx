import { redirect, RouteDefinition, useSubmission } from '@solidjs/router';
import { AppTitle } from '~/components/AppTitle';
import { Form } from '~/components/form/Form';
import { FormInput } from '~/components/form/FormInput';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '~/components/ui/card';
import { TextField, TextFieldLabel } from '~/components/ui/text-field';
import { authApi, UpdatePasswordSchema } from '~/features/auth/api';
import { getCurrentUserAsync } from '~/features/auth/hooks';
import { getSupabaseClient } from '~/supabase/supabase';

export const route = {
  preload: async ({ location }) => {
    'use server';
    // Might be accepting an invite
    const hashParams = new URLSearchParams(
      // Remove the leading #
      location.hash.substring(1)
    );

    const refreshToken = hashParams.get('refresh_token');
    const accessToken = hashParams.get('access_token');
    const code = location.query.code;

    if (refreshToken && accessToken) {
      console.info('Invitation detected');
      const refreshResult = await getSupabaseClient().auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (refreshResult.error) {
        console.error(refreshResult.error);
      } else {
        console.info('Accepted invitation', refreshResult.data);
      }
    } else if (code) {
      const codeResult =
        await getSupabaseClient().auth.exchangeCodeForSession(code);

      if (codeResult.error) {
        console.error(codeResult.error);
      } else {
        console.info('Accepted invitation', codeResult.data);
      }
    }

    const user = await getCurrentUserAsync();

    if (!user) {
      throw redirect('/auth/sign-in');
    }

    return {
      acceptedInvite: !!refreshToken,
    };
  },
} satisfies RouteDefinition;

export default function UpdatePasswordPage() {
  const updatingPassword = useSubmission(authApi.updatePassword);

  return (
    <>
      <AppTitle>Update password</AppTitle>
      <Form schema={UpdatePasswordSchema} action={authApi.updatePassword}>
        <fieldset
          disabled={updatingPassword.pending}
          class="flex justify-center items-center"
        >
          <Card class="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader class="md:px-16 md:pt-8">
              <CardTitle class="text-2xl font-light">
                Set your password
              </CardTitle>
              <CardDescription>
                Enter a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent class="md:px-16">
              <div class="grid gap-4">
                <TextField name="newPassword">
                  <TextFieldLabel>New password</TextFieldLabel>
                  <FormInput
                    name="newPassword"
                    type="password"
                    autocomplete="new-password"
                  />
                </TextField>
                <Button type="submit" class="w-full">
                  Set my password
                </Button>
              </div>
            </CardContent>
          </Card>
        </fieldset>
      </Form>
    </>
  );
}
