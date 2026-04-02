import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { HasMimeType, IsFiles, MemoryStoredFile } from 'nestjs-form-data';

export class BookShiftRequestDto {
  @ApiProperty({ 
    description: 'Doctor ID',
    example: '0518b63b-fc8f-4c7c-9e02-c8b5e59b9557'
  })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ 
    description: 'Shift ID to book',
    example: '5543f3af-19b4-43b8-920b-db756f97cca1'
  })
  @IsUUID()
  @IsNotEmpty()
  shiftId: string;

  @ApiProperty({ 
    description: 'Date to book',
    example: '2026-04-02'
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ 
    description: 'Patient ID',
    example: '0571f8d8-d934-4a1c-87bd-49bf5a922307'
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    description: 'List of image URLs related to the appointment (optional)',
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false
  })
  @ValidateIf((_, value) => {
    return Boolean(
      Array.isArray(value) &&
      value.length > 0 &&
      value[0]?.originalName
    );
  })
  @IsOptional()
  @IsFiles()
  @HasMimeType(
    ['image/jpeg', 'image/png', 'image/jpg'],
    { each: true }
  )
  images?: MemoryStoredFile[];  

  @ApiProperty({ 
    description: 'Appointment description (optional)',
    example: 'Regular checkup',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}
