import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { VerifyOtpRequestDto, VerifyOtpResponseDto } from '../dtos';

import { IAuthService } from './adapters';

export class VerifyOtpCommand {
  constructor(public readonly input: VerifyOtpRequestDto) {}
}

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpCommandHandler
  implements ICommandHandler<VerifyOtpCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async execute(command: VerifyOtpCommand): Promise<VerifyOtpResponseDto> {
    return await this.authService.verifyOTP(command.input);
  }
}
