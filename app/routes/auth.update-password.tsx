import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/cloudflare';
import { MetaFunction } from '@remix-run/react';
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
  CardDescription,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const loader = async (ctx: LoaderFunctionArgs) => {
  const url = new URL(ctx.request.url);

  return withSupabaseSsr(ctx, async ({ supabase }) => {
    // Might be accepting an invite
    const hashParams = new URLSearchParams(
      // Remove the leading #
      url.hash.substring(1)
    );

    const refreshToken = hashParams.get('refresh_token');
    const accessToken = hashParams.get('access_token');

    if (refreshToken && accessToken) {
      const refreshResult = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (refreshResult.error) {
        throw refreshResult.error;
      }
    }

    await getSsrUser(supabase);

    return json({
      acceptedInvite: !!refreshToken,
    });
  });
};

export const meta: MetaFunction = (ctx) => [
  {
    title: getTitle(ctx, 'Update your password'),
    description: 'Reset your password',
  },
];

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
    onBeforeSubmit: () => {
      toast.loading('Updating your password...', {
        id: 'password-updated',
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
              Set your password
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
              <Button type="submit" className="w-full">
                Set my password
              </Button>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </Form>
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
      throw updateRes.error;
    }

    return redirect('/auth/update-password');
  });
};
