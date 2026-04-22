import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Novu } from '@novu/node';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

import { NovuConfig } from '../../configs';

import { OtpDto } from './dtos';
import { ForgotPasswordJobData, NOVU_QUEUE_JOBS, NOVU_QUEUE_NAME, OTPJobData } from './queues';
import { ForgotPasswordOtpDto, RegisterOtpDto } from '../mail/dtos';

@Injectable()
export class NovuService extends Novu {
  constructor(
    @Inject(NovuConfig.KEY)
    private readonly config: ConfigType<typeof NovuConfig>,

    @InjectQueue(NOVU_QUEUE_NAME)
    private readonly novuQueue: Queue,
  ) {
    super(config.novuApiKey || 'mock_key_for_ignore', { backendUrl: config.novuServerUrl || 'https://api.novu.co' });
  }

  async sendLoginOtpToSubscriber(dto: OtpDto): Promise<void> {
    if (!this.config.novuApiKey) {
      console.warn('NOVU_API_KEY is not set. Ignoring Novu OTP : ', NOVU_QUEUE_JOBS.SEND_LOGIN_OTP);
      return;
    }

    const { otp, userId, userName, email } = dto;

    const otpPayload: OTPJobData = {
      userId,
      userName,
      email,
      otp,
      firstName: '',
      lastName: '',
      companyName: 'ASTCare', // hard code now
      expiresInMinutes: 5, // hard code now
    };

    await this.novuQueue.add(NOVU_QUEUE_JOBS.SEND_LOGIN_OTP, otpPayload);
  }

  async sendRegisterOtpToSubscriber(dto: RegisterOtpDto): Promise<void> {
    if (!this.config.novuApiKey) {
      console.warn('NOVU_API_KEY is not set. Ignoring Novu OTP : ', NOVU_QUEUE_JOBS.SEND_REGISTER_OTP);
      return;
    }

    const { otp, email, firstName, lastName, expiresInMinutes } = dto;
    const userId = uuidv4(); // Tạo ID tạm cho subscriber chưa có trong DB

    const otpPayload: OTPJobData = {
      userId,
      userName: `${firstName} ${lastName}`,
      email,
      otp,
      firstName,
      lastName,
      companyName: 'ASTCare', // hard code now
      expiresInMinutes,
    };

    await this.novuQueue.add(NOVU_QUEUE_JOBS.SEND_REGISTER_OTP, otpPayload);
  }

  async sendForgotPasswordOtpToSubscriber(dto: ForgotPasswordOtpDto, userId: string): Promise<void> {
    if (!this.config.novuApiKey) {
      console.warn('NOVU_API_KEY is not set. Ignoring Novu OTP : ', NOVU_QUEUE_JOBS.SEND_FORGOT_PASSWORD_OTP);
      return;
    }

    const { email, resetUrl, expiresInMinutes, firstName, lastName } = dto;

    const payload: ForgotPasswordJobData = {
      userId,
      email,
      firstName,
      lastName,
      resetUrl,
      appName: 'ASTCare',
      expiresInMinutes,
    };

    await this.novuQueue.add(NOVU_QUEUE_JOBS.SEND_FORGOT_PASSWORD_OTP, payload);
  }
}
