import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { LoginResponseDto, RegisterRequestDto } from '../dtos';

import { IAuthService } from './adapters';

export class RegisterCommand {
  constructor(public readonly input: RegisterRequestDto) {}
}

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async execute(command: RegisterCommand): Promise<LoginResponseDto> {
    return await this.authService.register(command.input);
  }
}
