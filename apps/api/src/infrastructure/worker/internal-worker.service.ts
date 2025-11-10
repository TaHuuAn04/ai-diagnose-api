import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import axios from 'axios';

import { INTERNAL_WORKER_API_URL } from '@app/core/environments';
import { ExceptionHandler, InternalServerErrorException } from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import { User } from '../database/typeorm-nest/entities';

import {
  CreateNovuUserDto,
  PostSendSupportEscalationTicketDto,
  SendSupportEscalationTicketInputDto,
  SendSupportEscalationTicketResponseDto,
} from './dtos';

@Injectable()
export class InternalWorkerService {
  constructor(private readonly httpService: HttpService) {}

  async sendSupportEscalationTicketEmail(
    input: SendSupportEscalationTicketInputDto,
  ) {
    try {
      const dto = new PostSendSupportEscalationTicketDto(input);
      const response = await fetchDto<SendSupportEscalationTicketResponseDto>({
        dto,
        httpService: this.httpService,
      });

      if (!response.status) {
        throw new InternalServerErrorException(response.message);
      }

      return response.data;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error sending support escalation ticket email');
    }
  }
  async sendRegisterOtp(otp: string, email: string): Promise<void> {
    try {
      const url = `${INTERNAL_WORKER_API_URL}/mail/send-register-otp`;
      await axios.post(url, {
        otp,
        email,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error sending register otp');
    }
  }

  async sendLoginOtp(otp: string, user: User): Promise<void> {
    try {
      const url = `${INTERNAL_WORKER_API_URL}/mail/send-login-otp`;
      await axios.post(url, {
        otp,
        user,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error sending login otp');
    }
  }

  async createNovuUser(input: CreateNovuUserDto): Promise<void> {
    try {
      const { id, email, firstName, lastName } = input;
      const url = `${INTERNAL_WORKER_API_URL}/mail/create-novu-user`;
      await axios.post(url, {
        id,
        email,
        firstName,
        lastName,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error creating novu user');
    }
  }
}
