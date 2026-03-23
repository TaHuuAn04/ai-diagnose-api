import { Inject, Injectable } from '@nestjs/common';

import { IConsultationRepository, IDoctorRepository, IImageRepository, IWorkingTimeRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { ImageReference, SortDirection } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';

import { IDoctorService } from '../doctor.interface';
import { GetDoctorResponseDto, GetListDoctorRequestDto, GetPersonalAppointmentsRequestDto, GetPersonalAppointmentsResponseDto } from '../dtos';


@Injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY)
    private readonly workingTimeRepository: IWorkingTimeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
  ) {}

  async getListDoctors(
    request: GetListDoctorRequestDto
  ): Promise<PageDto<GetDoctorResponseDto>> {
    try {
      const { take, page } = request;

      const paginatedResult = await this.doctorRepository.findListDoctors(request);
      const result = paginatedResult.data;

      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: paginatedResult.total,
      });

      const doctorDtos = result.map(doctor =>
        {
          if (!doctor.user) {
            throw new Error(`User not found for doctor with id ${doctor.userId}`);
          }
          const doctorMapping = {
            ...doctor,
            id: doctor.user.id,
            firstName: doctor.user.firstName,
            lastName: doctor.user.lastName,
            email: doctor.user.email,
            phoneNumber: doctor.user.phoneNumber,
            role: doctor.user.role,
            gender: doctor.user.gender,
            dateOfBirth: doctor.user.dateOfBirth,
            phoneCode: doctor.user.phoneCode,
            avatarUrl: doctor.user.avatarUrl,
            isOnBoardingCompleted: doctor.user.isOnBoardingCompleted,
          }
          return plainToInstance(GetDoctorResponseDto, doctorMapping);
        }
      );

      return new PageDto<GetDoctorResponseDto>(doctorDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list doctors');
    }
  }

  async getDoctorInfo(doctorId: string): Promise<GetDoctorResponseDto> {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: { userId: doctorId },  
        relations: ['user']
      });

      if (!doctor) {
        throw new NotFoundException(`Doctor not found with id ${doctorId}`);
      }

      if (!doctor.user) {
        throw new NotFoundException(`User not found for doctor with id ${doctorId}`);
      }

      return plainToInstance(GetDoctorResponseDto, {
        ...doctor,
        id: doctor.user.id, 
        firstName: doctor.user.firstName,
        lastName: doctor.user.lastName,
        email: doctor.user.email,
        phoneNumber: doctor.user.phoneNumber,
        role: doctor.user.role,
        gender: doctor.user.gender,
        phoneCode: doctor.user.phoneCode,
        avatarUrl: doctor.user.avatarUrl,
      });
    } catch (error) { 
      ExceptionHandler.handleErrorException(error, 'Error getting doctor info');
    }
  }

  async getPersonalAppointments(
    doctorId: string,
    request: GetPersonalAppointmentsRequestDto
  ): Promise<PageDto<GetPersonalAppointmentsResponseDto>> {
    try {
      if (!request.startDate || !request.endDate || request.startDate > request.endDate) {
        throw new BadRequestException('Invalid date range: startDate must be before endDate');
      }

      if (request.from && request.to && request.from > request.to) {
        throw new BadRequestException('Invalid time range: from must be before to');
      }

      const result = await this.workingTimeRepository.findDoctorAppointments(doctorId, request);
      const appointments = result.data;

      const pageMeta = new PageMetaDto({
        page: request.page,
        take: request.take,
        itemCount: result.total,
      });

      const appointmentDtos = await Promise.all(appointments.map(async appointment => {
        if (!appointment.appointment) {
          throw new NotFoundException(`Appointment not found`);
        }

        if (!appointment.appointment.patient) {
          throw new NotFoundException(`Patient not found for appointment with id ${appointment.appointment.id}`);
        }

        if (!appointment.appointment.patient.user) {
          throw new NotFoundException(`User infomation is not found for patient with id ${appointment.appointment.patientId}`);
        }

        const patientConsultation =  await this.consultationRepository.findOne({
          where: {
            patientId: appointment.appointment.patientId,
          },
          sort: {
            sortBy: 'createdAt',
            sortOrder: SortDirection.DESC
          },
          relations: ['diagnosisResult', 'diagnosisResult.diseases']
        });

        const diseases = patientConsultation ? patientConsultation.diagnosisResult?.diseases?.map((disease: { name: string }) => disease.name)
                                             : [];
        
        
        const imageEntities = await this.imageRepository.findAll({
          where: {
            referenceId: appointment.appointment.id,
            referenceType: ImageReference.APPOINTMENT,
          },
          sort: { 
            sortBy: 'order',
            sortOrder: SortDirection.DESC
          },
        });  

        return plainToInstance(GetPersonalAppointmentsResponseDto, {
          date: appointment.shift?.date,
          from: appointment.shift?.from,
          to: appointment.shift?.to,
          patientName: appointment.appointment.patient.user.firstName + ' ' + appointment.appointment.patient.user.lastName,
          dateOfBirth: appointment.appointment.patient.user.dateOfBirth,
          phoneNumber: appointment.appointment.patient.user.phoneNumber,
          gender: appointment.appointment.patient.user.gender,
          description: appointment.appointment.description,
          previousDiseases: diseases,
          status: appointment.appointment.status,
          images: plainToInstance(ImageInfoDto, imageEntities.data),
        });
      }));

      return new PageDto<GetPersonalAppointmentsResponseDto>(appointmentDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to retrieve information.');
    }
  }
}
