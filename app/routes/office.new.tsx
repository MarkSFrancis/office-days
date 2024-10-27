import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import { z } from 'zod';
import { Form } from '~/components/forms/Form';
import { FormField } from '~/components/forms/FormField';
import { FormLabel } from '~/components/forms/FormLabel';
import { FormMessage } from '~/components/forms/FormMessage';
import { useForm } from '~/components/forms/useForm';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { getDbClient } from '~/db/client';
import { offices, officeUsers } from '~/db/schema';
import { getShortId } from '~/lib/getShortId';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const NewOfficeSchema = z.object({
  displayName: z.string(),
});

const validator = withZod(NewOfficeSchema);

export default function NewOfficePage() {
  const form = useForm<z.output<typeof NewOfficeSchema>>({
    validator,
    method: 'post',
  });

  return (
    <Form className="w-full" form={form}>
      <fieldset
        disabled={form.formState.isSubmitting}
        className="flex justify-center items-center"
      >
        <Card className="mx-auto mt-4 max-w-sm md:max-w-lg w-full">
          <CardHeader className="md:px-16 md:pt-8">
            <CardTitle className="text-2xl font-light">New office</CardTitle>
            <CardDescription>
              You can invite your colleagues once your new office has been
              created
            </CardDescription>
          </CardHeader>
          <CardContent className="md:px-16">
            <div className="grid gap-4">
              <FormField
                scope={form.scope('displayName')}
                render={({ field }) => (
                  <div className="space-y-2">
                    <FormLabel>Name</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </div>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                isPending={form.formState.isSubmitting}
              >
                Create office
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-muted md:px-16 py-4 text-sm justify-center">
            <div>
              <p>Has your team already set up an office?</p>
              <p className="text-muted-foreground">
                They'll need to invite you via the "Colleagues" button in the
                top-right of their office view
              </p>
            </div>
          </CardFooter>
        </Card>
      </fieldset>
    </Form>
  );
}

export const action = async (ctx: ActionFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await getSsrUser(supabase);

    const res = await validator.validate(await ctx.request.formData());
    if (res.error) {
      return validationError(res.error, res.submittedData);
    }

    const newOffice = await getDbClient(ctx.context).transaction(async (tx) => {
      const [newOffice] = await tx
        .insert(offices)
        .values({
          id: getShortId(),
          displayName: res.data.displayName,
        })
        .returning({
          id: offices.id,
        });

      if (!newOffice) {
        throw new Error('Failed to create office');
      }

      await tx.insert(officeUsers).values({
        officeId: newOffice.id,
        userId: user.id,
        invitedOn: new Date(),
        role: 'OWNER',
      });

      return newOffice;
    });

    throw redirect(`/office/${newOffice.id}`);
  });
};
