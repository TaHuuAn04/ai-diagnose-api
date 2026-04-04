import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { SeverityLevel } from '@app/core/domain/enums';

export class AiResultDiseaseDto {
  @ApiProperty()
  @Expose()
  diseaseId: string;

  @ApiProperty()
  @Expose()
  diseaseName: string;

  @ApiProperty()
  @Expose()
  accuracy: number;
}

export class GetAiDiagnosisResultResponseDto {
  @ApiProperty()
  @Expose()
  consultationId: string;

  @ApiProperty()
  @Expose()
  suggestedDiagnosis: string;

  @ApiPropertyOptional()
  @Expose()
  aiAdvice?: string;

  @ApiProperty({ enum: SeverityLevel, required: false, nullable: true })
  @Expose()
  severityLevel?: SeverityLevel | null;

  @ApiProperty({ type: [AiResultDiseaseDto] })
  @Expose()
  diseases: AiResultDiseaseDto[];
}
