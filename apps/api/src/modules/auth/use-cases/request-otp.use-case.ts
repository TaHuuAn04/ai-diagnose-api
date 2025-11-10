import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { RequestLoginDto, RequestLoginResponseDto } from '../dtos';

import { IAuthService } from './adapters';

export class RequestOtpCommand {
  constructor(public readonly input: RequestLoginDto) {}
}

@CommandHandler(RequestOtpCommand)
export class RequestOtpCommandHandler
  implements ICommandHandler<RequestOtpCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async execute(command: RequestOtpCommand): Promise<RequestLoginResponseDto> {
    return await this.authService.requestOTP(command.input);
  }
}
