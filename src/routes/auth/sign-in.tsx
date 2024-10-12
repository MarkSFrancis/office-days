import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { A, useSubmission } from '@solidjs/router';
import { SubmitButton } from '~/components/form/SubmitButton';
import { Form } from '~/components/form/Form';
import { authApi, SignInSchema } from '~/features/auth/api';
import { TextField, TextFieldLabel } from '~/components/ui/text-field';
import { FormInput } from '~/components/form/FormInput';
import { AppTitle } from '~/components/AppTitle';

export default function SignInPage() {
  const signingIn = useSubmission(authApi.signIn);

  return (
    <div class="flex-1 mt-4">
      <AppTitle>Sign in</AppTitle>
      <Form action={authApi.signIn} schema={SignInSchema}>
        <fieldset
          disabled={signingIn.pending}
          class="flex justify-center items-center"
        >
          <Card class="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader class="md:px-16 md:pt-8">
              <CardTitle class="text-2xl font-light">
                Sign in to your account
              </CardTitle>
            </CardHeader>
            <CardContent class="md:px-16">
              <div class="grid gap-4">
                <TextField name="email">
                  <TextFieldLabel>Email</TextFieldLabel>
                  <FormInput
                    name="email"
                    type="email"
                    placeholder="me@example.com"
                    autocomplete="email"
                  />
                </TextField>
                <TextField name="password">
                  <div class="flex items-center">
                    <TextFieldLabel>Password</TextFieldLabel>
                    <Button
                      as={A}
                      variant="link"
                      class="ml-auto h-auto text-sm"
                      href="/auth/reset-password"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                  <FormInput
                    name="password"
                    type="password"
                    autocomplete="current-password"
                  />
                </TextField>
                <SubmitButton type="submit" class="w-full">
                  Login
                </SubmitButton>
              </div>
            </CardContent>
            <CardFooter class="bg-muted md:px-16 py-4 text-sm justify-center">
              <div class="text-center">
                New to office days?{' '}
                <Button as={A} href="/auth/sign-up" variant="link">
                  Sign up
                </Button>
              </div>
            </CardFooter>
          </Card>
        </fieldset>
      </Form>
    </div>
  );
}
