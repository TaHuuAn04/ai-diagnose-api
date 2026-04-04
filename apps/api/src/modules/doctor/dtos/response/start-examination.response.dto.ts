import { ApiProperty } from '@nestjs/swagger';

export class StartExaminationResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Consultation ID' })
  consultationId: string;
}
