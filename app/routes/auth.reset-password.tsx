import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { Link, MetaFunction } from '@remix-run/react';
import { validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Form } from '~/components/forms/Form';
import { FormField } from '~/components/forms/FormField';
import { FormLabel } from '~/components/forms/FormLabel';
import { FormMessage } from '~/components/forms/FormMessage';
import { useForm } from '~/components/forms/useForm';
import { getTitle } from '~/components/getTitle';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { ENV_URL } from '~/lib/apiEnv';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';

export const meta: MetaFunction = (ctx) => [
  {
    title: getTitle(ctx, 'Reset password'),
    description: 'Reset your password',
  },
];

export default function ResetPasswordPage() {
  const form = useForm<z.output<typeof ResetPasswordSchema>>({
    validator,
    method: 'post',
    onSubmitSuccess: () => {
      toast.success(
        'If you registered using your email, you will receive a password reset email. The password reset link expires in 24 hours.',
        {
          id: 'reset-password',
        }
      );
    },
    onSubmitFailure: () => {
      toast.error(
        'Could not reset your password. Please check your email is correct',
        {
          id: 'reset-password',
        }
      );
    },
    onBeforeSubmit: () => {
      toast.loading('Loading...', {
        id: 'reset-password',
      });
    },
  });

  return (
    <Form form={form}>
      <fieldset
        disabled={form.formState.isSubmitting}
        className="flex justify-center items-center"
      >
        <Card className="mx-auto max-w-sm md:max-w-lg w-full">
          <CardHeader className="md:px-16 md:pt-8">
            <CardTitle className="text-2xl font-light">
              Reset your password
            </CardTitle>
            <CardDescription>
              Type in your email and we'll send you a link to reset your
              password
            </CardDescription>
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
              <Button type="submit" className="w-full">
                Send me a reset email
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-muted md:px-16 py-4 text-sm justify-center">
            <div className="text-center">
              Remembered your password?{' '}
              <Button asChild variant="link">
                <Link to="/auth/sign-in">Sign in</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </fieldset>
    </Form>
  );
}

const ResetPasswordSchema = z.object({
  email: zodUtils.string().email(),
});

const validator = withZod(ResetPasswordSchema);

export const action = async (ctx: ActionFunctionArgs) => {
  const res = await validator.validate(await ctx.request.formData());

  if (res.error) {
    return validationError(res.error, res.submittedData);
  }

  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const reset = await supabase.auth.resetPasswordForEmail(res.data.email, {
      redirectTo: `${ENV_URL}/auth/update-password`,
    });

    if (reset.error) {
      throw reset.error;
    }

    return redirect('/auth/sign-in');
  });
};
