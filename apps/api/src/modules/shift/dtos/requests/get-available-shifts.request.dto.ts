import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { WorkingTimeStatus } from '@app/core/domain/enums';
export class GetShiftsByDoctorIdRequestDto {
  @ApiProperty({ 
    description: 'Start date filter',
    example: '2025-12-11',
    required: true
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    description: 'End date filter',
    example: '2025-12-31',
    required: true
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Shift status filter (optional)',
    example: WorkingTimeStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkingTimeStatus)
  status?: WorkingTimeStatus;
}
