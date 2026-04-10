import { ApiProperty } from "@nestjs/swagger";

import { IsOptional, IsString } from 'class-validator';

export class TakeNoteAppointmentDto {
  @ApiProperty({ 
    description: 'Appointment note take by Admission Staff',
    example: 'Patient is waiting for the doctor',
  })
  @IsOptional()
  @IsString()
  note?: string;
}