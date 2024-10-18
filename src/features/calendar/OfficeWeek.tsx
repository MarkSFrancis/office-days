import { Component, createMemo, For } from 'solid-js';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { officeApi } from '../office/api';
import { DateTime } from 'luxon';
import { Form } from '~/components/form/Form';
import { SubmitButton } from '~/components/form/SubmitButton';

export type Attendance = Awaited<
  ReturnType<typeof officeApi.getAttendance>
>[number];

export interface OfficeWeekProps {
  attendance: Attendance[];
  start: DateTime;
  end: DateTime;
  officeId: string;
}

const attendingOnDay = (attendance: Attendance, day: DateTime) => {
  if (DateTime.fromJSDate(attendance.leaveAt) < day.startOf('day'))
    return false;
  if (DateTime.fromJSDate(attendance.arriveAt) > day.endOf('day')) return false;

  return true;
};

const rangeToDays = (from: DateTime, to: DateTime) => {
  const days = [];
  let current = from;
  while (current <= to) {
    days.push(current);
    current = current.plus({ days: 1 });
  }

  return days;
};

export const OfficeWeek: Component<OfficeWeekProps> = (props) => {
  const datesData = createMemo(() => {
    const days = rangeToDays(props.start, props.end);

    return days.map((day) => {
      const attendances = props.attendance.filter((attendance) =>
        attendingOnDay(attendance, day)
      );

      return {
        day,
        attendances,
      };
    });
  });

  return (
    <div class="flex items-start lg:items-center lg:m-8 sm:m-4 m-2 w-full">
      <div class="flex flex-col lg:flex-row items-stretch justify-center gap-8 flex-wrap w-full">
        <For each={datesData()}>
          {({ day, attendances }) => (
            <Card class="flex flex-col items-start gap-4">
              <CardHeader>
                <CardTitle class="text-4xl font-light">
                  {day.toFormat('cccc dd')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul class="list-disc list-inside leading-8">
                  <For each={attendances}>
                    {(attendance) => (
                      <li>
                        <UserDisplay user={attendance} />
                      </li>
                    )}
                  </For>
                </ul>
              </CardContent>
              <CardFooter>
                <Form action={officeApi.addAttendance}>
                  <input type="hidden" name="officeId" value={props.officeId} />
                  <input
                    type="hidden"
                    name="arriveAt"
                    value={day.startOf('day').toISO()!}
                  />
                  <input
                    type="hidden"
                    name="leaveAt"
                    value={day.endOf('day').toISO()!}
                  />
                  <SubmitButton>Attend</SubmitButton>
                </Form>
              </CardFooter>
            </Card>
          )}
        </For>
      </div>
    </div>
  );
};

const UserDisplay = (props: { user: Attendance }) => {
  const name = createMemo(() => {
    if (props.user.userFirstName) {
      if (props.user.userLastName) {
        return `${props.user.userFirstName} ${props.user.userLastName}`;
      } else {
        return props.user.userFirstName;
      }
    } else if (props.user.userLastName) {
      return props.user.userLastName;
    } else {
      return props.user.userEmail;
    }
  });

  return <>{name()}</>;
};
