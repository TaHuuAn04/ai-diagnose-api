import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiagnoseModelRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  keyModel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  modelUrl: string;
}
