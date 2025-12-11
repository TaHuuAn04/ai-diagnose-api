import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, IsUUID } from 'class-validator';

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
    description: 'Filter by department',
    required: false,
    example: 'Cardiology',
  })
  @IsOptional()
  @IsString()
  department?: string;
}
