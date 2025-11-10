import {
  LoginResponseDto,
  RegisterRequestDto,
  RequestLoginDto,
  RequestLoginResponseDto,
  VerifyOtpRequestDto,
} from '../../dtos';

export interface IAuthService {
  requestOTP(input: RequestLoginDto): Promise<RequestLoginResponseDto>;

  verifyLoginOTP(input: VerifyOtpRequestDto): Promise<LoginResponseDto>;

  register(input: RegisterRequestDto): Promise<LoginResponseDto>;

  getUserTokenDevMode(email: string): Promise<LoginResponseDto>;
}
