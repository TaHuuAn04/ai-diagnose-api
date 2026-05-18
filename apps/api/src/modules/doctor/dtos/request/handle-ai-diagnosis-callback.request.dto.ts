import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

import { SeverityLevel } from '@app/core/domain/enums';

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
}
