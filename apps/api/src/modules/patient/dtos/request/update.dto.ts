import { ApiProperty } from "@nestjs/swagger";

import { IsOptional, IsString, MaxLength } from "class-validator";

import { UpdateUserDto } from "../../../user/dtos"

export class UpdatePatientDto extends UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'Kinh', required: false })
  folk?: string;

 
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ example: 'Ho Chi Minh City' })
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  @ApiProperty({ example: '123456789012345' })
  citizenCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(25)
  @ApiProperty({ example: 'AB1234567' })
  medicalInsurance?: string;
}