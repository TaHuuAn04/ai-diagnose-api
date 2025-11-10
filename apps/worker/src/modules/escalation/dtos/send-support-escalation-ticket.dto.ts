import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendSupportEscalationTicketBodyDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  endUserName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  endUserEmail: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsString()
  @IsNotEmpty()
  emailContent: string;

  @IsUUID()
  @IsNotEmpty()
  clientUserId: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  chatbotName: string;

  @IsString()
  @IsNotEmpty()
  conversationName: string;

  @IsString()
  @IsNotEmpty()
  conversationDashboardUrl: string;
}

export class SendSupportEscalationTicketInputDto extends SendSupportEscalationTicketBodyDto {}

export class SendSupportEscalationTicketResponseDto {
  @Expose()
  result: boolean;
}
