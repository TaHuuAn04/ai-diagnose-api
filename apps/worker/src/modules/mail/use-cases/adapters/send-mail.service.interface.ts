import { SendSupportEscalationTicketInputDto } from '../../../escalation/dtos';
import { LoginOtpDto, RegisterOtpDto } from '../../dtos';

export interface ISendMailService {
  sendLoginOtp(input: LoginOtpDto): Promise<void>;

  sendRegisterOtp(input: RegisterOtpDto): Promise<void>;

  sendSupportEscalationTicket(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<void>;
}
