export interface IOtpService {
  saveLoginOtp(email: string, session: string, otp: string): Promise<boolean>;

  getLoginOtp(email: string, session: string): Promise<string | null>;

  deleteLoginOtp(email: string, session: string): Promise<boolean>;

  saveRegisterOtp(
    email: string,
    session: string,
    otp: string,
  ): Promise<boolean>;

  getRegisterOtp(email: string, session: string): Promise<string | null>;

  deleteRegisterOtp(email: string, session: string): Promise<boolean>;

  getLoginResendExpireTime(email: string): Promise<number | null>;

  getRegisterResendExpireTime(email: string): Promise<number | null>;
}
