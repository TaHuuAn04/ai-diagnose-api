import { SendSupportEscalationTicketInputDto } from '../../../escalation/dtos';
import { LoginOtpDto, RegisterOtpDto, ForgotPasswordOtpDto, NovuUserDto } from '../../dtos';

export interface ISendMailService {
  sendLoginOtp(input: LoginOtpDto): Promise<void>;

  sendRegisterOtp(input: RegisterOtpDto): Promise<void>;

  sendForgotPasswordOtp(input: ForgotPasswordOtpDto): Promise<void>;

  createNovuUser(input: NovuUserDto): Promise<void>;

  sendSupportEscalationTicket(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<void>;
}
