import { z } from 'zod';
import { useForm } from '~/components/forms/useForm';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { zodUtils } from '~/lib/zodUtils';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/cloudflare';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';
import { withZod } from '@rvf/zod';
import { FormProvider, validationError } from '@rvf/remix';
import { getDbClient } from '~/db/client';
import { profiles } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { FormField } from '~/components/forms/FormField';
import { FormLabel } from '~/components/forms/FormLabel';
import { Input } from '~/components/ui/input';
import { FormMessage } from '~/components/forms/FormMessage';
import { SaveIcon } from 'lucide-react';
import { nullPropsToUndefined } from '~/lib/utils';
import { toast } from 'react-hot-toast';
import { Profile } from '~/features/profile/api';

export const loader = async (ctx: LoaderFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await getSsrUser(supabase);

    const profile = await getDbClient(ctx.context)
      .select({
        avatarUrl: profiles.avatarUrl,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
      })
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1)
      .then<Profile>(([p]) => (p ? nullPropsToUndefined(p) : {}));

    return json({
      user,
      profile,
    });
  });
};

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const form = useForm<z.output<typeof Schema>>({
    validator,
    method: 'post',
    defaultValues: data.profile,
    onSubmitSuccess: () => {
      toast.success('Profile updated', {
        id: 'profile-updated',
      });
    },
    onSubmitFailure: () => {
      toast.error('Failed to save', {
        id: 'profile-updated',
      });
    },
    onBeforeSubmit: () => {
      toast.loading('Saving profile...', {
        id: 'profile-updated',
      });
    },
  });

  return (
    <FormProvider scope={form.scope()}>
      <fetcher.Form className="w-full" {...form.getFormProps()}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex justify-center items-center"
        >
          <Card className="mx-auto mt-4 max-w-sm md:max-w-lg w-full">
            <CardHeader className="md:px-16 md:pt-8">
              <CardTitle className="text-2xl font-light">My profile</CardTitle>
              <CardDescription>
                Make changes to your profile here
              </CardDescription>
            </CardHeader>
            <CardContent className="md:px-16">
              <div className="grid gap-4">
                <FormField
                  scope={form.scope('avatarUrl')}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FormLabel>Avatar URL</FormLabel>
                      <Input type="url" {...field} />
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  scope={form.scope('firstName')}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FormLabel>Given name</FormLabel>
                      <Input autoComplete="given-name" {...field} />
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  scope={form.scope('lastName')}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FormLabel>Family name</FormLabel>
                      <Input autoComplete="family-name" {...field} />
                      <FormMessage />
                    </div>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isPending={form.formState.isSubmitting}
                >
                  {!form.formState.isSubmitting && (
                    <SaveIcon className="mr-2" />
                  )}
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </fieldset>
      </fetcher.Form>
    </FormProvider>
  );
}

const Schema = z.object({
  firstName: zodUtils.optional(zodUtils.string()),
  lastName: zodUtils.optional(zodUtils.string()),
  avatarUrl: zodUtils.optional(zodUtils.string().url()),
});

const validator = withZod(Schema);

export const action = (ctx: ActionFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await getSsrUser(supabase);

    const res = await validator.validate(await ctx.request.formData());
    if (res.error) {
      return validationError(res.error, res.submittedData);
    }

    const db = getDbClient(ctx.context);
    await db
      .insert(profiles)
      .values({
        userId: user.id,
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

    return redirect('/profile/me');
  });
};
