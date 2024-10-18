import { createAsync, RouteDefinition, useParams } from '@solidjs/router';
import { OfficeWeek } from '~/features/calendar/OfficeWeek';
import { officeApi } from '~/features/office/api';
import { DateTime } from 'luxon';

export const route = {
  preload: async ({ params }) => {
    const startOfWeek = DateTime.now().startOf('week');
    const endOfWeek = DateTime.now().endOf('week');

    await officeApi.getAttendance(
      params.officeId as string,
      startOfWeek,
      endOfWeek
    );
  },
} satisfies RouteDefinition;

export default function OfficePage() {
  const params = useParams<{ officeId: string }>();
  const startOfWeek = DateTime.utc().startOf('week');
  const endOfWeek = DateTime.utc().startOf('week').plus({ days: 4 });

  const attendance = createAsync(
    () => officeApi.getAttendance(params.officeId, startOfWeek, endOfWeek),
    {
      deferStream: true,
    }
  );

  return (
    <OfficeWeek
      start={startOfWeek}
      end={endOfWeek}
      officeId={params.officeId}
      attendance={attendance() ?? []}
    />
  );
}
