import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { validationError } from '@rvf/remix';
import { withZod } from '@rvf/zod';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { getDbClient } from '~/db/client';
import { officeAttendance, officeUsers } from '~/db/schema';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const AddOfficeAttendanceSchema = z.object({
  date: zodUtils.string().date(),
  arriveAt: zodUtils.optional(zodUtils.string().datetime()),
  leaveAt: zodUtils.optional(zodUtils.string().datetime()),
  notes: z.string().optional(),
  officeId: z.string(),
  setAttendance: zodUtils.checkbox(),
});

export const validator = withZod(AddOfficeAttendanceSchema);

export const action = async (ctx: ActionFunctionArgs) => {
  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await getSsrUser(supabase);

    const res = await validator.validate(await ctx.request.formData());
    if (res.error) {
      return validationError(res.error, res.submittedData);
    }

    const db = getDbClient(ctx.context);
    const [userIsInOffice] = await db
      .select({
        id: officeUsers.id,
      })
      .from(officeUsers)
      .where(
        and(
          eq(officeUsers.officeId, res.data.officeId),
          eq(officeUsers.userId, user.id)
        )
      );

    if (!userIsInOffice) {
      throw redirect('/');
    }

    if (!res.data.setAttendance) {
      await db
        .delete(officeAttendance)
        .where(
          and(
            eq(officeAttendance.date, new Date(res.data.date)),
            res.data.arriveAt
              ? eq(officeAttendance.arriveAt, new Date(res.data.arriveAt))
              : isNull(officeAttendance.arriveAt),
            res.data.leaveAt
              ? eq(officeAttendance.leaveAt, new Date(res.data.leaveAt))
              : isNull(officeAttendance.leaveAt),
            eq(officeAttendance.officeId, res.data.officeId),
            eq(officeAttendance.userId, user.id)
          )
        );
    } else {
      await db.insert(officeAttendance).values({
        date: new Date(res.data.date),
        arriveAt: res.data.arriveAt ? new Date(res.data.arriveAt) : undefined,
        leaveAt: res.data.leaveAt ? new Date(res.data.leaveAt) : undefined,
        officeId: res.data.officeId,
        notes: res.data.notes,
        userId: user.id,
      });
    }

    throw redirect(`/office/${res.data.officeId}`);
  });
};
