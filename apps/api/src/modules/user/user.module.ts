import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateUserHandler } from './user-cases/create-user.use-case';
import { GetUserInfoCommandHandler } from './user-cases/get-user-info.use-case';
import { GetUserPayloadHandler } from './user-cases/get-user-payload.use-case';
import { UpdateUserInfoCommandHandler } from './user-cases/update-user.use-case';
import { UserController } from './user.controller';

const Handlers = [
  CreateUserHandler,
  GetUserPayloadHandler,
  GetUserInfoCommandHandler,
  UpdateUserInfoCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [...Handlers],
})
export class UserModule {}
