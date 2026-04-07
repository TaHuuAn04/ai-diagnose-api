import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { AppointmentStatus, UserGender } from '@app/core/domain/enums';

import { ConsultationDiagnosisResultDto, DoctorConsultationHistoryItemDto, SuggestedDiagnosisDto } from './get-doctor-consultation-history.response.dto';

@Exclude()
export class ConsultationAppointmentInfoDto {
  @Expose()
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  date?: Date;

  @Expose()
  @ApiProperty({ example: '09:00', nullable: true })
  from?: string;

  @Expose()
  @ApiProperty({ example: '10:00', nullable: true })
  to?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Check-up description' })
  description?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Room number' })
  room?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Some note' })
  note?: string;

  @Expose()
  @ApiProperty({ example: AppointmentStatus.SCHEDULED, enum: AppointmentStatus })
  status?: AppointmentStatus;
}

@Exclude()
export class ConsultationPatientInfoDto {
  @Expose()
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: '1990-01-15', nullable: true })
  dateOfBirth?: string;

  @Expose()
  @ApiProperty({ example: UserGender.MALE, enum: UserGender, nullable: true })
  gender?: UserGender;

  @Expose()
  @ApiProperty({ example: '123-456-7890', nullable: true })
  phoneNumber?: string;
}

@Exclude()
export class GetConsultationDetailResponseDto {
  @Expose()
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @Expose()
  @Type(() => ConsultationAppointmentInfoDto)
  @ApiProperty({ type: () => ConsultationAppointmentInfoDto })
  appointment: ConsultationAppointmentInfoDto;

  @Expose()
  @Type(() => ConsultationPatientInfoDto)
  @ApiProperty({ type: () => ConsultationPatientInfoDto })
  patient: ConsultationPatientInfoDto;

  @Expose()
  @ApiPropertyOptional({ description: 'Pre-diagnosis AI result', type: [SuggestedDiagnosisDto] })
  aiSuggestedDiagnosis?: SuggestedDiagnosisDto[] | [];

  @Expose()
  @ApiPropertyOptional({ description: 'Pre-diagnosis AI proof image URL' })
  aiProof?: string | null;

  @Expose()
  @ApiPropertyOptional({ description: 'Final diagnosis result', type: ConsultationDiagnosisResultDto })
  diagnosisResult?: ConsultationDiagnosisResultDto;

  @Expose()
  @ApiProperty({ description: 'List of previous consultations for this patient', type: [DoctorConsultationHistoryItemDto] })
  pastConsultations: DoctorConsultationHistoryItemDto[];
}
