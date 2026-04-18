import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateDoctorInfoRequestDto {
  @ApiProperty({ description: 'Experience of doctor' })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ description: 'Description about doctor' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Last name of doctor' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'First name of doctor' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Phone number of doctor' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
