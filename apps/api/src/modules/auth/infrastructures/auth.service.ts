import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthFunc, INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { User } from 'apps/api/src/infrastructure/database/typeorm-nest/entities';
import { InternalWorkerService } from 'apps/api/src/infrastructure/worker/internal-worker.service';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import {
  LOGIN_OTP_EXPIRE_TIME,
  REGISTER_OTP_EXPIRE_TIME,
} from '@app/core/environments';
import {
  BadRequestException,
  ExceptionHandler,
} from '@app/core/exception';

import {
  LoginResponseDto,
  RegisterRequestDto,
  RequestLoginDto,
  RequestLoginResponseDto,
  VerifyOtpRequestDto,
} from '../dtos';
import { AuthPayload } from '../interfaces';
import { IAuthService, IUserService } from '../use-cases/adapters';
import { IOtpService } from '../use-cases/adapters/otp.service.interface';

const apiNodeEnv = process.env.API_NODE_ENV;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    @Inject(INJECTION_TOKEN.OTP_SERVICE)
    private readonly otpService: IOtpService,

    @Inject(INJECTION_TOKEN.USER_SERVICE)
    private readonly userService: IUserService,

    private readonly internalWorkerService: InternalWorkerService,
  ) {}
  async requestOTP(input: RequestLoginDto): Promise<RequestLoginResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ email: input.email });
      if (user) {
        // generate and save login OTP
        const { otp, sessionId } = await this.generateAndSaveLoginOTP(
          user.email,
        );

        // send Login OTP use Novu via Worker
        if (apiNodeEnv === 'production') {
          await this.internalWorkerService.sendLoginOtp(otp, user);
        }

        const response: RequestLoginResponseDto = {
          sessionId,
          expireTime: LOGIN_OTP_EXPIRE_TIME,
          func: AuthFunc.LOGIN,
        };

        return plainToInstance(RequestLoginResponseDto, response);
      }

      // generate and save register OTP
      const { otp, sessionId } = await this.generateAndSaveRegisterOTP(
        input.email,
      );

      const response: RequestLoginResponseDto = {
        sessionId,
        expireTime: REGISTER_OTP_EXPIRE_TIME,
        func: AuthFunc.REGISTER,
      };

      // send Register OTP use Novu via Worker
      if (apiNodeEnv === 'production') {
        await this.internalWorkerService.sendRegisterOtp(otp, input.email);
      }

      return plainToInstance(RequestLoginResponseDto, response);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error requesting OTP');
    }
  }
  async verifyLoginOTP(input: VerifyOtpRequestDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({
        email: input.email,
      });

      if (!user) {
        throw new BadRequestException('Email is not registered or invalid');
      }

      // validate login OTP
      await this.validateLoginOtp(input);

      const payload: AuthPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneCode: user.phoneCode,
        phoneNumber: user.phoneNumber,
      };
      const token = this.generateToken(payload);
      return plainToInstance(LoginResponseDto, { accessToken: token });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error verifying login OTP');
    }
  }

  @Transactional()
  async register(input: RegisterRequestDto): Promise<LoginResponseDto> {
    try {
      const { email, otp, sessionId, firstName, lastName } = input;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      // verify register OTP
      await this.validateRegisterOtp({
        email,
        otp,
        sessionId,
      });

      const savedUser = await this.userService.createUser({ ...input });

      // create novu user
      await this.internalWorkerService.createNovuUser({
        id: savedUser.id,
        email,
        firstName,
        lastName,
      });

      const payload: AuthPayload = {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        phoneCode: savedUser.phoneCode,
        phoneNumber: savedUser.phoneNumber,
      };
      const token = this.generateToken(payload);
      return plainToInstance(LoginResponseDto, { accessToken: token });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error registering user');
    }
  }

  private generateOTP(length: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * digits.length)];
    }
    return OTP;
  }

  generateToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload);
  }

  private async validateLoginOtp(input: VerifyOtpRequestDto) {
    const validOtp = await this.otpService.getLoginOtp(
      input.email,
      input.sessionId,
    );

    if (!validOtp) {
      throw new BadRequestException('OTP is expired');
    }

    if (validOtp !== input.otp.toString()) {
      throw new BadRequestException('Wrong OTP');
    }

    await this.otpService.deleteLoginOtp(input.email, input.sessionId);

    return validOtp;
  }

  private async validateRegisterOtp(input: VerifyOtpRequestDto) {
    const validOtp = await this.otpService.getRegisterOtp(
      input.email,
      input.sessionId,
    );

    if (!validOtp) {
      throw new BadRequestException('OTP is expired');
    }

    if (validOtp !== input.otp.toString()) {
      throw new BadRequestException('Wrong OTP');
    }

    await this.otpService.deleteRegisterOtp(input.email, input.sessionId);

    return validOtp;
  }

  private async generateAndSaveLoginOTP(
    email: string,
  ): Promise<{ otp: string; sessionId: string }> {
    const expireTime = await this.otpService.getLoginResendExpireTime(email);

    if (expireTime) {
      throw new BadRequestException(
        `Waiting ${expireTime.toString()} to send OTP again`,
      );
    }

    const otp = apiNodeEnv === 'production' ? this.generateOTP(4) : '1111';
    const sessionId = uuidv4();

    await this.otpService.saveLoginOtp(email, sessionId, otp);
    return { otp, sessionId };
  }

  private async generateAndSaveRegisterOTP(
    email: string,
  ): Promise<{ otp: string; sessionId: string }> {
    const expireTime = await this.otpService.getRegisterResendExpireTime(email);

    if (expireTime) {
      throw new BadRequestException(
        `Waiting ${expireTime.toString()} seconds to send OTP again`,
      );
    }

    const otp = apiNodeEnv === 'production' ? this.generateOTP(4) : '1111';
    const sessionId = uuidv4();

    await this.otpService.saveRegisterOtp(email, sessionId, otp);
    return { otp, sessionId };
  }

  async getUserTokenDevMode(email: string): Promise<LoginResponseDto> {
    try {
      const payload: AuthPayload = await this.userService.getUserPayload(email);
      const token = this.generateToken(payload);
      return plainToInstance(LoginResponseDto, { accessToken: token });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error get token user');
    }
  }
}
