import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateStaffInfoRequestDto {
  @ApiProperty({ description: 'Description about staff' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Last name of staff' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'First name of staff' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Phone number of staff' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Avatar URL or base64 of staff' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
