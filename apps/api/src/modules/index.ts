import { AdminModule } from './admin/admin.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConsultationModule } from './consultation/consultation.module';
import { DevModeModule } from './dev-mode/dev-mode.module';
import { DifyAiModule } from './dify-ai/dify-ai.module';
import { DoctorModule } from './doctor/doctor.module';
import { EmbeddedChatModule } from './embedded-chat/embedded-chat.module';
import { PatientModule } from './patient/patient.module';
import { ShiftModule } from './shift/shift.module';
import { StaffModule } from './staff/staff.module';
import { UserModule } from './user/user.module';
export const modules = [
  AdminModule,
  UserModule,
  AuthModule,
  ShiftModule,
  DifyAiModule,
  ConsultationModule,
  EmbeddedChatModule,
  DoctorModule,
  PatientModule,
  AppointmentModule,
  StaffModule,
  DevModeModule.registerAsync()
];
