import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConsultationModule } from './consultation/consultation.module';
import { DevModeModule } from './dev-mode/dev-mode.module';
import { DifyAiModule } from './dify-ai/dify-ai.module';
import { DoctorModule } from './doctor/doctor.module';
import { EmbeddedChatModule } from './embedded-chat/embedded-chat.module';
import { PatientModule } from './patient/patient.module';
import { ShiftModule } from './shift/shift.module';
import { UserModule } from './user/user.module';
export const modules = [
  UserModule,
  AuthModule,
  ShiftModule,
  DifyAiModule,
  ConsultationModule,
  EmbeddedChatModule,
  DoctorModule,
  PatientModule,
  AppointmentModule,
  DevModeModule.registerAsync()
];
