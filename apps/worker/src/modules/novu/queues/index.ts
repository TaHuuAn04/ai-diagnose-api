import { UserRole } from '@app/core/domain/enums';

export const NOVU_QUEUE_NAME = 'novu';

export const NOVU_QUEUE_JOBS = {
  IDENTIFY_NOVU: 'identify-novu',
  SEND_LOGIN_OTP: 'otp-login',
  SEND_REGISTER_OTP: 'register-otp',
  SEND_FORGOT_PASSWORD_OTP: 'password-reset',
  SEND_SUPPORT_ESCALATION_TICKET: 'support-escalation-ticket',
};

export type JobData = OTPJobData | AuthIdentifyData | ForgotPasswordJobData;

export interface AuthIdentifyData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface OTPJobData {
  userId: string;
  userName: string;
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  companyName: string;
  expiresInMinutes: number;
}

export interface ForgotPasswordJobData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  resetUrl: string;
  appName: string;
  expiresInMinutes: number;
}
