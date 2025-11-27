import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AdmissionStaffController } from './admissionStaff.controller'

@Module({
  imports: [CqrsModule],
  controllers: [AdmissionStaffController],
  providers: [],
})
export class AdmissionStaffModule {}
