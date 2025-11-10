import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { INJECTION_TOKEN } from '@api/enums';
import { Repository } from 'typeorm';

import { BadRequestException, ExceptionHandler } from '@app/core/exception';

import { User } from '../../../infrastructure/database/typeorm-nest/entities';
import { LoginBodyDto } from '../dtos/login.dto';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import { comparePassword } from '../utils';

@Injectable()
export class TempAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private generateToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload);
  }

  async login(dto: LoginBodyDto): Promise<string> {
    try {
      const { email, password } = dto;
      const userInfo = await this.userRepository.findOne({ where: { email } });

      if (!userInfo) {
        throw new BadRequestException('Invalid credentials');
      }

      if (!(await comparePassword(password, userInfo.password))) {
        throw new BadRequestException('Invalid Password');
      }


      const payload: AuthPayload = {
        id: userInfo.id,
        email: userInfo.email,
        role: userInfo.role,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneCode: userInfo.phoneCode,
        phoneNumber: userInfo.phoneNumber,
      };
      const token = this.generateToken(payload);
      return token;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error login user');
    }
  }
}
