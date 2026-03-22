import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { ShowAppointmentCalendarType } from "@app/core/domain/enums";

export class GetAppointmentCalendarRequestDto {
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
    description: 'Option to specify the type of calendar view (e.g., MONTH, YEAR)',
    example: ShowAppointmentCalendarType.MONTH,
    required: false,
  })
  @IsEnum(ShowAppointmentCalendarType)
  @IsNotEmpty()
  option: ShowAppointmentCalendarType

  @ApiProperty({
    description: 'Batch size appointments for each day ',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  batch?: number
}