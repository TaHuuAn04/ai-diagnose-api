import { Exclude, Expose } from 'class-transformer';

import { AppointmentStatus, WorkingTimeStatus } from '@app/core/domain/enums';

@Exclude()
export class BookShiftResponseDto {
  @Expose()
  appointmentId: string;

  @Expose()
  workingTimeId: string;

  @Expose()
  doctorId: string;

  @Expose()
  patientId: string;

  @Expose()
  shiftId: string;

  @Expose()
  appointmentStatus: AppointmentStatus;

  @Expose()
  workingTimeStatus: WorkingTimeStatus;

  @Expose()
  description?: string;

  @Expose()
  message: string;
}
