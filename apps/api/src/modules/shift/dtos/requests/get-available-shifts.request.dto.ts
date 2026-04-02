import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsOptional } from 'class-validator';

import { WorkingTimeStatus } from '@app/core/domain/enums';
import { PageOptionsDto } from '@app/core/dtos';
export class GetShiftsByDoctorIdRequestDto {
  @ApiProperty({ 
    description: 'Start date filter (optional)',
    example: '2025-12-11',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    description: 'End date filter (optional)',
    example: '2025-12-31',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Shift status filter (optional)',
    example: WorkingTimeStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkingTimeStatus)
  status?: WorkingTimeStatus;
}
