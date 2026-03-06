import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { PageOptionsDto } from '@app/core/dtos';

export class GetConsultationHistoryDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter by department name',
    required: false,
    example: 'Cardiology',
  })
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({
    description: 'Filter by date of appointment (startDate)',
    required: false,
    example: '2024-07-01',
  })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by date of appointment (endDate)',
    required: false,
    example: '2024-07-31',
  })
  @IsOptional()
  endDate?: string;
}