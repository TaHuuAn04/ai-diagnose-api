import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePartientDto {
  
  @IsString()  
  @IsOptional()
  @MaxLength(25)
  @ApiProperty({ example: 'Kinh' })
  folk?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ example: 'Ho Chi Minh City' })
  address?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @ApiProperty({ example: '123456789012345' })
  citizenCode?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'AB1234567' })
  medicalInsurance?: string;
}
