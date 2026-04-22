import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import axios from 'axios';

import { INTERNAL_WORKER_API_URL } from '@app/core/environments';
import { ExceptionHandler } from '@app/core/exception';

import { User } from '../database/typeorm-nest/entities';

import {
  CreateNovuUserDto
} from './dtos';

@Injectable()
export class InternalWorkerService {
  constructor(private readonly httpService: HttpService) {}

  async sendRegisterOtp(
    otp: string,
    email: string,
    firstName: string,
    lastName: string,
    expiresInMinutes: number,
  ): Promise<void> {
    try {
      const url = `${INTERNAL_WORKER_API_URL}/mail/send-register-otp`;
      await axios.post(url, {
        otp,
        email,
        firstName,
        lastName,
        expiresInMinutes,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error sending register otp');
    }
  }

  async sendForgotPasswordOtp(
    email: string,
    resetUrl: string,
    firstName: string,
    lastName: string,
    expiresInMinutes: number,
  ): Promise<void> {
    try {
      const url = `${INTERNAL_WORKER_API_URL}/mail/send-forgot-password-otp`;
      await axios.post(url, {
        email,
        resetUrl,
        firstName,
        lastName,
        expiresInMinutes,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error sending forgot password otp',
      );
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
