import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { Gender, UserRole } from '@app/core/domain/enums';

import { RegisterRequestDto, RegisterResponseDto } from '../../auth/dtos';

export class PrivilegeRequestDto extends RegisterRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'MALE' })
    gender: Gender

    @IsDate()
    @IsNotEmpty()
    @ApiProperty({ type: Date, example: '2004 - 03 - 13' })
    dateOfBirth: Date

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'DOCTOR' })
    role: UserRole

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Dermatology' })
    department: string

    @IsString()
    @IsOptional()   
    @ApiProperty({ example: '3 years' })
    experience: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '2213779' })
    staffCode: number
    
    @IsString()
    @IsOptional()   
    @ApiProperty({ example: 'Graduated from Tottenham University' })
    description: string
}

export class PrivilegeResponseDto extends RegisterResponseDto {
    @Expose()
    @ApiProperty({ example: 'Dermatology' })
    department?: string;
    
    @Expose()
    @ApiProperty({ example: '3 years' })
    experience?: string

    @Expose()
    @ApiProperty({ example: '2213779' })
    staffCode?: number

}