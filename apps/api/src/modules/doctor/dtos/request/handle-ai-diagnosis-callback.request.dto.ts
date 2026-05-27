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

export class LesionCallbackDto {
  @IsNumber()
  lesionIndex: number;

  @IsString()
  topDisease: string;

  @IsNumber()
  topProbability: number;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  croppedImage?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiPredictionItemDto)
  allPredictions: AiPredictionItemDto[];
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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageWithAllBboxes?: string;

  @ApiPropertyOptional({ type: [LesionCallbackDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LesionCallbackDto)
  @IsOptional()
  lesions?: LesionCallbackDto[];
}
