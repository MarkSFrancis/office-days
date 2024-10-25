import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import { MetaFunction, useLoaderData, useParams } from '@remix-run/react';
import { SendIcon } from 'lucide-react';
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
import { getOffice } from '~/features/office/api';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';
import { InviteToOfficeSchema, validator } from './office.$officeId.invite';
import { getDbClient } from '~/db/client';
import { officeUsers, profiles, users } from '~/db/schema';
import { eq } from 'drizzle-orm';

export const meta: MetaFunction = (ctx) => [
  {
    title: getTitle(ctx, 'Colleagues'),
  },
];

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { officeId } = ctx.params as { officeId: string };

  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await getSsrUser(supabase);

    const office = await getOffice(ctx.context, {
      userId: user.id,
      officeId,
    });

    if (!office) {
      throw redirect('/');
    }

    const allColleagues = await getDbClient(ctx.context)
      .select({
        id: officeUsers.id,
        email: users.email,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        avatarUrl: profiles.avatarUrl,
        invitedBy: officeUsers.invitedBy,
        invitedOn: officeUsers.invitedOn,
      })
      .from(officeUsers)
      .where(eq(officeUsers.officeId, office.id))
      .innerJoin(users, eq(users.id, officeUsers.userId))
      .innerJoin(profiles, eq(profiles.userId, officeUsers.userId));

    return json({
      office,
      allColleagues,
    });
  });
};

export default function OfficeInvitePage() {
  const params = useParams<{ officeId: string }>();
  const data = useLoaderData<typeof loader>();

  const inviteForm = useForm<z.output<typeof InviteToOfficeSchema>>({
    validator,
    action: `/office/${params.officeId}/invite`,
    method: 'post',
  });

  return (
    <div className="flex-1 flex flex-col gap-4 mt-4">
      <Card className="mx-auto max-w-sm md:max-w-lg w-full">
        <CardHeader className="md:px-16 md:pt-8">
          <CardTitle className="text-2xl font-light">Your colleagues</CardTitle>
          <CardDescription>
            The following people are part of {data.office.displayName}:
          </CardDescription>
        </CardHeader>
        <CardContent className="md:px-16">
          <ul className="grid gap-4 list-disc">
            {data.allColleagues.map((c) => (
              // TODO: Add a UserDisplay component
              // TODO: Add a way to remove a colleague
              <li key={c.id}>{c.email}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Form form={inviteForm}>
        <input type="hidden" name="officeId" value={params.officeId} />
        <fieldset
          disabled={inviteForm.formState.isSubmitting}
          className="flex justify-center items-center"
        >
          <Card className="mx-auto max-w-sm md:max-w-lg w-full">
            <CardHeader className="md:px-16 md:pt-8">
              <CardTitle className="text-2xl font-light">
                Invite a colleague
              </CardTitle>
              <CardDescription>
                Invite a colleague to join {data.office.displayName}
              </CardDescription>
            </CardHeader>
            <CardContent className="md:px-16">
              <div className="grid gap-4">
                <FormField
                  scope={inviteForm.scope('email')}
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
                <Button
                  isPending={inviteForm.formState.isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {!inviteForm.formState.isSubmitting && (
                    <SendIcon className="mr-2" />
                  )}
                  Send invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </fieldset>
      </Form>
    </div>
  );
}
