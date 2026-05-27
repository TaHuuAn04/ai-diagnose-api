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

export class LesionResultDto {
  @ApiProperty()
  @Expose()
  lesionIndex: number;

  @ApiProperty()
  @Expose()
  topDisease: string;

  @ApiProperty({ enum: SeverityLevel })
  @Expose()
  severity: string;

  @ApiPropertyOptional()
  @Expose()
  croppedImage?: string;

  @ApiProperty({ type: [AiResultDiseaseDto] })
  @Expose()
  diseases: AiResultDiseaseDto[];
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

  @ApiPropertyOptional()
  @Expose()
  imageWithAllBboxes?: string;

  @ApiProperty({ type: [LesionResultDto] })
  @Expose()
  lesions: LesionResultDto[];

  @ApiProperty({ enum: SeverityLevel, required: false, nullable: true })
  @Expose()
  severityLevel?: SeverityLevel | null;
}
