import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

export class StartExaminationRequestDto {
  @ApiProperty({ example: 'uuid', description: 'Patient ID' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ example: 'uuid', description: 'Appointment ID' })
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;
}
