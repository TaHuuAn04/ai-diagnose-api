import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { IUserRepository } from 'apps/api/src/core/repository';
import { Transactional } from 'typeorm-transactional';

import { UserEntity } from '@app/core/domain/entities';
import { ExceptionHandler } from '@app/core/exception';

import { CreateUserInputDto } from '../dtos';

export class CreateUserCommand implements ICommand {
  constructor(public readonly input: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserEntity>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Transactional()
  async execute(command: CreateUserCommand) {
    try {
      const createdUser = await this.userRepository.create({
        ...command.input,
      });

      return createdUser;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error excuting create user');
    }
  }

  private generateRandomPassword(length: number): string {
    const charSets = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Uppercase
      'abcdefghijklmnopqrstuvwxyz', // Lowercase
      '0123456789', // Numbers
    ];

    // Start password with one character from each character set
    const passwordChars = charSets.map(
      (set) => set[Math.floor(Math.random() * set.length)],
    );

    // Combine all character sets
    const allChars = charSets.join('');

    // Fill the remaining characters
    for (let i = passwordChars.length; i < length; i++) {
      passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle and return the password
    return passwordChars.sort(() => 0.5 - Math.random()).join('');
  }
}
