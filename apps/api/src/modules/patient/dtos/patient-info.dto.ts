import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Gender } from '@app/core/domain/enums';

import { UpdateUserDto, UserInfoDto } from '../../user/dtos';

export class PatientUpdateDto extends UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'MALE' })
    gender: Gender;

    @IsOptional()
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
    address: string

    @Expose()
    @ApiProperty({ example: '4 79 00 670 00052' })
    medicalInsurance: string
}

