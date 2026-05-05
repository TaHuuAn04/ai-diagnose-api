import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { AdminController } from './admin.controller';
import { AdminService } from './infrastructures';
import {
  CreateAdmissionStaffAccountCommandHandler,
  CreateChatbotModelCommandHandler,
  CreateDiagnoseModelCommandHandler,
  CreateDoctorAccountCommandHandler,
  DeleteAdmissionStaffAccountCommandHandler,
  DeleteChatbotModelCommandHandler,
  DeleteDiagnoseModelCommandHandler,
  DeleteDoctorAccountCommandHandler,
  GetListChatbotModelsQueryHandler,
  GetListDiagnoseModelsQueryHandler,
  GetListPatientQueryHandler,
  GetListStaffQueryHandler,
  GetDoctorPatientsQueryHandler,
  GetPatientConsultationsQueryHandler,
  GetTopDiseasesQueryHandler,
  GetUserStatisticsQueryHandler,
  UpdateAdmissionStaffAccountCommandHandler,
  UpdateChatbotModelCommandHandler,
  UpdateDiagnoseModelCommandHandler,
  UpdateDoctorAccountCommandHandler,
  UpdatePatientOnboardingCommandHandler,
} from './use-cases';
import { GetDoctorPerformanceStatisticsQueryHandler } from './use-cases/get-doctor-performance-statistics.use-case';
import { GetSystemOverviewQueryHandler } from './use-cases/get-system-overview.use-case';

const Handlers = [
  CreateDoctorAccountCommandHandler,
  CreateAdmissionStaffAccountCommandHandler,
  UpdateDoctorAccountCommandHandler,
  DeleteDoctorAccountCommandHandler,
  UpdateAdmissionStaffAccountCommandHandler,
  DeleteAdmissionStaffAccountCommandHandler,
  GetListStaffQueryHandler,
  GetListPatientQueryHandler,
  CreateDiagnoseModelCommandHandler,
  UpdateDiagnoseModelCommandHandler,
  DeleteDiagnoseModelCommandHandler,
  GetListDiagnoseModelsQueryHandler,
  CreateChatbotModelCommandHandler,
  UpdateChatbotModelCommandHandler,
  DeleteChatbotModelCommandHandler,
  GetListChatbotModelsQueryHandler,
  GetDoctorPerformanceStatisticsQueryHandler,
  GetSystemOverviewQueryHandler,
  GetUserStatisticsQueryHandler,
  GetDoctorPatientsQueryHandler,
  GetPatientConsultationsQueryHandler,
  GetTopDiseasesQueryHandler,
  UpdatePatientOnboardingCommandHandler,
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.ADMIN_SERVICE,
    useClass: AdminService,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [AdminController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class AdminModule {}
