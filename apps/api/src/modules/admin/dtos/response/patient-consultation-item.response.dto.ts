import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PatientConsultationItemResponseDto {
  @ApiProperty()
  @Expose()
  consultationId: string;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiPropertyOptional()
  @Expose()
  diagnosis: string;

  @ApiProperty()
  @Expose()
  hasAiUsage: boolean;
}
