import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GetTodayAppointmentsRequestDto {
  @ApiProperty({
    description: 'Filter by current date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  currentDate: string;

  @ApiProperty({
    description: 'Filter by from time',
    example: '09:00',
  })
  @IsNotEmpty()
  @IsString()
  from?: string;
}
