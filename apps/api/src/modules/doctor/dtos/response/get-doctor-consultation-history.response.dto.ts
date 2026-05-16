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
  duration: string;
}

export class ClinicalInfoResponseDto {
  @Expose()
  @ApiProperty({ example: 'Fever, cough, sore throat', required: false })
  symptom?: string;

  @Expose()
  @ApiProperty({ example: 'Chest, throat', required: false })
  location?: string;

  @Expose()
  @ApiProperty({ example: '3 days', required: false })
  duration?: string;

  @Expose()
  @ApiProperty({ example: ['rash', 'blisters'], required: false })
  skinType?: string[];

  @Expose()
  @ApiProperty({ example: 'localized', required: false })
  severity?: 'local' | 'spread' | 'systemic';

  @Expose()
  @ApiProperty({ example: 'Penicillin allergy', required: false })
  allergy?: string;

  @Expose()
  @ApiProperty({ example: 'No history of asthma', required: false })
  history?: string;

  @Expose()
  @ApiProperty({ example: 'MALE', required: false })
  gender?: string;

  @Expose()
  @ApiProperty({ example: 30, required: false })
  age?: number;

  @Expose()
  @ApiProperty({ example: 'no', required: false })
  genetic?: string;
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

  @Expose()
  @ApiPropertyOptional()
  clinicalInfo?: ClinicalInfoResponseDto | null;
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
