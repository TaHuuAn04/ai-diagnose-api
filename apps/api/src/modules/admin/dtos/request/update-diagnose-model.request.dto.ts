import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ModelConfigDto } from './model-config.dto';

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
  @ValidateNested()
  @Type(() => ModelConfigDto)
  @IsOptional()
  modelConfig?: ModelConfigDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelUrl?: string;
}
