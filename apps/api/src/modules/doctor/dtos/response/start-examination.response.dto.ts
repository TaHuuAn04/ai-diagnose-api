import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class StartExaminationResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Consultation ID' })
  @Expose()
  consultationId: string;
}
