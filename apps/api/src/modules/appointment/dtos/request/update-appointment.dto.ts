import { ApiProperty } from "@nestjs/swagger";

import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { HasMimeType, IsFiles, MemoryStoredFile } from 'nestjs-form-data';

export class UpdateAppointmentDto {
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