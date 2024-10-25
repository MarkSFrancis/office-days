import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDbClient } from '~/db/client';
import { officeUsers, users } from '~/db/schema';
import { getOfficeUser } from '~/features/office/api';
import { ENV_URL } from '~/lib/apiEnv';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const InviteToOfficeSchema = z.object({
  email: zodUtils.string().email(),
  officeId: z.string(),
});

export const validator = withZod(InviteToOfficeSchema);

export const action = async (ctx: ActionFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await getSsrUser(supabase);

    const res = await validator.validate(await ctx.request.formData());
    if (res.error) {
      return validationError(res.error, res.submittedData);
    }

    const db = getDbClient(ctx.context);
    const officeUser = await getOfficeUser(ctx.context, {
      userId: user.id,
      officeId: res.data.officeId,
    });

    if (!officeUser) {
      throw redirect('/');
    }

    let userIdToAdd: string;
    const [existingUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, res.data.email))
      .limit(1);

    if (existingUser) {
      const existingOfficeUser = await getOfficeUser(ctx.context, {
        userId: existingUser.id,
        officeId: res.data.officeId,
      });
      if (existingOfficeUser) {
        return validationError(
          {
            fieldErrors: {
              email: `${res.data.email} has already been added to this office`,
            },
          },
          res.submittedData
        );
      }

      userIdToAdd = existingUser.id;
    } else {
      const newUser = await supabase.auth.admin.inviteUserByEmail(
        res.data.email,
        {
          redirectTo: `${ENV_URL}/office/${res.data.officeId}`,
        }
      );

      if (newUser.error) {
        return validationError(
          {
            fieldErrors: {
              email: newUser.error.message,
            },
          },
          res.submittedData
        );
      }

      userIdToAdd = newUser.data.user.id;
    }

    await db.insert(officeUsers).values({
      invitedOn: new Date(),
      role: 'MEMBER',
      officeId: res.data.officeId,
      userId: userIdToAdd,
    });

    throw redirect(`/office/${res.data.officeId}`);
  });
};
