import Redis from 'ioredis';

import { OTP_RESEND_TIME } from '@app/core/environments';
import { ExceptionHandler } from '@app/core/exception';

const apiNodeEnv = process.env.API_NODE_ENV;

export abstract class OtpServiceBase {
  constructor(protected readonly redis: Redis) {}

  protected async saveOtp(
    keyPrefix: string,
    email: string,
    session: string,
    otp: string,
    expireTime: number,
  ): Promise<boolean> {
    try {
      const key = `${keyPrefix}:${email}:${session}`;
      await this.redis.set(key, otp);
      await this.redis.expire(key, expireTime);
      if (apiNodeEnv === 'production' || apiNodeEnv === 'development') {
        await this.setResendExpireTime(keyPrefix, email);
      }
      return true;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error saving OTP');
    }
  }

  protected async getOtp(
    keyPrefix: string,
    email: string,
    session: string,
  ): Promise<string | null> {
    try {
      const key = `${keyPrefix}:${email}:${session}`;
      const otp = await this.redis.get(key);
      return otp;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting OTP');
    }
  }

  protected async deleteOtp(
    keyPrefix: string,
    email: string,
    session: string,
  ): Promise<boolean> {
    try {
      const key = `${keyPrefix}:${email}:${session}`;
      const deleteOtp = await this.redis.del(key);
      await this.deleteResendExpireTime(keyPrefix, email);
      return deleteOtp > 0;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error deleting OTP');
    }
  }

  protected async getResendExpireTime(keyPrefix: string, email: string) {
    try {
      const key = `${keyPrefix}:${email}:resendExpireTime`;
      const ttl = await this.redis.ttl(key);
      // Handle key not found gracefully
      if (ttl === -2) {
        return null; // Key doesn't exist
      } else if (ttl === -1) {
        return null; // Key exists but has no expiration
      }
      return ttl;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting resend expire time');
    }
  }

  private async setResendExpireTime(keyPrefix: string, email: string) {
    try {
      const key = `${keyPrefix}:${email}:resendExpireTime`;
      await this.redis.set(
        key,
        `Waiting ${OTP_RESEND_TIME.toString()} to send OTP again`,
      );
      await this.redis.expire(key, OTP_RESEND_TIME);
      return true;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error setting resend expire time');
    }
  }

  private deleteResendExpireTime(keyPrefix: string, email: string) {
    try {
      const key = `${keyPrefix}:${email}:resendExpireTime`;
      return this.redis.del(key);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error deleting resend expire time');
    }
  }
}
