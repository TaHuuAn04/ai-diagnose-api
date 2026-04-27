import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ModelConfigDto } from './model-config.dto';

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
  @ValidateNested()
  @Type(() => ModelConfigDto)
  @IsNotEmpty()
  modelConfig: ModelConfigDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelUrl?: string;
}
