import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageWithBbox?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  croppedImage?: string;
}
