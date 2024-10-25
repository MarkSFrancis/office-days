import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { OfficeAttendance } from './api';
import { format, formatISO } from 'date-fns';
import { FC, useMemo } from 'react';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/forms/Form';
import { useForm } from '~/components/forms/useForm';
import {
  AddOfficeAttendanceSchema,
  validator,
} from '~/routes/office.$officeId.attend';
import { z } from 'zod';
import { Building2Icon, HomeIcon } from 'lucide-react';

export interface OfficeDayProps {
  attendances: OfficeAttendance[];
  day: Date;
  officeId: string;
  userId: string;
}

export const OfficeDay: FC<OfficeDayProps> = (props) => {
  const form = useForm<z.output<typeof AddOfficeAttendanceSchema>>({
    validator,
    action: `/office/${props.officeId}/attend`,
    method: 'post',
  });

  const userIsAttending = useMemo(
    () => props.attendances.some((a) => a.userId === props.userId),
    [props.userId, props.attendances]
  );

  return (
    <Card className="flex flex-col items-start gap-4">
      <CardHeader>
        <CardTitle className="text-4xl font-light">
          {format(props.day, 'ccc do')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside leading-8">
          {props.attendances.map((attendance) => (
            <li key={attendance.id}>
              <UserDisplay user={attendance} />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="self-stretch">
        <Form form={form} className="w-full">
          <input type="hidden" name="officeId" value={props.officeId} />
          <input
            type="hidden"
            name="date"
            value={formatISO(props.day, {
              representation: 'date',
            })}
          />
          <input
            type="checkbox"
            name="setAttendance"
            className="hidden"
            readOnly
            checked={!userIsAttending}
          />
          <Button type="submit" isPending={form.formState.isSubmitting}>
            {userIsAttending ? (
              <>
                {!form.formState.isSubmitting && <HomeIcon className="mr-2" />}
                <span>Stay at home</span>
              </>
            ) : (
              <>
                {!form.formState.isSubmitting && (
                  <Building2Icon className="mr-2" />
                )}
                <span>Join the office</span>
              </>
            )}
          </Button>
        </Form>
      </CardFooter>
    </Card>
  );
};

const UserDisplay = (props: { user: OfficeAttendance }) => {
  const name = useMemo(() => {
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
  }, [props.user]);

  return <>{name}</>;
};
