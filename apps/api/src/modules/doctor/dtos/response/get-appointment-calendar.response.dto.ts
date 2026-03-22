import { ApiProperty } from "@nestjs/swagger";

import { Expose, Type } from "class-transformer"

export class AppointmentCalendarItemDto {
  @Expose()
  id: string;

  @Expose()
  patientId: string;

  @Expose()
  patientName: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  doctorName?: string;

  @Expose()
  department?: string;

  @Expose()
  description?: string;

  @Expose()
  status: string;
}

export class GetAppointmentCalendarResponseDto {
  @ApiProperty({ type: [AppointmentCalendarItemDto] })
  @Expose()
  @Type(() => AppointmentCalendarItemDto)
  appointments?: AppointmentCalendarItemDto[];

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  date: Date;
}