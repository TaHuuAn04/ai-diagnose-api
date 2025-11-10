import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@app/core/domain/entities';
import { ExceptionHandler } from '@app/core/exception';

import { CreateUserInputDto, CreateUserResponseDto } from '../../user/dtos';
import { CreateUserCommand } from '../../user/user-cases';
import { GetUserPayloadCommand } from '../../user/user-cases/get-user-payload.use-case';
import { AuthPayload } from '../interfaces';
import { IUserService } from '../use-cases/adapters';

export class UserService implements IUserService {
  // TODO: Check @Inject(CommandBus) below later
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  async createUser(input: CreateUserInputDto): Promise<CreateUserResponseDto> {
    const command = new CreateUserCommand(input);
    const result = await this.commandBus.execute<CreateUserCommand, UserEntity>(
      command,
    );
    return plainToInstance(CreateUserResponseDto, result);
  }

  async getUserPayload(email: string): Promise<AuthPayload> {
    try {
      const command = new GetUserPayloadCommand(email);
      return await this.commandBus.execute<GetUserPayloadCommand, AuthPayload>(
        command,
      );
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting user payload');
    }
  }
}
