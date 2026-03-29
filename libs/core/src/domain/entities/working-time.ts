import { WorkingTimeStatus } from "../enums";

import { AppointmentEntity } from "./appointment";
import { BaseEntityWithoutId } from "./base";
import { DoctorEntity } from "./doctor";
import { ShiftEntity } from "./shift";

export class WorkingTimeEntity extends BaseEntityWithoutId {
  doctorId: string;

  appointmentId?: string | null;

  shiftId: string;

  status: WorkingTimeStatus;

  doctor?: DoctorEntity;

  appointment?: AppointmentEntity | null;

  shift?: ShiftEntity;

  date: string;
}