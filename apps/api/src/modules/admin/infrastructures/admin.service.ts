import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  IAdmissionStaffRepository,
  IChatbotRepository,
  IChatHistoryRepository,
  IDiagnoseModelRepository,
  IDiagnosisResultRepository,
  IDoctorRepository,
  IPatientRepository,
  IUserRepository,
  WhereCondition,
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { AdmissionStaffEntity, ChatbotEntity, DiagnoseModelEntity, UserEntity } from '@app/core/domain/entities';
import { UserRole } from '@app/core/domain/enums';
import { PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';

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
  DepartmentDistributionItemResponseDto,
  DiagnoseModelResponseDto,
  DoctorPatientItemResponseDto,
  DoctorPerformanceStatisticsResponseDto,
  GetDoctorPerformanceStatisticsRequestDto,
  GetDoctorPatientsRequestDto,
  GetListChatbotModelsRequestDto,
  GetListDiagnoseModelsRequestDto,
  GetListPatientRequestDto,
  GetListStaffRequestDto,
  GetPatientResponseDto,
  GetStaffResponseDto,
  GetSystemOverviewRequestDto,
  PatientConsultationItemResponseDto,
  SystemOverviewResponseDto,
  TopDiseaseItemResponseDto,
  TopDoctorStatisticsItemResponseDto,
  UpdateAdmissionStaffAccountRequestDto,
  UpdateAdmissionStaffAccountResponseDto,
  UpdateChatbotModelRequestDto,
  UpdateDiagnoseModelRequestDto,
  UpdateDoctorAccountRequestDto,
  UpdateDoctorAccountResponseDto,
  UpdatePatientOnboardingRequestDto,
  UpdatePatientOnboardingResponseDto,
  UserStatisticsResponseDto,
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

    @Inject(REPOSITORY_INJECTION_TOKEN.PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DIAGNOSE_MODEL_REPOSITORY)
    private readonly diagnoseModelRepository: IDiagnoseModelRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DIAGNOSIS_RESULT_REPOSITORY)
    private readonly diagnosisResultRepository: IDiagnosisResultRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CHATBOT_REPOSITORY)
    private readonly chatbotRepository: IChatbotRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CHAT_HISTORY_REPOSITORY)
    private readonly chatHistoryRepository: IChatHistoryRepository,
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

  async getUserStatistics(): Promise<UserStatisticsResponseDto> {
    const [roleDistribution, doctorDepartmentDistribution, staffDepartmentDistribution] = await Promise.all([
      this.userRepository.getRoleDistribution(),
      this.doctorRepository.getDoctorDepartmentDistribution(),
      this.admissionStaffRepository.getStaffDepartmentDistribution()
    ]);

    return plainToInstance(UserStatisticsResponseDto, {
      roleDistribution,
      doctorDepartmentDistribution,
      staffDepartmentDistribution
    });
  }

  async getListPatients(
    query: GetListPatientRequestDto,
  ): Promise<PageDto<GetPatientResponseDto>> {
    const { page, take, search } = query;

    const where: WhereCondition<any> = {};

    if (search) {
      where.or = [
        { citizenCode: { contains: search } },
        {
          user: {
            or: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
              { phoneNumber: { contains: search } },
            ],
          },
        },
      ];
    }

    const result = await this.patientRepository.findAll({
      where,
      relations: ['user'],
      pagination: {
        page,
        limit: take,
      },
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: result.meta?.total ?? 0,
      page,
      take,
    });

    return new PageDto(
      plainToInstance(GetPatientResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      pageMetaDto,
    );
  }

  @Transactional()
  async updatePatientOnboarding(
    id: string,
    payload: UpdatePatientOnboardingRequestDto,
  ): Promise<UpdatePatientOnboardingResponseDto> {
    const existingPatient = await this.patientRepository.findOne({
      where: { userId: id },
    });

    if (!existingPatient) {
      throw new NotFoundException('Patient account not found.');
    }

    await this.userRepository.update(id, {
      isOnBoardingCompleted: payload.isOnBoardingCompleted,
    });

    this.logger.log(`Updated Patient Onboarding - UserID: ${id}, isOnBoardingCompleted: ${payload.isOnBoardingCompleted}`);
    return plainToInstance(UpdatePatientOnboardingResponseDto, { success: true });
  }

  async getListStaffs(
    query: GetListStaffRequestDto,
  ): Promise<PageDto<GetStaffResponseDto>> {
    const { page, take, search, department } = query;

    const where: WhereCondition<AdmissionStaffEntity> = {};

    if (department) {
      where.department = department;
    }

    if (search) {
      where.or = [
        { staffCode: { contains: search } },
        {
          user: {
            or: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
              { phoneNumber: { contains: search } },
            ],
          },
        },
      ];
    }

    const result = await this.admissionStaffRepository.findAll({
      where,
      relations: ['user'],
      pagination: {
        page,
        limit: take,
      },
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: result.meta?.total ?? 0,
      page,
      take,
    });

    return new PageDto(
      plainToInstance(GetStaffResponseDto, result.data, {
        excludeExtraneousValues: true,
      }),
      pageMetaDto,
    );
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
      password,
      ...userPayload
    } = payload;

    const updateUserPayload: Partial<UpdateDoctorAccountRequestDto> = { ...userPayload };
    if (password) {
      updateUserPayload.password = await hashPassword(password);
    }

    if (Object.keys(updateUserPayload).length > 0) {
      await this.userRepository.update(id, updateUserPayload);
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
      password,
      ...userPayload
    } = payload;

    const updateUserPayload: Partial<UpdateDoctorAccountRequestDto> = { ...userPayload };
    if (password) {
      updateUserPayload.password = await hashPassword(password);
    }

    if (Object.keys(updateUserPayload).length > 0) {
      await this.userRepository.update(id, updateUserPayload);
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

  async getDoctorPerformanceStatistics(
    query: GetDoctorPerformanceStatisticsRequestDto,
  ): Promise<DoctorPerformanceStatisticsResponseDto> {
    try {
      const now = new Date();
      const month = query.month || now.getMonth() + 1;
      const year = query.year || now.getFullYear();

      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

      const result = await this.diagnosisResultRepository.findAll({
        where: {
          createdAt: {
            between: [startDate, endDate],
          },
        },
        relations: [
          'consultation',
          'consultation.doctor',
          'consultation.doctor.user',
          'consultation.aiResult',
        ],
      });
      const allData = result.data;

      const doctorStats = new Map<string, {
        doctorId: string;
        doctorName: string;
        department: string;
        totalExaminations: number;
        uniquePatients: Set<string>;
        aiUsageCount: number;
      }>();

      const departmentDistributionMap = new Map<string, number>();

      // 4. Process mapped data synchronously in-memory
      for (const diagnosisResult of allData) {
        const consultation = diagnosisResult.consultation;
        const doctor = consultation?.doctor;

        if (!consultation || !doctor) {
          continue;
        }

        const doctorId = consultation.doctorId || doctor.userId;
        const patientId = consultation.patientId;
        const doctorName = `${doctor.user?.lastName ?? ''} ${doctor.user?.firstName ?? ''}`.trim();
        const resolvedDoctorName = doctorName || doctor.doctorCode || 'Unknown doctor';
        const department = diagnosisResult.department && diagnosisResult.department.length > 0
          ? diagnosisResult.department
          : doctor.department || 'unknown';

        const currentDoctorStat = doctorStats.get(doctorId) ?? {
          doctorId,
          doctorName: resolvedDoctorName,
          department,
          totalExaminations: 0,
          uniquePatients: new Set<string>(),
          aiUsageCount: 0,
        };

        currentDoctorStat.totalExaminations += 1;

        if (patientId) {
          currentDoctorStat.uniquePatients.add(patientId);
        }

        if (consultation.aiResult?.id) {
          currentDoctorStat.aiUsageCount += 1;
        }

        doctorStats.set(doctorId, currentDoctorStat);

        departmentDistributionMap.set(
          department,
          (departmentDistributionMap.get(department) ?? 0) + 1,
        );
      }

      const totalExaminations = Array.from(departmentDistributionMap.values())
        .reduce((sum, value) => sum + value, 0);

      const topDoctors: TopDoctorStatisticsItemResponseDto[] = Array.from(doctorStats.values())
        .map((stat) => ({
          doctorId: stat.doctorId,
          doctorName: stat.doctorName,
          department: stat.department,
          totalExaminations: stat.totalExaminations,
          uniquePatients: stat.uniquePatients.size,
          aiUsageRate: stat.totalExaminations > 0
            ? Number(((stat.aiUsageCount / stat.totalExaminations) * 100).toFixed(1))
            : 0,
        }))
        .sort((a, b) => b.totalExaminations - a.totalExaminations)
        .slice(0, query.limit || 5);

      const departmentDistribution: DepartmentDistributionItemResponseDto[] = Array.from(departmentDistributionMap.entries())
        .map(([department, count]) => ({
          department,
          totalExaminations: count,
          percentage: totalExaminations > 0
            ? Number(((count / totalExaminations) * 100).toFixed(1))
            : 0,
        }))
        .sort((a, b) => b.totalExaminations - a.totalExaminations);

      return plainToInstance(DoctorPerformanceStatisticsResponseDto, {
        month,
        year,
        totalExaminations,
        topDoctors,
        departmentDistribution,
      });
    } catch (error) {
      this.logger.error('Failed to get doctor performance statistics', error);
      throw error;
    }
  }

  async getSystemOverview(
    query: GetSystemOverviewRequestDto,
  ): Promise<SystemOverviewResponseDto> {
    try {
      const month = query.month;
      const year = query.year;

      const currentStartDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const currentEndDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevStartDate = new Date(Date.UTC(prevYear, prevMonth - 1, 1, 0, 0, 0));
      const prevEndDate = new Date(Date.UTC(prevYear, prevMonth, 1, 0, 0, 0));

      const queryOptions = {
        relations: ['consultation', 'consultation.aiResult'],
      };

      // Aggregate all database calls asynchronously
      const [currResult, prevResult, currPatientsCount, prevPatientsCount, currChatHistoryCount, prevChatHistoryCount] = await Promise.all([
        this.diagnosisResultRepository.findAll({
          ...queryOptions,
          where: { 
            createdAt: { between: [currentStartDate, currentEndDate] },
          },
        }),
        this.diagnosisResultRepository.findAll({
          ...queryOptions,
          where: { createdAt: { between: [prevStartDate, prevEndDate] } },
        }),
        this.userRepository.countWithOptions({ role: UserRole.PATIENT, createdAt: { gte: currentStartDate, lt: currentEndDate } }),
        this.userRepository.countWithOptions({ role: UserRole.PATIENT, createdAt: { gte: prevStartDate, lt: prevEndDate } }),
        this.chatHistoryRepository.countWithOptions({ createdAt: { gte: currentStartDate, lt: currentEndDate } }),
        this.chatHistoryRepository.countWithOptions({ createdAt: { gte: prevStartDate, lt: prevEndDate } }),
      ]);

      const currData = currResult.data;
      const prevData = prevResult.data;

      const calculateMetrics = (data: typeof currData) => {
        let aiUsage = 0;

        for (const item of data) {
          const consultation = item.consultation;
          if (!consultation?.doctorId) continue;

          if (consultation.aiResult?.id) {
            aiUsage += 1;
          }
        }

        return {
          totalExaminations: data.length,
          totalAiUsage: aiUsage,
        };
      };

      const currMetrics = calculateMetrics(currData);
      const prevMetrics = calculateMetrics(prevData);

      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number((((current - previous) / previous) * 100).toFixed(1));
      };

      return plainToInstance(SystemOverviewResponseDto, {
        totalAiUsage: currMetrics.totalAiUsage,
        aiUsageGrowth: calculateGrowth(currMetrics.totalAiUsage, prevMetrics.totalAiUsage),
        totalExaminations: currMetrics.totalExaminations,
        examinationGrowth: calculateGrowth(currMetrics.totalExaminations, prevMetrics.totalExaminations),
        newPatients: currPatientsCount,
        patientGrowth: calculateGrowth(currPatientsCount, prevPatientsCount),
        chatbotUsage: currChatHistoryCount,
        chatbotUsageGrowth: calculateGrowth(currChatHistoryCount, prevChatHistoryCount),
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error);
    }
  }

  async getTopDiseasesStatistics(
    query: GetDoctorPatientsRequestDto,
  ): Promise<TopDiseaseItemResponseDto[]> {
    try {
      const startDate = new Date(Date.UTC(query.year, query.month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(query.year, query.month, 1, 0, 0, 0));

      const result = await this.diagnosisResultRepository.findAll({
        where: {
          createdAt: { between: [startDate, endDate] },
        },
        relations: ['diseases', 'diseases.disease'],
      });

      const diseaseMap = new Map<string, number>();

      for (const item of result.data) {
        if (!item.diseases) continue;
        for (const rd of item.diseases) {
          const name = rd.disease?.name || rd.name || 'Unknown';
          diseaseMap.set(name, (diseaseMap.get(name) || 0) + 1);
        }
      }

      return Array.from(diseaseMap.entries())
        .map(([diseaseName, count]) => ({ diseaseName, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(d => plainToInstance(TopDiseaseItemResponseDto, d, { excludeExtraneousValues: true }));
    } catch (error) {
      this.logger.error('Failed to get top diseases', error);
      throw error;
    }
  }

  async getDoctorPatients(
    doctorId: string,
    query: GetDoctorPatientsRequestDto,
  ): Promise<DoctorPatientItemResponseDto[]> {
    try {
      const month = query.month;
      const year = query.year;

      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

      const result = await this.diagnosisResultRepository.findAll({
        where: {
          createdAt: { between: [startDate, endDate] },
        },
        relations: ['consultation', 'consultation.patient', 'consultation.patient.user'],
      });

      const patientMap = new Map<string, any>();

      for (const item of result.data) {
        const consultation = item.consultation;
        if (!consultation || consultation.doctorId !== doctorId) continue;

        const patient = consultation.patient;
        if (!patient) continue;

        const patientId = patient.userId;
        const currentData = patientMap.get(patientId) || {
          patientId,
          patientName: `${patient.user?.lastName ?? ''} ${patient.user?.firstName ?? ''}`.trim() || 'Unknown',
          citizenCode: patient.citizenCode,
          phoneNumber: patient.user?.phoneNumber || '',
          totalExaminations: 0,
        };

        currentData.totalExaminations += 1;
        patientMap.set(patientId, currentData);
      }

      return Array.from(patientMap.values())
        .sort((a, b) => b.totalExaminations - a.totalExaminations)
        .map(p => plainToInstance(DoctorPatientItemResponseDto, p, { excludeExtraneousValues: true }));
    } catch (error) {
      this.logger.error('Failed to get doctor patients', error);
      throw error;
    }
  }

  async getPatientConsultationsByDoctor(
    doctorId: string,
    patientId: string,
    query: GetDoctorPatientsRequestDto,
  ): Promise<PatientConsultationItemResponseDto[]> {
    try {
      const month = query.month;
      const year = query.year;

      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

      const result = await this.diagnosisResultRepository.findAll({
        where: {
          createdAt: { between: [startDate, endDate] },
        },
        relations: ['consultation', 'consultation.aiResult'],
      });

      const consultations: any[] = [];

      for (const item of result.data) {
        const consultation = item.consultation;
        if (!consultation || consultation.doctorId !== doctorId || consultation.patientId !== patientId) continue;

        consultations.push({
          consultationId: consultation.id,
          date: item.createdAt,
          diagnosis: item.advices || 'Không có kết luận',
          hasAiUsage: !!consultation.aiResult?.id,
        });
      }

      return consultations
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map(c => plainToInstance(PatientConsultationItemResponseDto, c, { excludeExtraneousValues: true }));
    } catch (error) {
      this.logger.error('Failed to get patient consultations', error);
      throw error;
    }
  }
}
