import { Inject, Injectable, Logger } from '@nestjs/common';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAdmissionStaffRepository, IDoctorRepository, IUserRepository } from '@api/repository';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';


import { UserRole } from '@app/core/domain/enums';
import { BadRequestException } from '@app/core/exception';

import { hashPassword } from '../../auth/utils';
import {
  CreateAdmissionStaffAccountRequestDto,
  CreateAdmissionStaffAccountResponseDto,
  CreateDoctorAccountRequestDto,
  CreateDoctorAccountResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

@Injectable()
export class AdminService implements IAdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.ADMISSION_STAFF_REPOSITORY)
    private readonly admissionStaffRepository: IAdmissionStaffRepository,
  ) {}

  @Transactional()
  async createDoctorAccount(
    payload: CreateDoctorAccountRequestDto,
  ): Promise<CreateDoctorAccountResponseDto> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email has already been registered.');
      }

      const existingDoctor = await this.doctorRepository.findOne({
        where: { doctorCode: payload.doctorCode },
      });

      if (existingDoctor) {
        throw new BadRequestException('Doctor code has already been registered.');
      }

      const hashedPassword = await hashPassword(payload.password);

      const newUser = await this.userRepository.create({
        email: payload.email,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        phoneCode: payload.phoneCode,
        phoneNumber: payload.phoneNumber,
        role: UserRole.DOCTOR,
        isOnBoardingCompleted: true,
      });

      await this.doctorRepository.create({
        userId: newUser.id,
        doctorCode: payload.doctorCode,
        department: payload.department,
        experience: payload.experience,
        description: payload.description,
      });

      this.logger.log(`Created new Doctor Account - UserID: ${newUser.id}`);

      return plainToInstance(CreateDoctorAccountResponseDto, {
        userId: newUser.id,
      });
    } catch (error) {
      this.logger.error('Failed to create Doctor Account', error);
      throw error;
    }
  }

  @Transactional()
  async createAdmissionStaffAccount(
    payload: CreateAdmissionStaffAccountRequestDto,
  ): Promise<CreateAdmissionStaffAccountResponseDto> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email has already been registered.');
      }

      const existingStaff = await this.admissionStaffRepository.findOne({
        where: { staffCode: payload.staffCode },
      });

      if (existingStaff) {
        throw new BadRequestException('Staff code has already been registered.');
      }

      const hashedPassword = await hashPassword(payload.password);

      const newUser = await this.userRepository.create({
        email: payload.email,
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        phoneCode: payload.phoneCode,
        phoneNumber: payload.phoneNumber,
        role: UserRole.STAFF,
        isOnBoardingCompleted: true,
      });

      await this.admissionStaffRepository.create({
        userId: newUser.id,
        staffCode: payload.staffCode,
        department: payload.department,
        description: payload.description,
      });

      this.logger.log(`Created new Admission Staff Account - UserID: ${newUser.id}`);

      return plainToInstance(CreateAdmissionStaffAccountResponseDto, {
        userId: newUser.id,
      });
    } catch (error) {
      this.logger.error('Failed to create Admission Staff Account', error);
      throw error;
    }
  }
}
