import { Body, Controller, Get, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { CurrentUser } from '@app/core/decorators';
import { UserEntity } from '@app/core/domain/entities';

import { User } from '../../infrastructure/database/typeorm-nest/entities';

import {
  CreateUserBodyDto,
  CreateUserResponseDto,
  UpdateUserDto,
  UserInfoDto,
} from './dtos';
import { CreateUserCommand } from './user-cases';
import { GetUserInfoCommand } from './user-cases/get-user-info.use-case';
import { UpdateUserInfoCommand } from './user-cases/update-user.use-case';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createUser(
    @Body() dto: CreateUserBodyDto,
  ): Promise<CreateUserResponseDto> {
    const command = new CreateUserCommand(dto);
    const result = await this.commandBus.execute<CreateUserCommand, UserEntity>(
      command,
    );

    return plainToInstance(CreateUserResponseDto, result);
  }

  @ApiBearerAuth('access-token')
  @Get('info')
  async getUserInfo(@CurrentUser() user: User): Promise<UserInfoDto> {
    const command = new GetUserInfoCommand(user.id);
    return await this.commandBus.execute(command);
  }

  @ApiBearerAuth('access-token')
  @Put()
  async updateUserInfo(
    @CurrentUser() user: User,
    @Body() updateData: UpdateUserDto,
  ): Promise<UserInfoDto> {
    const command = new UpdateUserInfoCommand(user.id, updateData);
    return await this.commandBus.execute(command);
  }
}
