import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { AppointmentStatus } from '@app/core/domain/enums';
import { PageOptionsDto } from '@app/core/dtos';

export class GetListAppointmentDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter by appointment status',
    required: false,
    example: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}