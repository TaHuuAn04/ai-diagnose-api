import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateScheduleRequestDto {
  @ApiProperty({
    description: 'Doctor id',
    example: '1ddd77db-8974-4108-a9c9-a0a3ffbc03eb',
  })
  @IsNotEmpty()
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: 'Room name',
    example: 'P101',
  })
  @IsNotEmpty()
  @IsString()
  room: string;

  @ApiProperty({
    description: 'Working Date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Start working time',
    example: '07:00:00+07',
  })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({
    description: 'End working time',
    example: '12:00:00+07',
  })
  @IsNotEmpty()
  @IsString()
  to: string;
}
