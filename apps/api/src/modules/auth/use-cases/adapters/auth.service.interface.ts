import {
  LoginResponseDto,
  RegisterRequestDto,
  RequestLoginDto,
  RequestLoginResponseDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '../../dtos';

export interface IAuthService {
  requestOTP(input: RequestLoginDto): Promise<RequestLoginResponseDto>;

  verifyOTP(input: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto>;

  register(input: RegisterRequestDto): Promise<LoginResponseDto>;

  getUserTokenDevMode(email: string): Promise<LoginResponseDto>;
}
