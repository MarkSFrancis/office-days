import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/cloudflare';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import {
  addDays,
  addWeeks,
  endOfDay,
  format,
  formatISO,
  startOfWeek,
} from 'date-fns';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ChevronLeft, ChevronRight, UsersIcon } from 'lucide-react';
import { useMemo } from 'react';
import { z } from 'zod';
import { getTitle } from '~/components/getTitle';
import { Button } from '~/components/ui/button';
import { getDbClient } from '~/db/client';
import { officeAttendance, officeUsers, profiles, users } from '~/db/schema';
import { OfficeWeek } from '~/features/calendar/OfficeWeek';
import { Navbar, NavbarContent } from '~/features/nav/Navbar';
import { getOffice } from '~/features/office/api';
import { nullPropsToUndefined } from '~/lib/utils';
import { zodUtils } from '~/lib/zodUtils';
import { withSupabaseSsr } from '~/supabase/ssrSupabase';
import { getSsrUser } from '~/supabase/ssrUser';

export const meta: MetaFunction<typeof loader> = (ctx) => [
  {
    title: getTitle(ctx, ctx.data?.office.displayName),
  },
];

const QueryStringSchema = z.object({
  start: zodUtils.optional(zodUtils.string().date()),
});

export const loader = async (ctx: LoaderFunctionArgs) => {
  const search = new URL(ctx.request.url).searchParams;

  return withSupabaseSsr(ctx, async ({ supabase }) => {
    const { officeId } = ctx.params as { officeId: string };

    const query = QueryStringSchema.safeParse(
      Object.fromEntries(search.entries())
    );

    const start = startOfWeek(
      query.data?.start ? new Date(query.data.start) : new Date(),
      { weekStartsOn: 1 }
    );

    const end = endOfDay(addDays(start, 4));

    const user = await getSsrUser(supabase);
    const db = getDbClient(ctx.context);
    const office = await getOffice(ctx.context, {
      userId: user.id,
      officeId,
    });

    if (!office) {
      throw redirect('/');
    }

    const officeAttendances = await db
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
      .innerJoin(officeUsers, eq(officeUsers.officeId, officeId))
      .innerJoin(users, eq(users.id, officeAttendance.userId))
      .leftJoin(profiles, eq(profiles.userId, officeAttendance.userId))
      .where(
        and(
          eq(officeAttendance.officeId, officeId),
          gte(officeAttendance.date, start),
          lte(officeAttendance.date, end)
        )
      )
      .then((a) => a.map(nullPropsToUndefined));

    return json({
      office: {
        displayName: office.displayName,
      },
      start,
      end,
      attendance: officeAttendances,
      userId: user.id,
    });
  });
};

export default function OfficePage() {
  const data = useLoaderData<typeof loader>();
  const params = useParams<{ officeId: string }>();

  const attendances = useMemo(() => {
    return data.attendance.map((a) => ({
      ...a,
      date: new Date(a.date),
      arriveAt: a.arriveAt ? new Date(a.arriveAt) : undefined,
      leaveAt: a.leaveAt ? new Date(a.leaveAt) : undefined,
    }));
  }, [data.attendance]);

  const lastWeek = useMemo(() => {
    const lastWeekStart = addWeeks(data.start, -1);
    return formatISO(lastWeekStart, { representation: 'date' });
  }, [params.officeId, data.start]);

  const nextWeek = useMemo(() => {
    const lastWeekStart = addWeeks(data.start, 1);
    return formatISO(lastWeekStart, { representation: 'date' });
  }, [params.officeId, data.start]);

  return (
    <div className="grid grid-rows-[auto,_minmax(0,_1fr)] flex-1">
      <Navbar>
        <NavbarContent className="justify-between items-center flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              to={{
                search: new URLSearchParams({
                  start: lastWeek,
                }).toString(),
              }}
            >
              <ChevronLeft />
              <span className="sr-only">Go back one week</span>
            </Link>
            <h1 className="text-lg font-light">
              {format(data.start, 'cccc do MMM, yyyy')}
            </h1>
            <Link
              to={{
                search: new URLSearchParams({
                  start: nextWeek,
                }).toString(),
              }}
            >
              <ChevronRight />
              <span className="sr-only">Go forward one week</span>
            </Link>
          </div>
          <Button variant="outline" className="bg-white/80" asChild>
            <Link
              className="text-right"
              to={`/office/${params.officeId}/colleagues`}
            >
              <UsersIcon className="mr-2" />
              Colleagues
            </Link>
          </Button>
        </NavbarContent>
      </Navbar>
      <OfficeWeek
        userId={data.userId}
        attendance={attendances}
        end={new Date(data.end)}
        start={new Date(data.start)}
        officeId={params.officeId!}
      />
    </div>
  );
}
