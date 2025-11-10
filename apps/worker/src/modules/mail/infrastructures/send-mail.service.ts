import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { AiInternalServerError, Exception } from '@app/core/exception';

import { SendSupportEscalationTicketInputDto } from '../../escalation/dtos';
import { TriggerNovuService } from '../../novu/novu-trigger.service';
import { NovuService } from '../../novu/novu.service';
import { LoginOtpDto, NovuUserDto, RegisterOtpDto } from '../dtos';
import { ISendMailService } from '../use-cases/adapters';

@Injectable()
export class SendMailService implements ISendMailService {
  constructor(
    private readonly novuService: NovuService,
    private readonly triggerNovuService: TriggerNovuService,
  ) {}
  async sendRegisterOtp(input: RegisterOtpDto): Promise<void> {
    try {
      const id = uuidv4();

      // create subscriber
      await this.novuService.subscribers.identify(id, {
        email: input.email,
      });

      // send OTP
      await this.novuService.sendRegisterOtpToSubscriber({
        otp: input.otp,
        userName: 'new user',
        email: input.email,
        userId: id,
      });
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';

      throw new AiInternalServerError(message);
    }
  }

  async sendLoginOtp(input: LoginOtpDto): Promise<void> {
    try {
      await this.novuService.sendLoginOtpToSubscriber({
        otp: input.otp,
        email: input.user.email,
        userName: input.user.firstName + ' ' + input.user.lastName,
        userId: input.user.id,
      });
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';

      throw new AiInternalServerError(message);
    }
  }

  async createNovuUser(input: NovuUserDto): Promise<void> {
    try {
      const { id, email, firstName, lastName } = input;
      await this.novuService.subscribers.identify(id, {
        email,
        firstName,
        lastName,
      });
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';

      throw new AiInternalServerError(message);
    }
  }

  async sendSupportEscalationTicket(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<void> {
    try {
      await this.triggerNovuService.sendSupportEscalationTicketToSubscriber(
        input,
      );
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';

      throw new AiInternalServerError(message);
    }
  }
}
