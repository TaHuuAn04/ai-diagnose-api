import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteScheduleRequestDto {
  @ApiProperty({
    description: 'List of schedule ids',
    example: ['1ddd77db-8974-4108-a9c9-a0a3ffbc03eb'],
  })
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  scheduleIds: string[];

  @ApiProperty({
    description: 'Start Current Week Date',
    example: '2026-04-06',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  startWeekDate: string;

  @ApiProperty({
    description: 'End Current Week Date',
    example: '2026-04-12',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  endWeekDate: string;

  @ApiProperty({
    description: 'Current Date',
    example: '2026-04-12',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  currentDate: string;
}
