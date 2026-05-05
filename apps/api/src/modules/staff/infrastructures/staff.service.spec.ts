import { Test, TestingModule } from '@nestjs/testing';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));

import { initializeTransactionalContext } from 'typeorm-transactional';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';

import { WorkingTimeStatus } from '@app/core/domain/enums';
import { 
  BadRequestException, 
  ForbiddenException, 
  NotFoundException 
} from '@app/core/exception';

import { StaffService } from './staff.service';

describe('StaffService', () => {
  let service: StaffService;
  let scheduleRepository: any;
  let workingTimeRepository: any;
  let admissionStaffRepository: any;
  let appointmentRepository: any;
  let doctorRepository: any;
  let shiftRepository: any;

  beforeAll(() => {
    initializeTransactionalContext();
  });

  beforeEach(async () => {
    scheduleRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    };
    workingTimeRepository = {
      findWorkingTimesByScheduleInfo: jest.fn(),
      deleteManyByObjects: jest.fn(),
      createMany: jest.fn(),
    };
    admissionStaffRepository = {
      findOne: jest.fn(),
    };
    appointmentRepository = {};
    doctorRepository = {};
    shiftRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        { provide: REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY, useValue: appointmentRepository },
        { provide: REPOSITORY_INJECTION_TOKEN.ADMISSION_STAFF_REPOSITORY, useValue: admissionStaffRepository },
        { provide: REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY, useValue: doctorRepository },
        { provide: REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY, useValue: scheduleRepository },
        { provide: REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY, useValue: workingTimeRepository },
        { provide: REPOSITORY_INJECTION_TOKEN.SHIFT_REPOSITORY, useValue: shiftRepository },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('_deleteScheduleInternal', () => {
    it('should throw NotFoundException if staff is not found', async () => {
      admissionStaffRepository.findOne.mockResolvedValue(null);

      await expect(
        (service as any)._deleteScheduleInternal('staff-1', ['sched-1'], '2026-04-13', '2026-04-19', '2026-04-16')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if schedule belongs to another department', async () => {
      admissionStaffRepository.findOne.mockResolvedValue({ userId: 'staff-1', department: 'Cardiology' });
      scheduleRepository.findAll.mockResolvedValue({
        data: [
          { id: 'sched-1', doctor: { department: 'Dermatology' } }
        ]
      });

      await expect(
        (service as any)._deleteScheduleInternal('staff-1', ['sched-1'], '2026-04-13', '2026-04-19', '2026-04-16')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if schedule has booked appointments', async () => {
      admissionStaffRepository.findOne.mockResolvedValue({ userId: 'staff-1', department: 'Cardiology' });
      scheduleRepository.findAll.mockResolvedValue({
        data: [
          { id: 'sched-1', doctorId: 'doc-1', date: '2026-04-20', doctor: { department: 'Cardiology' } }
        ]
      });
      workingTimeRepository.findWorkingTimesByScheduleInfo.mockResolvedValue([
        { status: WorkingTimeStatus.BOOKED }
      ]);

      await expect(
        (service as any)._deleteScheduleInternal('staff-1', ['sched-1'], '2026-04-13', '2026-04-19', '2026-04-16')
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully delete schedules if all validations pass', async () => {
      admissionStaffRepository.findOne.mockResolvedValue({ userId: 'staff-1', department: 'Cardiology' });
      const mockSchedule = { id: 'sched-1', doctorId: 'doc-1', date: '2026-04-20', doctor: { department: 'Cardiology' } };
      scheduleRepository.findAll.mockResolvedValue({ data: [mockSchedule] });
      const mockWorkingTime = { id: 'wt-1', status: WorkingTimeStatus.AVAILABLE };
      workingTimeRepository.findWorkingTimesByScheduleInfo.mockResolvedValue([mockWorkingTime]);

      await (service as any)._deleteScheduleInternal('staff-1', ['sched-1'], '2026-04-13', '2026-04-19', '2026-04-16');

      expect(workingTimeRepository.deleteManyByObjects).toHaveBeenCalledWith([mockWorkingTime]);
      expect(scheduleRepository.deleteMany).toHaveBeenCalledWith({ id: { in: ['sched-1'] } });
    });
  });
});