import { OfficeAttendance } from './api';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { FC, useMemo } from 'react';
import { OfficeDay } from './OfficeDay';

export interface OfficeWeekProps {
  attendance: OfficeAttendance[];
  start: Date;
  end: Date;
  officeId: string;
  userId: string;
}

const attendingOnDay = (attendance: OfficeAttendance, day: Date) => {
  return attendance.date >= startOfDay(day) && attendance.date <= endOfDay(day);
};

const rangeToDays = (from: Date, to: Date) => {
  const days = [];
  let current = from;
  while (current <= to) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
};

export const OfficeWeek: FC<OfficeWeekProps> = (props) => {
  const datesData = useMemo(() => {
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
  }, [props]);

  return (
    <div className="flex items-start lg:items-center lg:p-8 sm:p-4 p-2 w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-center lg:gap-8 gap-2 flex-wrap w-full">
        {datesData.map(({ day, attendances }) => (
          <OfficeDay
            key={+day}
            userId={props.userId}
            attendances={attendances}
            day={day}
            officeId={props.officeId}
          />
        ))}
      </div>
    </div>
  );
};
