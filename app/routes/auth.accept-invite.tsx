import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { MetaFunction } from '@remix-run/react';
import { validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import { RocketIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Form } from '~/components/forms/Form';
import { FormField } from '~/components/forms/FormField';
import { FormLabel } from '~/components/forms/FormLabel';
import { FormMessage } from '~/components/forms/FormMessage';
import { useForm } from '~/components/forms/useForm';
import { getTitle } from '~/components/getTitle';
import { SectionLoading } from '~/components/Loading';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { getDbClient } from '~/db/client';
import { profiles } from '~/db/schema';
import { useAcceptInvite } from '~/features/profile/useAcceptInvite';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const meta: MetaFunction = (ctx) => [
  {
    title: getTitle(ctx, 'Create your profile'),
    description: 'Create your office days profile',
  },
];

export default function UpdatePasswordPage() {
  const invite = useAcceptInvite();
  const form = useForm<z.output<typeof AcceptInviteSchema>>({
    validator,
    method: 'post',
    onSubmitSuccess: () => {
      toast.success('Profile created! Welcome to Office days', {
        id: 'profile-updated',
      });
    },
    onSubmitFailure: () => {
      toast.error('Failed to save', {
        id: 'profile-updated',
      });
    },
  });

  if (invite.isAccepting) {
    return (
      <div className="mx-auto mt-4 space-y-4 w-full">
        <noscript>
          <Card className="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader className="md:px-16 md:pt-8">
              <CardTitle className="text-2xl font-light">
                Please enable Javascript
              </CardTitle>
            </CardHeader>
            <CardContent className="md:px-16">
              You must have Javascript enabled in your browser to accept an
              invitation
            </CardContent>
          </Card>
        </noscript>
        <SectionLoading />
      </div>
    );
  }

  return (
    <Form className="mx-auto mt-4 space-y-4 w-full" form={form}>
      <fieldset
        disabled={form.formState.isSubmitting}
        className="flex justify-center items-center"
      >
        <Card className="mx-auto max-w-sm md:max-w-lg w-full">
          <CardHeader className="md:px-16 md:pt-8">
            <CardTitle className="text-2xl font-light">
              Welcome to Office days!
            </CardTitle>
            <CardDescription className="space-y-1">
              It's great to have you here ❤️
              <br />
              To get started, set a password
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
              <FormField
                scope={form.scope('firstName')}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormLabel className="space-x-1">
                      <span>Given name</span>
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <Input autoComplete="given-name" {...field} />
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                scope={form.scope('lastName')}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormLabel className="space-x-1">
                      <span>Family name</span>
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <Input autoComplete="family-name" {...field} />
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
                  <RocketIcon className="mr-2" />
                )}
                Create my profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </Form>
  );
}

export const AcceptInviteSchema = z.object({
  newPassword: zodUtils.string(),
  firstName: zodUtils.optional(zodUtils.string()),
  lastName: zodUtils.optional(zodUtils.string()),
  avatarUrl: zodUtils.optional(zodUtils.string()),
});

const validator = withZod(AcceptInviteSchema);

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

    await getDbClient(ctx.context)
      .insert(profiles)
      .values({
        userId: updateRes.data.user.id,
        avatarUrl: res.data.avatarUrl,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      })
      .onConflictDoUpdate({
        set: {
          avatarUrl: res.data.avatarUrl,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        },
        target: profiles.userId,
      });

    return redirect('/');
  });
};
