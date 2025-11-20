import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

import { ScheduleDto } from '../../schedule/dtos';

export class ScheduleFileRequestDto {
    @IsFile()
    @IsNotEmpty()
    @HasMimeType(['text/csv', 'application/csv', 'application/vnd.ms-excel'])
    @ApiProperty({ type: 'string', format: 'binary', description: 'CSV file containing the schedule' })
    file: MemoryStoredFile

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Additional notes' })
    note?: string
}

@Exclude()
export class ListScheduleInfo{
    @Expose()
    @ApiProperty({ type: ScheduleDto, isArray: true })
    appointments: ScheduleDto[]

    @Expose()
    @ApiProperty({ example: 1 })
    currentPage: number

    @Expose()
    @ApiProperty({ example: 10 })
    pageSize: number

    @Expose()
    @ApiProperty({ example: 10 })
    totalPages: number
}