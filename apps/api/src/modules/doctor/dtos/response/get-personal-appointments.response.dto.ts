import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { AppointmentStatus, UserGender } from '@app/core/domain/enums';
import { ImageInfoDto } from '@app/core/dtos';

@Exclude()
export class GetPersonalAppointmentsResponseDto {
  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  patientId: string;

  @Expose()
  @ApiProperty({ example: '2026-03-15' })
  date: string;

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
  @ApiProperty({ example: '1990-01-15' })
  dateOfBirth: string;

  @Expose()
  @ApiProperty({ example: '123-456-7890' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: UserGender.MALE, enum: UserGender })
  gender: UserGender;
  
  @Expose()
	@ApiProperty({ example: 'Regular check-up appointment' })
  description?: string | null;
  
  @Expose()
  @ApiProperty({ example: ['Diabetes', 'Hypertension'] })
  previousDiseases: string[] | [];

  @Expose()
  @ApiProperty({ example: AppointmentStatus.SCHEDULED, enum: AppointmentStatus })
  status: AppointmentStatus;

  @Expose()
  @ApiProperty({ example: [{ base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', order: 1 }] })
  images?: ImageInfoDto[] | [];
}
