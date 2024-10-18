import { action, cache, redirect } from '@solidjs/router';
import {
  and,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  TransactionRollbackError,
} from 'drizzle-orm';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { getSsrUser } from '~/api/ssrUser';
import { withFormData } from '~/api/withFormData';
import { getDbClient } from '~/db/client';
import {
  offices,
  officeAttendance,
  officeUsers,
  users,
  profiles,
} from '~/db/schema';
import { zodUtils } from '~/lib/zodUtils';

const rootKey = 'office';

export const OfficeSchema = z.object({
  id: zodUtils.string(),
  displayName: zodUtils.string(),
});

export const OfficeAttendanceSchema = z.object({
  officeId: zodUtils.string(),
  arriveAt: zodUtils.string().datetime(),
  leaveAt: zodUtils.string().datetime(),
  notes: zodUtils.optional(zodUtils.string()),
});

export interface Office {
  id: string;
  displayName: string;
}

export const officeApi = {
  rootKey,
  getAll: cache(async () => {
    'use server';

    const user = await getSsrUser();
    const userOffices = await getDbClient()
      .select({
        id: offices.id,
        displayName: offices.displayName,
      })
      .from(offices)
      .innerJoin(officeUsers, eq(officeUsers.userId, user.id))
      .where(isNull(offices.deletedOn))
      .groupBy(offices.id, offices.displayName);

    return userOffices;
  }, `${rootKey}/getAll`),
  getAttendance: cache(async (id: string, from: DateTime, to: DateTime) => {
    'use server';

    const user = await getSsrUser();
    const db = getDbClient();
    const [userIsInOffice] = await db
      .select({
        id: officeUsers.id,
      })
      .from(officeUsers)
      .where(
        and(eq(officeUsers.officeId, id), eq(officeUsers.userId, user.id))
      );

    if (!userIsInOffice) {
      throw redirect('/');
    }

    const officeAttendances = db
      .select({
        id: officeAttendance.id,
        arriveAt: officeAttendance.arriveAt,
        leaveAt: officeAttendance.leaveAt,
        notes: officeAttendance.notes,
        userId: officeAttendance.userId,
        userEmail: users.email,
        userFirstName: profiles.firstName,
        userLastName: profiles.lastName,
        userAvatarUrl: profiles.avatarUrl,
      })
      .from(officeAttendance)
      .innerJoin(officeUsers, eq(officeUsers.officeId, id))
      .innerJoin(users, eq(users.id, officeAttendance.userId))
      .innerJoin(profiles, eq(profiles.userId, officeAttendance.userId))
      .where(
        and(
          eq(officeAttendance.officeId, id),
          inArray(officeUsers.userId, [user.id]),
          lte(officeAttendance.arriveAt, to.toJSDate()),
          gte(officeAttendance.leaveAt, from.toJSDate())
        )
      );

    return officeAttendances;
  }, `${rootKey}/getById`),
  addAttendance: action(async (data: FormData) => {
    'use server';
    const user = await getSsrUser();
    return await withFormData(OfficeAttendanceSchema, data, async (data) => {
      const db = getDbClient();
      const [userIsInOffice] = await db
        .select({
          id: officeUsers.id,
        })
        .from(officeUsers)
        .where(
          and(
            eq(officeUsers.officeId, data.officeId),
            eq(officeUsers.userId, user.id)
          )
        );

      if (!userIsInOffice) {
        throw redirect('/');
      }

      await getDbClient()
        .insert(officeAttendance)
        .values({
          arriveAt: new Date(data.arriveAt),
          leaveAt: new Date(data.leaveAt),
          officeId: data.officeId,
          notes: data.notes,
          userId: user.id,
        });

      throw redirect(`/office/${data.officeId}`);
    });
  }, `${rootKey}/addAttendance`),
  create: action(async (data: FormData) => {
    'use server';
    const user = await getSsrUser();

    return await withFormData(OfficeSchema, data, async (data) => {
      const newOffice = await getDbClient().transaction(async (tx) => {
        const [newOffice] = await tx
          .insert(offices)
          .values({
            id: data.id,
            displayName: data.displayName,
          })
          .returning({
            id: offices.id,
          });

        if (!newOffice) {
          tx.rollback();
          throw new TransactionRollbackError();
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
  }, `${rootKey}/create`),
};
