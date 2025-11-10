import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { UserEntity } from '@app/core/domain/entities';
import { UserRole } from '@app/core/domain/enums';

export class CreateUserBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ValidateIf((dto: CreateUserBodyDto) => !!dto.phoneNumber)
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  @ApiProperty({ example: '+84' })
  phoneCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(9)
  @ApiProperty({ example: '123456789' })
  phoneNumber: string;
}

export class CreateUserInputDto extends CreateUserBodyDto {}

export class CreateUserResponseDto extends UserEntity {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: UserRole;

  @Expose()
  phoneCode: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  sessionId: string;
}
