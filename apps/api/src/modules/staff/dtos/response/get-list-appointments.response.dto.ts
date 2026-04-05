import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { AppointmentStatus, UserGender } from '@app/core/domain/enums';

@Exclude()
export class GetTodayAppointmentsResponseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  from: string;

  @Expose()
  @ApiProperty({ example: '10:00' })
  to: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  patientName: string;
    
  @Expose()
  @ApiProperty({ example: UserGender.MALE, enum: UserGender })
  gender: UserGender;

  @Expose()
  @ApiProperty({ example: '123-456-7890' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  doctorName: string;
  
  @Expose()
  @ApiProperty({ example: AppointmentStatus.SCHEDULED, enum: AppointmentStatus })
  status: AppointmentStatus;
}

@Exclude()
export class GetListAppointmentsResponseDto {
  @Expose()
  appointmentId: string;

  @Expose()
  date: string;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  patientName: string;

  @Expose()
  gender: UserGender;

  @Expose()
  phoneNumber: string;

  @Expose()
  doctorName: string;

  @Expose()
  department: string;

  @Expose()
  status: AppointmentStatus;

  @Expose()
  note: string;

  @Expose()
  description: string;
}