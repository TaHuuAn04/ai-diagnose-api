import { IsNotEmpty, IsString } from "class-validator";

export class getAppointmentDate {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  date: string;
}