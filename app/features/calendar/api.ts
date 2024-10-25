export interface OfficeAttendance {
  id: number;
  date: Date;
  arriveAt?: Date;
  leaveAt?: Date;
  notes?: string;
  userId: string;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userAvatarUrl?: string;
}
