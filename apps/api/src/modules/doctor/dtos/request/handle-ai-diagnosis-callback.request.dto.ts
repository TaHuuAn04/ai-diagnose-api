import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SeverityLevel } from '@app/core/domain/enums';

export class AiPredictionItemDto {
  @IsString()
  disease: string;

  @IsNumber()
  probability: number;

  @IsString()
  @IsOptional()
  severity?: string;
}

export class HandleAiDiagnosisCallbackRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  consultationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  diagnoseModelId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  disease: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  probability: number;

  @ApiProperty()
  @IsString()
  aiAdvice: string;

  @ApiPropertyOptional({ enum: SeverityLevel })
  @IsEnum(SeverityLevel)
  @IsOptional()
  severityLevel?: SeverityLevel;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageWithBbox?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  croppedImage?: string;

  @ApiPropertyOptional({ type: [AiPredictionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiPredictionItemDto)
  @IsOptional()
  allPredictions?: AiPredictionItemDto[];
}
