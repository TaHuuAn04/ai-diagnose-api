import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { IUserRepository } from 'apps/api/src/core/repository';
import { FindOneOptions } from 'typeorm';

import { ExceptionHandler } from '@app/core/exception';

import { UserEntity } from '../../../../../../libs/core/src/domain/entities';

export class FindUserCommand implements ICommand {
  constructor(public readonly query: FindOneOptions<UserEntity>) {}
}

@CommandHandler(FindUserCommand)
export class FindUserHandler
  implements ICommandHandler<FindUserCommand, UserEntity[]>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: FindUserCommand) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      const user = await this.userRepository.find(command.query.where as any);

      return user;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error finding user');
    }
  }
}
