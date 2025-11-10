import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  LOGIN_OTP_EXPIRE_TIME,
  REGISTER_OTP_EXPIRE_TIME,
} from '@app/core/environments';

import { IOtpService } from '../use-cases/adapters/otp.service.interface';

import { OtpServiceBase } from './otp.abstract';

const REGISTER_OTP = 'register_otp';
const LOGIN_OTP = 'login_otp';

export class OtpService extends OtpServiceBase implements IOtpService {
  constructor(@InjectRedis() redis: Redis) {
    super(redis);
  }
  async getRegisterResendExpireTime(email: string): Promise<number | null> {
    return await this.getResendExpireTime(REGISTER_OTP, email);
  }
  async getLoginResendExpireTime(email: string): Promise<number | null> {
    return await this.getResendExpireTime(LOGIN_OTP, email);
  }

  async saveRegisterOtp(
    email: string,
    session: string,
    otp: string,
  ): Promise<boolean> {
    return this.saveOtp(
      REGISTER_OTP,
      email,
      session,
      otp,
      REGISTER_OTP_EXPIRE_TIME,
    );
  }

  async getRegisterOtp(email: string, session: string): Promise<string | null> {
    return this.getOtp(REGISTER_OTP, email, session);
  }

  async deleteRegisterOtp(email: string, session: string): Promise<boolean> {
    return this.deleteOtp(REGISTER_OTP, email, session);
  }

  async saveLoginOtp(
    email: string,
    session: string,
    otp: string,
  ): Promise<boolean> {
    return this.saveOtp(LOGIN_OTP, email, session, otp, LOGIN_OTP_EXPIRE_TIME);
  }

  async getLoginOtp(email: string, session: string): Promise<string | null> {
    return this.getOtp(LOGIN_OTP, email, session);
  }

  async deleteLoginOtp(email: string, session: string): Promise<boolean> {
    return this.deleteOtp(LOGIN_OTP, email, session);
  }
}
