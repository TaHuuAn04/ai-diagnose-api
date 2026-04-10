import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '@app/core/dtos';

export class GetListDiagnoseModelsRequestDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter by public status',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined
  })
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Search by model name or version',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
