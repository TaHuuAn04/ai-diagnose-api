import { ApiProperty } from '@nestjs/swagger';

// import { Exclude, Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

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

