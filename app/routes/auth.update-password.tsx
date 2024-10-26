import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/cloudflare';
import { MetaFunction } from '@remix-run/react';
import { validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import { LockIcon } from 'lucide-react';
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
  CardDescription,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const meta: MetaFunction = (ctx) => [
  {
    title: getTitle(ctx, 'Set your password'),
    description: 'Set your password',
  },
];

export const loader = async (ctx: LoaderFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const url = new URL(ctx.request.url);

    const authCode = url.searchParams.get('code');
    if (authCode) {
      const session = await supabase.auth.exchangeCodeForSession(authCode);

      if (session.error) {
        throw session.error;
      }
    }

    // Verify that the user has a valid session
    // Note that because loaders run in parallel in Remix, the navbar will likely not be updated with the user's info in the UI
    await getSsrUser(supabase);

    return json({});
  });
};

export default function UpdatePasswordPage() {
  const form = useForm<z.output<typeof UpdatePasswordSchema>>({
    validator,
    method: 'post',
    onSubmitSuccess: () => {
      toast.success('Password updated', {
        id: 'password-updated',
      });
    },
    onSubmitFailure: () => {
      toast.error('Failed to save', {
        id: 'password-updated',
      });
    },
  });

  return (
    <div className="mx-auto mt-4 w-full">
      <Form form={form}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex justify-center items-center"
        >
          <Card className="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader className="md:px-16 md:pt-8">
              <CardTitle className="text-2xl font-light">
                Update your password
              </CardTitle>
              <CardDescription>
                Enter a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="md:px-16">
              <div className="grid gap-4">
                <FormField
                  scope={form.scope('newPassword')}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FormLabel>New password</FormLabel>
                      <Input
                        type="password"
                        autoComplete="new-password"
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
                  {!form.formState.isSubmitting && (
                    <LockIcon className="mr-2" />
                  )}
                  Update your password
                </Button>
              </div>
            </CardContent>
          </Card>
        </fieldset>
      </Form>
    </div>
  );
}

export const UpdatePasswordSchema = z.object({
  newPassword: zodUtils.string(),
});

const validator = withZod(UpdatePasswordSchema);

export const action = async (ctx: ActionFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    await getSsrUser(supabase);

    const res = await validator.validate(await ctx.request.formData());
    if (res.error) {
      return validationError(res.error, res.submittedData);
    }

    const updateRes = await supabase.auth.updateUser({
      password: res.data.newPassword,
    });

    if (updateRes.error) {
      return validationError(
        {
          fieldErrors: {
            newPassword: updateRes.error.message,
          },
        },
        res.submittedData
      );
    }

    return redirect('/');
  });
};
