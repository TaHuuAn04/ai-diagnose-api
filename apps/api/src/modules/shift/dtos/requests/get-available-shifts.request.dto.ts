import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class GetAvailableShiftsRequestDto {
  @ApiProperty({ 
    description: 'Doctor ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  doctorId: string;

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
}
