import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetScheduleRequestDto {
  @ApiProperty({
    description: 'Filter by start date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Filter by end date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
