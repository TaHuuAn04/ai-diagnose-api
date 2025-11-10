import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { LoginResponseDto, VerifyOtpRequestDto } from '../dtos';

import { IAuthService } from './adapters';

export class VerifyLoginOtpCommand {
  constructor(public readonly input: VerifyOtpRequestDto) {}
}

@CommandHandler(VerifyLoginOtpCommand)
export class VerifyOtpCommandHandler
  implements ICommandHandler<VerifyLoginOtpCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async execute(command: VerifyLoginOtpCommand): Promise<LoginResponseDto> {
    return await this.authService.verifyLoginOTP(command.input);
  }
}
