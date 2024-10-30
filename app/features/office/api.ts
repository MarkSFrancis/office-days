import { AppLoadContext } from '@remix-run/cloudflare';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { getDbClient } from '~/db/client';
import { cteToJson, executeMultiQuery } from '~/db/multiQuery';
import {
  officeAttendance,
  offices,
  officeUsers,
  profiles,
  users,
} from '~/db/schema';

export interface Office {
  id: string;
  displayName: string;
}

export const getOfficeUser = async (
  context: AppLoadContext,
  params: { userId: string; officeId: string }
) => {
  const db = getDbClient(context);

  const [userIsInOffice] = await db
    .select({
      id: officeUsers.id,
    })
    .from(officeUsers)
    .where(
      and(
        eq(officeUsers.officeId, params.officeId),
        eq(officeUsers.userId, params.userId)
      )
    )
    .limit(1);

  return userIsInOffice;
};

export const getOffice = async (
  context: AppLoadContext,
  params: { userId: string; officeId: string }
) => {
  const db = getDbClient(context);

  const [officeUser] = await db
    .select({
      id: offices.id,
      displayName: offices.displayName,
      officeUserId: officeUsers.id,
    })
    .from(officeUsers)
    .where(
      and(
        eq(officeUsers.officeId, params.officeId),
        eq(officeUsers.userId, params.userId)
      )
    )
    .innerJoin(offices, eq(offices.id, officeUsers.officeId))
    .limit(1);

  return officeUser;
};

export const getOfficeAttendance = async (
  context: AppLoadContext,
  params: { userId: string; officeId: string; start: Date; end: Date }
) => {
  const db = getDbClient(context);

  const officeQuery = db.$with('officeQuery').as(
    db
      .select({
        id: offices.id,
        displayName: offices.displayName,
      })
      .from(offices)
      .where(
        and(
          eq(offices.id, params.officeId),
          eq(officeUsers.userId, params.userId)
        )
      )
      .innerJoin(officeUsers, eq(officeUsers.officeId, offices.id))
      .limit(1)
  );

  const allColleagues = db.$with('officeColleagues').as(
    db
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
      .where(eq(officeUsers.officeId, params.officeId))
      .innerJoin(officeQuery, sql`TRUE`) // Only return results if the user can access the office
      .innerJoin(users, eq(users.id, officeUsers.userId))
      .leftJoin(profiles, eq(profiles.userId, officeUsers.userId))
  );

  const allAttendances = db.$with('officeAttendances').as(
    db
      .select({
        id: officeAttendance.id,
        date: officeAttendance.date,
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
      .innerJoin(officeQuery, sql`TRUE`) // Only return results if the user can access the office
      .innerJoin(users, eq(users.id, officeAttendance.userId))
      .leftJoin(profiles, eq(profiles.userId, officeAttendance.userId))
      .where(
        and(
          eq(officeAttendance.officeId, params.officeId),
          gte(officeAttendance.date, params.start),
          lte(officeAttendance.date, params.end)
        )
      )
  );

  const res2 = await db
    .with(officeQuery, allColleagues, allAttendances)
    .select({
      office: cteToJson(officeQuery).as('myOffice'),
      colleagues: cteToJson(allColleagues).as('colleagues'),
      attendances: cteToJson(allAttendances).as('attendances'),
    })
    .from(officeQuery);

  const res = await executeMultiQuery(db, {
    myOffice: officeQuery,
    colleagues: allColleagues,
    attendances: allAttendances,
  });

  console.dir({ res, res2 }, { depth: null, colors: true });

  return res;
};
