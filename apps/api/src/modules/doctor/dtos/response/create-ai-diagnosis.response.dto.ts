import { ApiProperty } from '@nestjs/swagger';

export class CreateAiDiagnosisResponseDto {
  @ApiProperty()
  jobId: string;

  @ApiProperty()
  status: string;
}
