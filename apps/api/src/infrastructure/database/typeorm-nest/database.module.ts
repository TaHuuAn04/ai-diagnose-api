import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { TypeOrmNestDatabaseConfig } from 'apps/api/src/config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import {
  AdmissionStaff,
  AIDiagnosisResult,
  AIResultDisease,
  Appointment,
  Chatbot,
  ChatbotQuery,
  ChatHistory,
  Consultation,
  DataInstance,
  DiagnoseModel,
  DiagnosisResult,
  Disease,
  Doctor,
  Image,
  Patient,
  ResultDisease,
  Room,
  Schedule,
  Shift,
  User,
} from './entities';
import {
  AdmissionStaffRepository,
  AIDiagnosisResultRepository,
  AIResultDiseaseRepository,
  AppointmentRepository,
  ChatbotQueryRepository,
  ChatbotRepository,
  ChatHistoryRepository,
  ConsultationRepository,
  DataInstanceRepository,
  DiagnoseModelRepository,
  DiagnosisResultRepository,
  DiseaseRepository,
  DoctorRepository,
  ImageRepository,
  PatientRepository,
  ResultDiseaseRepository,
  RoomRepository,
  ScheduleRepository,
  ShiftRepository,
  UserRepository,
} from './repository';

const Adapters = [
  {
    provide: REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.ADMISSION_STAFF_REPOSITORY,
    useClass: AdmissionStaffRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.AI_DIAGNOSIS_RESULT_REPOSITORY,
    useClass: AIDiagnosisResultRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.AI_RESULT_DISEASE_REPOSITORY,
    useClass: AIResultDiseaseRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY,
    useClass: AppointmentRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.CHATBOT_REPOSITORY,
    useClass: ChatbotRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.CHATBOT_QUERY_REPOSITORY,
    useClass: ChatbotQueryRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.CHAT_HISTORY_REPOSITORY,
    useClass: ChatHistoryRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY,
    useClass: ConsultationRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DATA_INSTANCE_REPOSITORY,
    useClass: DataInstanceRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DIAGNOSE_MODEL_REPOSITORY,
    useClass: DiagnoseModelRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DIAGNOSIS_RESULT_REPOSITORY,
    useClass: DiagnosisResultRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DISEASE_REPOSITORY,
    useClass: DiseaseRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY,
    useClass: DoctorRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY,
    useClass: ImageRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.PATIENT_REPOSITORY,
    useClass: PatientRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.RESULT_DISEASE_REPOSITORY,
    useClass: ResultDiseaseRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.ROOM_REPOSITORY,
    useClass: RoomRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY,
    useClass: ScheduleRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.SHIFT_REPOSITORY,
    useClass: ShiftRepository,
  },
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmNestDatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof TypeOrmNestDatabaseConfig>) =>
        config,
      // eslint-disable-next-line @typescript-eslint/require-await
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([
      User,
      AdmissionStaff,
      AIDiagnosisResult,
      AIResultDisease,
      Appointment,
      Chatbot,
      ChatbotQuery,
      ChatHistory,
      Consultation,
      DataInstance,
      DiagnoseModel,
      DiagnosisResult,
      Disease,
      Doctor,
      Image,
      Patient,
      ResultDisease,
      Room,
      Schedule,
      Shift,
    ]),
  ],
  providers: [...Adapters],
  exports: [...Adapters, TypeOrmModule],
})
export class ApiDatabaseModule {}
