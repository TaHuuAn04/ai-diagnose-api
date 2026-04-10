import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import {
  ChatbotModelResponseDto,
  GetListChatbotModelsRequestDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class GetListChatbotModelsQuery {
  constructor(public readonly query: GetListChatbotModelsRequestDto) {}
}

@QueryHandler(GetListChatbotModelsQuery)
export class GetListChatbotModelsQueryHandler
  implements
    IQueryHandler<
      GetListChatbotModelsQuery,
      PageDto<ChatbotModelResponseDto>
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    queryOption: GetListChatbotModelsQuery,
  ): Promise<PageDto<ChatbotModelResponseDto>> {
    const { query } = queryOption;
    return this.adminService.getListChatbotModels(query);
  }
}
