import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { ResetPasswordRequestDto } from '../dtos';

import { IAuthService } from './adapters';

export class ResetPasswordCommand {
  constructor(public readonly input: ResetPasswordRequestDto) {}
}

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<boolean> {
    return await this.authService.resetPassword(command.input);
  }
}
