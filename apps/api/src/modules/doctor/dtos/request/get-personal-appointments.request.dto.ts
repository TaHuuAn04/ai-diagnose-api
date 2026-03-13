import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AppointmentStatus } from '@app/core/domain/enums';
import { PageOptionsDto } from '@app/core/dtos';

export class GetPersonalAppointmentsRequestDto extends PageOptionsDto {
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
    example: '2026-03-31',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Filter by from time (optional)',
    example: '09:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({
    description: 'Filter by to time (optional)',
    example: '17:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiProperty({
    description: 'Filter by status',
    required: false,
    example: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
