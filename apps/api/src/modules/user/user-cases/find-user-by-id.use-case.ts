import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { IUserRepository } from 'apps/api/src/core/repository';

import { ExceptionHandler } from '@app/core/exception';

import { UserEntity } from '../../../../../../libs/core/src/domain/entities';

export class FindUserByIdCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(FindUserByIdCommand)
export class FindUserByIdHandler
  implements ICommandHandler<FindUserByIdCommand, UserEntity | null>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: FindUserByIdCommand) {
    try {
      const user = await this.userRepository.findOne({
        id: command.id,
      });

      return user;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error finding user by id');
    }
  }
}
