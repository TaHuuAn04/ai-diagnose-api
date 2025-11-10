import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class SendSupportEscalationTicketBodyDto {
  conversationId: string;
  endUserName: string;
  endUserEmail: string;
  clientEmail: string;
  emailContent: string;
  clientUserId: string;
  clientName: string;
  chatbotName: string;
  conversationName: string;
  conversationDashboardUrl: string;
}

export class SendSupportEscalationTicketInputDto extends SendSupportEscalationTicketBodyDto {}

export class SendSupportEscalationTicketResponseDto {
  result: boolean;
}

export class PostSendSupportEscalationTicketDto extends HttpFetchDto {
  public static url = 'escalation/send-support-ticket';
  public method = HttpMethod.POST;
  public url = PostSendSupportEscalationTicketDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: SendSupportEscalationTicketResponseDto;

  constructor(public bodyDto: SendSupportEscalationTicketBodyDto) {
    super();
  }
}
