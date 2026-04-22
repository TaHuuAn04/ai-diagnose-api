import {
  ForgotPasswordRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RequestLoginDto,
  RequestLoginResponseDto,
  ResetPasswordRequestDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '../../dtos';

export interface IAuthService {
  requestOTP(input: RequestLoginDto): Promise<RequestLoginResponseDto>;

  verifyOTP(input: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto>;

  register(input: RegisterRequestDto): Promise<LoginResponseDto>;

  forgotPassword(input: ForgotPasswordRequestDto): Promise<RequestLoginResponseDto>;

  resetPassword(input: ResetPasswordRequestDto): Promise<boolean>;

  getUserTokenDevMode(email: string): Promise<LoginResponseDto>;
}
