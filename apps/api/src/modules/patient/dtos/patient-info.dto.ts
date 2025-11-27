import { ApiProperty } from '@nestjs/swagger';

import { ATTACHMENT_MAX_FILE_SIZE } from '@api/constants';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

import { Gender } from '@app/core/domain/enums';

import { UpdateUserDto, UserInfoDto } from '../../user/dtos';

export class PatientUpdateDto extends UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'MALE' })
    gender: Gender;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: new Date(2004 - 3 - 13) })
    dateOfBirth: Date

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '038204013123' })
    citizenCode: string

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Ho Chi Minh, Viet Nam' })
    address: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '4 79 00 670 00052' })
    medicalInsurance: string
}

export class PatientAvatarDto {
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @MaxFileSize(ATTACHMENT_MAX_FILE_SIZE)
    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary' })
    image?: MemoryStoredFile;
}

export class PatientInfoDto extends UserInfoDto {
    @Expose()
    @ApiProperty({ example: 'MALE' })
    gender: Gender;

    @Expose()
    @ApiProperty({ example: new Date(2004 - 3 - 13) })
    dateOfBirth: Date

    @Expose()
    @ApiProperty({ example: '038204013123' })
    citizenCode: string

    @Expose()
    @ApiProperty({ example: 'Ho Chi Minh, Viet Nam' })
    address?: string

    @Expose()
    @ApiProperty({ example: '4 79 00 670 00052' })
    medicalInsurance: string

    @Expose()
    @ApiProperty({ example: 'https://www.google.com/search?sca_esv=73b20ffd545e0371&sxsrf' })
    avatarUrl?: string
}

