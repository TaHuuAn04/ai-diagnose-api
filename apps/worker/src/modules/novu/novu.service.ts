import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Novu } from '@novu/node';
import { Queue } from 'bullmq';

import { NovuConfig } from '../../configs';

import { OtpDto } from './dtos';
import { NOVU_QUEUE_JOBS, NOVU_QUEUE_NAME, OTPJobData } from './queues';

@Injectable()
export class NovuService extends Novu {
  constructor(
    @Inject(NovuConfig.KEY)
    private readonly config: ConfigType<typeof NovuConfig>,

    @InjectQueue(NOVU_QUEUE_NAME)
    private readonly novuQueue: Queue,
  ) {
    super(config.novuApiKey, { backendUrl: config.novuServerUrl });
  }

  async sendLoginOtpToSubscriber(dto: OtpDto): Promise<void> {
    const { otp, userId, userName, email } = dto;

    const otpPayload: OTPJobData = {
      userId,
      userName,
      email,
      otp,
    };

    await this.novuQueue.add(NOVU_QUEUE_JOBS.SEND_LOGIN_OTP, otpPayload);
  }

  async sendRegisterOtpToSubscriber(dto: OtpDto): Promise<void> {
    const { otp, userId, userName, email } = dto;

    const otpPayload: OTPJobData = {
      userId,
      userName,
      email,
      otp,
    };

    await this.novuQueue.add(NOVU_QUEUE_JOBS.SEND_REGISTER_OTP, otpPayload);
  }
}
