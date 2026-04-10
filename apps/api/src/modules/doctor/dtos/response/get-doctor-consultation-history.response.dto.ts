import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

export class SuggestedDiagnosisDto {
  @ApiProperty()
  diseaseName: string;

  @ApiProperty()
  accuracy: number;
}

export class ResultDiseaseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  diseaseName: string;
}

export class PrescriptionItemDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  concentration: string;

  @Expose()
  @ApiProperty()
  quantity: string;

  @Expose()
  @ApiProperty()
  dosage: string;

  @Expose()
  @ApiProperty()
  duration: number;
}

export class ConsultationDiagnosisResultDto {
  @Expose()
  @ApiPropertyOptional()
  advices?: string;

  @Expose()
  @ApiPropertyOptional()
  description?: string;

  @Expose()
  @ApiPropertyOptional()
  symstomsText?: string;

  @Expose()
  @ApiPropertyOptional()
  feedBackAI?: string;

  @Expose()
  @ApiPropertyOptional({ type: [PrescriptionItemDto] })
  prescription?: PrescriptionItemDto[];

  @Expose()
  @ApiPropertyOptional({ type: [ResultDiseaseDto] })
  diseases?: ResultDiseaseDto[];
}

@Exclude()
export class DoctorConsultationHistoryItemDto {
  @Expose()
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: 'string', format: 'date-time', required: false, nullable: true })
  startTime?: Date;

  @Expose()
  @ApiProperty({ type: 'string', format: 'date-time', required: false, nullable: true })
  endTime?: Date;

  @Expose()
  @ApiProperty({ description: 'Full name of the patient' })
  patientName: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Pre-diagnosis AI result', type: [SuggestedDiagnosisDto] })
  aiSuggestedDiagnosis?: SuggestedDiagnosisDto[] | [];

  @Expose()
  @ApiPropertyOptional({ description: 'Final diagnosis result', type: ConsultationDiagnosisResultDto })
  diagnosisResult?: ConsultationDiagnosisResultDto;
}

export class GetDoctorConsultationHistoryResponseDto extends DoctorConsultationHistoryItemDto {}
