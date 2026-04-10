import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDiagnoseModelRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keyModel?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelUrl?: string;
}
