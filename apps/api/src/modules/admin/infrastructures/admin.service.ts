import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  IAdmissionStaffRepository,
  IChatbotRepository,
  IDiagnoseModelRepository,
  IDoctorRepository,
  IUserRepository,
  WhereCondition,
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { ChatbotEntity, DiagnoseModelEntity } from '@app/core/domain/entities';
import { UserRole } from '@app/core/domain/enums';
import { PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, NotFoundException } from '@app/core/exception';

import { hashPassword } from '../../auth/utils';
import {
  ChatbotModelResponseDto,
  CreateAdmissionStaffAccountRequestDto,
  CreateAdmissionStaffAccountResponseDto,
  CreateChatbotModelRequestDto,
  CreateDiagnoseModelRequestDto,
  CreateDoctorAccountRequestDto,
  CreateDoctorAccountResponseDto,
  DeleteAdmissionStaffAccountResponseDto,
  DeleteDoctorAccountResponseDto,
  DiagnoseModelResponseDto,
  GetListChatbotModelsRequestDto,
  GetListDiagnoseModelsRequestDto,
  UpdateAdmissionStaffAccountRequestDto,
  UpdateAdmissionStaffAccountResponseDto,
  UpdateChatbotModelRequestDto,
  UpdateDiagnoseModelRequestDto,
  UpdateDoctorAccountRequestDto,
  UpdateDoctorAccountResponseDto,
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

    @Inject(REPOSITORY_INJECTION_TOKEN.DIAGNOSE_MODEL_REPOSITORY)
    private readonly diagnoseModelRepository: IDiagnoseModelRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CHATBOT_REPOSITORY)
    private readonly chatbotRepository: IChatbotRepository,
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

  @Transactional()
  async updateDoctorAccount(
    id: string,
    payload: UpdateDoctorAccountRequestDto,
  ): Promise<UpdateDoctorAccountResponseDto> {
    const existingDoctor = await this.doctorRepository.findOne({
      where: { userId: id },
    });

    if (!existingDoctor) {
      throw new NotFoundException('Doctor account not found.');
    }

    const {
      department,
      experience,
      description,
      ...userPayload
    } = payload;

    if (Object.keys(userPayload).length > 0) {
      await this.userRepository.update(id, userPayload);
    }

    if (department || experience !== undefined || description !== undefined) {
      await this.doctorRepository.update(existingDoctor.userId, {
        ...(department && { department }),
        ...(experience !== undefined && { experience }),
        ...(description !== undefined && { description }),
      });
    }

    this.logger.log(`Updated Doctor Account - UserID: ${id}`);
    return plainToInstance(UpdateDoctorAccountResponseDto, { success: true });
  }

  @Transactional()
  async deleteDoctorAccount(
    id: string,
  ): Promise<DeleteDoctorAccountResponseDto> {
    const existingDoctor = await this.doctorRepository.findOne({
      where: { userId: id },
    });

    if (!existingDoctor) {
      throw new NotFoundException('Doctor account not found.');
    }

    await this.doctorRepository.softDelete(existingDoctor.userId);
    await this.userRepository.softDelete(id);

    this.logger.log(`Deleted Doctor Account - UserID: ${id}`);
    return plainToInstance(DeleteDoctorAccountResponseDto, { success: true });
  }

  @Transactional()
  async updateAdmissionStaffAccount(
    id: string,
    payload: UpdateAdmissionStaffAccountRequestDto,
  ): Promise<UpdateAdmissionStaffAccountResponseDto> {
    const existingStaff = await this.admissionStaffRepository.findOne({
      where: { userId: id },
    });

    if (!existingStaff) {
      throw new NotFoundException('Admission staff account not found.');
    }

    const {
      department,
      description,
      ...userPayload
    } = payload;

    if (Object.keys(userPayload).length > 0) {
      await this.userRepository.update(id, userPayload);
    }

    if (department || description !== undefined) {
      await this.admissionStaffRepository.update(existingStaff.userId, {
        ...(department && { department }),
        ...(description !== undefined && { description }),
      });
    }

    this.logger.log(`Updated Admission Staff Account - UserID: ${id}`);
    return plainToInstance(UpdateAdmissionStaffAccountResponseDto, { success: true });
  }

  @Transactional()
  async deleteAdmissionStaffAccount(
    id: string,
  ): Promise<DeleteAdmissionStaffAccountResponseDto> {
    const existingStaff = await this.admissionStaffRepository.findOne({
      where: { userId: id },
    });

    if (!existingStaff) {
      throw new NotFoundException('Admission staff account not found.');
    }

    await this.admissionStaffRepository.softDelete(existingStaff.userId);
    await this.userRepository.softDelete(id);

    this.logger.log(`Deleted Admission Staff Account - UserID: ${id}`);
    return plainToInstance(DeleteAdmissionStaffAccountResponseDto, { success: true });
  }

  @Transactional()
  async createDiagnoseModel(
    payload: CreateDiagnoseModelRequestDto,
  ): Promise<DiagnoseModelResponseDto> {
    const existing = await this.diagnoseModelRepository.findOne({
      where: { version: payload.version },
    });

    if (existing) {
      throw new BadRequestException('Diagnose model version already exists.');
    }

    if (payload.isPublic) {
      await this.diagnoseModelRepository.updateMany(
        { isPublic: true },
        { isPublic: false }
      );
    }

    const newModel = await this.diagnoseModelRepository.create(payload);
    this.logger.log(`Created new Diagnose Model - Version: ${payload.version}`);
    return plainToInstance(DiagnoseModelResponseDto, newModel, {
      excludeExtraneousValues: true,
    });
  }

  @Transactional()
  async updateDiagnoseModel(
    id: string,
    payload: UpdateDiagnoseModelRequestDto,
  ): Promise<DiagnoseModelResponseDto> {
    const existing = await this.diagnoseModelRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Diagnose model not found.');
    }

    if (payload.isPublic && !existing.isPublic) {
      await this.diagnoseModelRepository.updateMany(
        { isPublic: true },
        { isPublic: false }
      );
    }

    const updated = await this.diagnoseModelRepository.update(id, payload);
    this.logger.log(`Updated Diagnose Model - ID: ${id}`);
    return plainToInstance(DiagnoseModelResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Transactional()
  async deleteDiagnoseModel(id: string): Promise<boolean> {
    const existing = await this.diagnoseModelRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Diagnose model not found.');
    }

    await this.diagnoseModelRepository.softDelete(id);
    this.logger.log(`Deleted Diagnose Model - ID: ${id}`);
    return true;
  }

  async getListDiagnoseModels(
    query: GetListDiagnoseModelsRequestDto,
  ): Promise<PageDto<DiagnoseModelResponseDto>> {
    const where: WhereCondition<DiagnoseModelEntity> = {};
    
    if (query.isPublic !== undefined) {
      where.isPublic = query.isPublic;
    }
    
    if (query.search) {
      where.or = [
        { name: { contains: query.search } },
        { version: { contains: query.search } },
      ];
    }

    const result = await this.diagnoseModelRepository.findAll({
      where,
      pagination: {
        page: query.page,
        limit: query.take,
      },
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: result.meta?.total ?? 0,
      page: query.page,
      take: query.take,
    });

    return new PageDto(
      plainToInstance(DiagnoseModelResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      pageMetaDto,
    );
  }

  @Transactional()
  async createChatbotModel(
    payload: CreateChatbotModelRequestDto,
  ): Promise<ChatbotModelResponseDto> {
    const existing = await this.chatbotRepository.findOne({
      where: { version: payload.version },
    });

    if (existing) {
      throw new BadRequestException('Chatbot model version already exists.');
    }

    if (payload.isPublic) {
      await this.chatbotRepository.updateMany(
        { isPublic: true },
        { isPublic: false }
      );
    }

    const newModel = await this.chatbotRepository.create(payload);
    this.logger.log(`Created new Chatbot Model - Version: ${payload.version}`);
    return plainToInstance(ChatbotModelResponseDto, newModel, {
      excludeExtraneousValues: true,
    });
  }

  @Transactional()
  async updateChatbotModel(
    id: string,
    payload: UpdateChatbotModelRequestDto,
  ): Promise<ChatbotModelResponseDto> {
    const existing = await this.chatbotRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Chatbot model not found.');
    }

    if (payload.isPublic && !existing.isPublic) {
      await this.chatbotRepository.updateMany(
        { isPublic: true },
        { isPublic: false }
      );
    }

    const updated = await this.chatbotRepository.update(id, payload);
    this.logger.log(`Updated Chatbot Model - ID: ${id}`);
    return plainToInstance(ChatbotModelResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  @Transactional()
  async deleteChatbotModel(id: string): Promise<boolean> {
    const existing = await this.chatbotRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Chatbot model not found.');
    }

    await this.chatbotRepository.softDelete(id);
    this.logger.log(`Deleted Chatbot Model - ID: ${id}`);
    return true;
  }

  async getListChatbotModels(
    query: GetListChatbotModelsRequestDto,
  ): Promise<PageDto<ChatbotModelResponseDto>> {
    const where: WhereCondition<ChatbotEntity> = {};
    
    if (query.isPublic !== undefined) {
      where.isPublic = query.isPublic;
    }
    
    if (query.search) {
      where.or = [
        { name: { contains: query.search } },
        { version: { contains: query.search } },
      ];
    }

    const result = await this.chatbotRepository.findAll({
      where,
      pagination: {
        page: query.page,
        limit: query.take, // take maps to limit for query offset
      },
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: result.meta?.total ?? 0,
      page: query.page,
      take: query.take,
    });

    return new PageDto(
      plainToInstance(ChatbotModelResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      pageMetaDto,
    );
  }
}
