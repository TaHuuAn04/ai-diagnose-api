import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';

import { Job } from 'bullmq';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { NovuService } from './novu.service';
import {
  JobData,
  NOVU_QUEUE_JOBS,
  NOVU_QUEUE_NAME,
  OTPJobData,
} from './queues';

@Processor(NOVU_QUEUE_NAME)
export class NovuProcessor extends WorkerHost {
  constructor(
    private readonly novuService: NovuService,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<JobData>): Promise<void> {
    try {
      switch (job.name) {
        case NOVU_QUEUE_JOBS.SEND_LOGIN_OTP:
          await this.sendLoginOtpMail(job as Job<OTPJobData>);
          break;
        case NOVU_QUEUE_JOBS.SEND_REGISTER_OTP:
          await this.sendRegisterOtpMail(job as Job<OTPJobData>);
          break;

        default:
          this.logger.warn(`Unknown job: ${job.name}`, {
            context: `${NovuProcessor.name}.${this.process.name}`,
          });
          break;
      }
    } catch (error) {
      this.handelError(error);
    }
  }

  async sendLoginOtpMail(job: Job<OTPJobData>): Promise<void> {
    const { email, userId, otp, userName } = job.data;
    try {
      await this.novuService.trigger(NOVU_QUEUE_JOBS.SEND_LOGIN_OTP, {
        to: {
          subscriberId: userId,
          email,
        },
        payload: {
          userName,
          otp,
        },
      });
    } catch (error) {
      this.handelError(error);
    }
  }

  async sendRegisterOtpMail(job: Job<OTPJobData>): Promise<void> {
    const { email, userId, otp, userName } = job.data;
    try {
      await this.novuService.trigger(NOVU_QUEUE_JOBS.SEND_REGISTER_OTP, {
        to: {
          subscriberId: userId,
          email,
        },
        payload: {
          userName,
          otp,
        },
      });

      // ! the function delete subscriber cannot be executed, have to set a waiting time
      // ! this is a temporary solution
      await new Promise((resolve) => setTimeout(resolve, 500));

      await this.novuService.subscribers.delete(userId);
    } catch (error) {
      this.handelError(error);
    }
  }

  private handelError(error: unknown) {
    if (error instanceof Error) {
      this.logger.error(`Can't send otp email.`, {
        context: `${NovuProcessor.name}.${this.process.name}`,
        error: error.message, // Use the error's message
      });
    } else {
      this.logger.error(`An unknown error occurred.`, {
        context: `${NovuProcessor.name}.${this.process.name}`,
        error,
      });
    }
  }
}
