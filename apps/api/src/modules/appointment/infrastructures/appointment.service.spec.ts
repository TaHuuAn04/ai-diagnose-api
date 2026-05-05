import { Test, TestingModule } from '@nestjs/testing';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { initializeTransactionalContext } from 'typeorm-transactional';


import { 
  AppointmentStatus, 
  UserRole, 
  WorkingTimeStatus 
} from '@app/core/domain/enums';
import { 
  BadRequestException, 
  ForbiddenException, 
  NotFoundException 
} from '@app/core/exception';

import { AppointmentService } from './appointment.service';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepository: any;
  let scheduleRepository: any;
  let imageRepository: any;
  let workingTimeRepository: any;
  let admissionStaffRepository: any;

  beforeAll(() => {
    initializeTransactionalContext();
  });

  beforeEach(async () => {
    appointmentRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    scheduleRepository = {};
    imageRepository = {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    };
    workingTimeRepository = {
      updateMany: jest.fn(),
    };
    admissionStaffRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY,
          useValue: appointmentRepository,
        },
        {
          provide: REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY,
          useValue: scheduleRepository,
        },
        {
          provide: REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY,
          useValue: imageRepository,
        },
        {
          provide: REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY,
          useValue: workingTimeRepository,
        },
        {
          provide: REPOSITORY_INJECTION_TOKEN.ADMISSION_STAFF_REPOSITORY,
          useValue: admissionStaffRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateAppointment', () => {
    it('should throw NotFoundException if appointment is not found', async () => {
      appointmentRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateAppointment('user-1', 'app-1', {})
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the appointment', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        patient: { userId: 'user-2' },
      });
      await expect(
        service.updateAppointment('user-1', 'app-1', {})
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if appointment status is not SCHEDULED', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        patient: { userId: 'user-1' },
        status: AppointmentStatus.CANCELLED,
      });
      await expect(
        service.updateAppointment('user-1', 'app-1', {})
      ).rejects.toThrow(BadRequestException);
    });

    it('should update appointment description successfully without images', async () => {
      const existingAppointment = {
        id: 'app-1',
        patient: { userId: 'user-1' },
        status: AppointmentStatus.SCHEDULED,
        description: 'old desc',
      };
      appointmentRepository.findOne.mockResolvedValue(existingAppointment);
      appointmentRepository.update.mockResolvedValue({
        ...existingAppointment,
        description: 'new desc',
        updatedAt: new Date(),
      });

      const result = await service.updateAppointment('user-1', 'app-1', {
        description: 'new desc',
      });

      expect(appointmentRepository.update).toHaveBeenCalledWith('app-1', expect.objectContaining({
        description: 'new desc',
      }));
      expect(result.isSuccess).toBe(true);
      expect(imageRepository.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('cancelAppointment', () => {
    it('should throw ForbiddenException if PATIENT tries to cancel someone else appointment', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        patient: { userId: 'other-patient' },
      });

      await expect(
        service.cancelAppointment('user-1', UserRole.PATIENT, 'app-1')
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if STAFF tries to cancel appointment from another department', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        metadata: { department: 'Dermatology' },
      });
      admissionStaffRepository.findOne.mockResolvedValue({
        userId: 'staff-1',
        department: 'Cardiology',
      });

      await expect(
        service.cancelAppointment('staff-1', UserRole.STAFF, 'app-1')
      ).rejects.toThrow(ForbiddenException);
    });

    it('should successfully cancel appointment for valid PATIENT', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        patient: { userId: 'user-1' },
        status: AppointmentStatus.SCHEDULED,
      });
      workingTimeRepository.updateMany.mockResolvedValue(true);
      appointmentRepository.update.mockResolvedValue({ updatedAt: new Date() });

      const result = await service.cancelAppointment('user-1', UserRole.PATIENT, 'app-1');
      
      expect(workingTimeRepository.updateMany).toHaveBeenCalledWith(
        { appointmentId: 'app-1' },
        { appointmentId: null, status: WorkingTimeStatus.AVAILABLE }
      );
      expect(appointmentRepository.update).toHaveBeenCalledWith('app-1', expect.objectContaining({
        status: AppointmentStatus.CANCELLED
      }));
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('takeNoteAppointment', () => {
    it('should throw ForbiddenException if STAFF is from different department', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        metadata: { department: 'Dermatology' },
      });
      admissionStaffRepository.findOne.mockResolvedValue({
        userId: 'staff-1',
        department: 'Cardiology',
      });

      await expect(
        service.takeNoteAppointment('staff-1', 'app-1', { note: 'test' })
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update note successfully for valid STAFF', async () => {
      appointmentRepository.findOne.mockResolvedValue({
        id: 'app-1',
        metadata: { department: 'Dermatology' },
        note: '',
      });
      admissionStaffRepository.findOne.mockResolvedValue({
        userId: 'staff-1',
        department: 'Dermatology',
      });
      appointmentRepository.update.mockResolvedValue({ updatedAt: new Date() });

      const result = await service.takeNoteAppointment('staff-1', 'app-1', { note: 'new note' });

      expect(appointmentRepository.update).toHaveBeenCalledWith('app-1', expect.objectContaining({
        note: 'new note'
      }));
      expect(result.isSuccess).toBe(true);
    });
  });
});