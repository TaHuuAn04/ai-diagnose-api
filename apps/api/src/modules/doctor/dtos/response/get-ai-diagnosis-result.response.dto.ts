import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SeverityLevel } from '@app/core/domain/enums';

export class AiResultDiseaseDto {
  @ApiProperty()
  diseaseId: string;

  @ApiProperty()
  diseaseName: string;

  @ApiProperty()
  accuracy: number;
}

export class GetAiDiagnosisResultResponseDto {
  @ApiProperty()
  consultationId: string;

  @ApiProperty()
  suggestedDiagnosis: string;

  @ApiPropertyOptional()
  aiAdvice?: string;

  @ApiProperty({ enum: SeverityLevel, required: false })
  severityLevel?: SeverityLevel;

  @ApiProperty({ type: [AiResultDiseaseDto] })
  diseases: AiResultDiseaseDto[];
}
