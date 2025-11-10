import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { IUserRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';

import { BadRequestException, ExceptionHandler } from '@app/core/exception';

import { UserInfoDto } from '../dtos';

export class GetUserInfoCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(GetUserInfoCommand)
export class GetUserInfoCommandHandler
  implements ICommandHandler<GetUserInfoCommand, UserInfoDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: GetUserInfoCommand) {
    try {
      const user = await this.userRepository.findOne({
        id: command.id,
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return plainToInstance(UserInfoDto, user);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error registering user');
    }
  }
}
