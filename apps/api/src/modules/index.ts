import { AdminModule } from './admin/admin.module';
import { AdmissionStaffModule } from './admissionStaff/admissionStaff.module';
import { AIModule } from './ai/ai.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConsultationModule } from './consultation/consultation.module';
import { DevModeModule } from './dev-mode/dev-mode.module';
// import { DiseaseModule } from './disease/disease.module';
import { DoctorModule } from './doctor/doctor.module'
import { PatientModule } from './patient/patient.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UserModule } from './user/user.module';
export const modules = [
    AIModule,
    AuthModule,
    // DiseaseModule,
    ScheduleModule,
    AppointmentModule,
    ConsultationModule,
    DoctorModule,
    UserModule,
    AdminModule,
    AdmissionStaffModule,
    PatientModule,
    DevModeModule.registerAsync()];
