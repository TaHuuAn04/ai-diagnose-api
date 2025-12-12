import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { UserInfoDto } from '../../../user/dtos';

// export class PatientUpdateDto extends UpdateUserDto {
//     @IsNotEmpty()
//     @IsString()
//     @ApiProperty({ example: 'MALE' })
//     gender: Gender;

//     @IsNotEmpty()
//     @IsString()
//     @ApiProperty({ example: new Date(2004 - 3 - 13) })
//     dateOfBirth: Date

//     @IsNotEmpty()
//     @IsString()
//     @ApiProperty({ example: '038204013123' })
//     citizenCode: string

//     @IsOptional()
//     @IsString()
//     @ApiProperty({ example: 'Ho Chi Minh, Viet Nam' })
//     address: string

//     @IsNotEmpty()
//     @IsString()
//     @ApiProperty({ example: '4 79 00 670 00052' })
//     medicalInsurance: string
// }

// export class PatientAvatarDto {
//     @IsFile()
//     @HasMimeType(['image/jpeg', 'image/png'])
//     @MaxFileSize(ATTACHMENT_MAX_FILE_SIZE)
//     @IsOptional()
//     @ApiProperty({ type: 'string', format: 'binary' })
//     image?: MemoryStoredFile;
// }

@Exclude()
export class PatientInfoDto extends UserInfoDto {
  @Expose()
  @ApiProperty({ example: 'Kinh' })
  folk?: string

  @Expose()
  @ApiProperty({ example: '038204013123' })
  citizenCode: string

  @Expose()
  @ApiProperty({ example: 'Ho Chi Minh, Viet Nam' })
  address?: string

  @Expose()
  @ApiProperty({ example: '4 79 00 670 00052' })
  medicalInsurance: string
}