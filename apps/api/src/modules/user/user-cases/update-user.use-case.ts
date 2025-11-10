import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { IUserRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';

import {
  BadRequestException,
  ExceptionHandler,
} from '@app/core/exception';

import { UpdateUserDto, UserInfoDto } from '../dtos';

export class UpdateUserInfoCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly updateData: UpdateUserDto,
  ) {}
}

@CommandHandler(UpdateUserInfoCommand)
export class UpdateUserInfoCommandHandler
  implements ICommandHandler<UpdateUserInfoCommand, UserInfoDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserInfoCommand) {
    try {
      const user = await this.userRepository.findOne({ id: command.userId });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const updatedUser = await this.userRepository.update(
        command.userId,
        command.updateData,
      );

      return plainToInstance(UserInfoDto, updatedUser);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error updating user');
    }
  }
}
