import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

import { PageOptionsDto } from '@app/core/dtos';

export class GetDoctorConsultationHistoryRequestDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by patient name keyword' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter by start date (ISO 8601 string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter by end date (ISO 8601 string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
  
  @ApiPropertyOptional({ description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string;
}
