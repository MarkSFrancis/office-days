import { AppLoadContext } from '@remix-run/cloudflare';
import { and, eq } from 'drizzle-orm';
import { getDbClient } from '~/db/client';
import { offices, officeUsers } from '~/db/schema';

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
