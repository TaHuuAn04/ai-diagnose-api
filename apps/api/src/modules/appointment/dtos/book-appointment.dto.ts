import { ApiProperty } from '@nestjs/swagger';

import { ATTACHMENT_MAX_FILE_SIZE } from '@api/constants';
import { Exclude, Expose, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data'

export class BookAppointmentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    doctor_id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    shift_id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Elderly patient, please be gentle' })
    description?: string;

    @IsFile()
    @IsArray()
    @HasMimeType(['image/jpeg', 'image/png'])
    @MaxFileSize(ATTACHMENT_MAX_FILE_SIZE)
    @IsOptional()
    @ApiProperty({
        type: 'array', items: { type: 'string', format: 'binary'} })
    images?: MemoryStoredFile;

}

@Exclude()
export class AppointmentDetailDto {
    @Expose()
    @ApiProperty({ example: 'Nguyễn Cao Tuấn' })
    doctorName: string
  
    @Expose()
    @ApiProperty({ example: 'Tạ Hữu An' })
    patientName: string

    @Expose()
    @Type(() => Date)
    @ApiProperty({
      type: String,
      format: 'date-time',
      example: '2025-11-13T14:30:00.000Z',
      description: 'Start time (ISO 8601, date-time)'
    })
    from: Date

    @Expose()
    @Type(() => Date)
    @ApiProperty({
      type: String,
      format: 'date-time',
      example: '2025-11-13T15:00:00.000Z',
      description: 'End time (ISO 8601, date-time)'
    })
    to: Date

    @Expose()
    @ApiProperty({ example: 'Elderly patient, please be gentle'})
    description?: string
}