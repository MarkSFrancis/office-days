import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Title } from '@solidjs/meta';
import { A, useSubmission } from '@solidjs/router';
import { SubmitButton } from '~/components/form/SubmitButton';
import { Form } from '~/components/form/Form';
import { authApi, SignUpSchema } from '~/features/auth/api';
import { TextField, TextFieldLabel } from '~/components/ui/text-field';
import { FormInput } from '~/components/form/FormInput';

export default function SignUpPage() {
  const signingUp = useSubmission(authApi.signUp);

  return (
    <div class="flex-1 mt-4">
      <Title>Sign in</Title>
      <Form action={authApi.signUp} schema={SignUpSchema}>
        <fieldset
          disabled={signingUp.pending}
          class="flex justify-center items-center"
        >
          <Card class="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader class="md:px-16 md:pt-8">
              <CardTitle class="text-2xl font-light">Sign up</CardTitle>
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
                  <TextFieldLabel>Password</TextFieldLabel>
                  <FormInput
                    name="password"
                    type="password"
                    autocomplete="current-password"
                  />
                </TextField>
                <SubmitButton type="submit" class="w-full">
                  Sign up
                </SubmitButton>
              </div>
            </CardContent>
            <CardFooter class="bg-muted md:px-16 py-4 text-sm justify-center">
              <div class="text-center">
                Already have an account?{' '}
                <Button as={A} href="/auth/sign-in" variant="link">
                  Sign in
                </Button>
              </div>
            </CardFooter>
          </Card>
        </fieldset>
      </Form>
    </div>
  );
}
