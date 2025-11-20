import { ApiProperty } from '@nestjs/swagger';

import { ATTACHMENT_MAX_FILE_SIZE } from '@api/constants';
import { Exclude, Expose } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

import { severityLevel } from '@app/core/domain/enums';

export class ConsultationRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    patient_id: string

    @IsFile()
    @IsArray()
    @HasMimeType(['image/jpeg', 'image/png'])
    @MaxFileSize(ATTACHMENT_MAX_FILE_SIZE)
    @IsNotEmpty()
    @ApiProperty({
        type: 'array', items: { type: 'string', format: 'binary'} })
    images: MemoryStoredFile;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Vết thương nặng, nằm ở dưới chân' })
    description: string
}

@Exclude()
export class ConsultationResponseDto {
    @Expose()
    @ApiProperty({ example: 'Psoriasis' })
    suggestedDiagnosis: string;
   
    @Expose()
    @ApiProperty({ example: 'Red patches with thick white or silvery scales, often itchy, painful and cracked; commonly appearing on pressure areas like elbows and knees' })
    proof: string

    @Expose()
    @ApiProperty({ example: 'severe'})
    severityLevel: severityLevel

    @Expose()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333'})
    disease_id: string
}