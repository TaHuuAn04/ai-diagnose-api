import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AppointmentStatus } from '@app/core/domain/enums';
import { PageOptionsDto } from '@app/core/dtos';

export class GetTodayAppointmentsRequestDto {
  @ApiProperty({
    description: 'Filter by start month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  startMonthDate: string;

  @ApiProperty({
    description: 'Filter by end month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  endMonthDate: string;


  @ApiProperty({
    description: 'Filter by start last month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  startLastMonthDate: string;

  @ApiProperty({
    description: 'Filter by end last month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  endLastMonthDate: string;

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
  from: string;
}

export class GetListAppointmentsRequestDto extends PageOptionsDto {
  @ApiProperty({
    description: 'Filter by from date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'Filter by to date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0], // Default to current date
  })
  @IsNotEmpty()
  @IsDateString()
  toDate: string;

  @ApiProperty({
    description: 'Filter by from time',
    example: '09:00',
    required: false
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({
    description: 'Filter by to time',
    example: '17:00',
    required: false
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiProperty({
    description: 'Filter by doctor id',
    example: '0518b63b-fc8f-4c7c-9e02-c8b5e59b9557',
    required: false
  })
  @IsOptional()
  @IsString()
  doctorId?: string;


  @ApiProperty({
    description: 'Filter by status',
    example: AppointmentStatus.SCHEDULED,
    enum: AppointmentStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}