import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import {
  INJECTION_TOKEN,
  REPOSITORY_INJECTION_TOKEN,
} from 'apps/api/src/common/enums';
import { IUserRepository } from 'apps/api/src/core/repository';

import { BadRequestException, ExceptionHandler } from '@app/core/exception';

import { AuthPayload } from '../../auth/interfaces';

export class GetUserPayloadCommand implements ICommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(GetUserPayloadCommand)
export class GetUserPayloadHandler
  implements ICommandHandler<GetUserPayloadCommand, AuthPayload>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: GetUserPayloadCommand) {
    try {
      const user = await this.userRepository.findOne({
        email: command.email,
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const payload: AuthPayload = {
        id: user.id || '',
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneCode: user.phoneCode,
        phoneNumber: user.phoneNumber,
      };

      return payload;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error get user payload');
    }
  }
}
