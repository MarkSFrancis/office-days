import {
  ActionFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/cloudflare';
import { Form, Link, useActionData } from '@remix-run/react';
import { isValidationErrorResponse, validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import { z } from 'zod';
import { getTitle } from '~/components/getTitle';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { FormField } from '~/components/forms/FormField';
import { FormLabel } from '~/components/forms/FormLabel';
import { FormMessage } from '~/components/forms/FormMessage';
import { useForm } from '~/components/forms/useForm';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { Input } from '~/components/ui/input';

export const meta: MetaFunction = (ctx) => [
  {
    title: getTitle(ctx, 'Sign in'),
    description: 'Sign in to your account',
  },
];

export default function SignInPage() {
  const data = useActionData<typeof action>();
  const form = useForm<z.output<typeof SignInSchema>>({
    validator,
    method: 'post',
    onSubmitSuccess: () => {
      if (isValidationErrorResponse(data)) return;
      form.resetForm();
    },
  });

  return (
    <div className="flex-1 mt-4">
      <Form {...form.getFormProps()}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex justify-center items-center"
        >
          <Card className="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader className="md:px-16 md:pt-8">
              <CardTitle className="text-2xl font-light">
                Sign in to your account
              </CardTitle>
            </CardHeader>
            <CardContent className="md:px-16">
              <div className="grid gap-4">
                <FormField
                  scope={form.scope('email')}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        placeholder="me@example.com"
                        autoComplete="email"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  scope={form.scope('password')}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Button
                          asChild
                          variant="link"
                          className="ml-auto h-auto text-sm"
                        >
                          <Link to="/auth/reset-password">
                            Forgot your password?
                          </Link>
                        </Button>
                      </div>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
                <Button
                  isPending={form.formState.isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  Sign in
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted md:px-16 py-4 text-sm justify-center">
              <div className="text-center">
                New to office days?{' '}
                <Button asChild variant="link">
                  <Link to="/auth/sign-up">Sign up</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </fieldset>
      </Form>
    </div>
  );
}

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const validator = withZod(SignInSchema);

export const action = async (ctx: ActionFunctionArgs) => {
  const res = await validator.validate(await ctx.request.formData());
  if (res.error) {
    return validationError(res.error, res.submittedData);
  }

  return await withSupabaseSsr(ctx, async ({ supabase }) => {
    const signedIn = await supabase.auth.signInWithPassword({
      email: res.data.email,
      password: res.data.password,
    });

    if (signedIn.error) {
      return validationError(
        {
          fieldErrors: {
            // Just show the supabase error to the user
            // Likely something like "bad login credentials"
            password: signedIn.error.message,
          },
        },
        res.submittedData
      );
    }

    return redirect('/');
  });
};
