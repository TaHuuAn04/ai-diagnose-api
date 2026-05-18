import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsUUID } from "class-validator";

export class CancelAppointmentPublicDto {
  @ApiProperty({ description: 'ID of the appointment to cancel', type: String })
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({ description: 'ID of the patient who owns the appointment', type: String })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;
}
