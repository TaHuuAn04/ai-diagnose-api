import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { ForgotPasswordRequestDto, RequestLoginResponseDto } from '../dtos';

import { IAuthService } from './adapters';

export class ForgotPasswordCommand {
  constructor(public readonly input: ForgotPasswordRequestDto) {}
}

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<RequestLoginResponseDto> {
    return await this.authService.forgotPassword(command.input);
  }
}
