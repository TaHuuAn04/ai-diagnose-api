import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

import { PageOptionsDto } from '@app/core/dtos';

export class GetListDoctorRequestDto extends PageOptionsDto {
  @ApiProperty({
    description: 'Filter by shift ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  shiftId?: string;

  @ApiProperty({
    description: 'Filter by departments',
    required: false,
    example: '["Dermatology", "Neurology"]',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? (value as string[]) : [value as string]))
  @IsArray()
  @IsString({ each: true })
  departments?: string[];
}
