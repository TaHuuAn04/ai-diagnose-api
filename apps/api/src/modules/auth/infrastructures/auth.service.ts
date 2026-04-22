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

import { OtpType } from '@app/core/domain/enums';
import {
  REGISTER_OTP_EXPIRE_TIME,
} from '@app/core/environments';
import {
  BadRequestException,
  ExceptionHandler,
} from '@app/core/exception';

import { IPatientService } from '../../patient/interfaces';
import {
  ForgotPasswordRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RequestLoginDto,
  RequestLoginResponseDto,
  ResetPasswordRequestDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '../dtos';
import { AuthPayload } from '../interfaces';
import { IAuthService, IUserService } from '../use-cases/adapters';
import { IOtpService } from '../use-cases/adapters/otp.service.interface';
import { hashPassword } from '../utils';

const apiNodeEnv = process.env.API_NODE_ENV;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @ InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    @Inject(INJECTION_TOKEN.OTP_SERVICE)
    private readonly otpService: IOtpService,

    @Inject(INJECTION_TOKEN.USER_SERVICE)
    private readonly userService: IUserService,

    @Inject(INJECTION_TOKEN.PATIENT_SERVICE)
    private readonly patientService: IPatientService,

    private readonly internalWorkerService: InternalWorkerService,
  ) {}
  async requestOTP(input: RequestLoginDto): Promise<RequestLoginResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ email: input.email });
      if (user?.isOnBoardingCompleted) {
        throw new BadRequestException('Email is already registered');
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
      if (apiNodeEnv === 'development' || apiNodeEnv === 'production') {
        const expiresInMinutes = REGISTER_OTP_EXPIRE_TIME / 60;
        
        const fallbackFirstName = input.email.split('@')[0];
        const firstName = input.firstName || fallbackFirstName;
        const lastName = input.lastName || 'User';

        await this.internalWorkerService.sendRegisterOtp(
          otp, 
          input.email,
          firstName,
          lastName,
          expiresInMinutes
        );
      }

      return plainToInstance(RequestLoginResponseDto, response);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error requesting OTP');
    }
  }
async forgotPassword(input: ForgotPasswordRequestDto): Promise<RequestLoginResponseDto> {
  try {
    const { email, resetUrl } = input;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { token } = await this.generateAndSaveForgotPasswordToken(email);

    const response: RequestLoginResponseDto = {
      sessionId: token,
      expireTime: REGISTER_OTP_EXPIRE_TIME,
      func: AuthFunc.FORGOT_PASSWORD,
    };

    if (apiNodeEnv === 'development' || apiNodeEnv === 'production') {
      const expiresInMinutes = REGISTER_OTP_EXPIRE_TIME / 60;

      const finalResetUrl = `${resetUrl}?token=${token}&email=${email}`;

      await this.internalWorkerService.sendForgotPasswordOtp(
        email,
        finalResetUrl,
        user.firstName || 'User',
        user.lastName || '',
        expiresInMinutes,
      );
    }

    return plainToInstance(RequestLoginResponseDto, response);
  } catch (error) {
    ExceptionHandler.handleErrorException(error, 'Error in forgot password');
  }
}

  @Transactional()
  async resetPassword(input: ResetPasswordRequestDto): Promise<boolean> {
    try {
      const { email, token, newPassword } = input;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const validToken = await this.otpService.getForgotPasswordOtp(
        email,
        token,
      );

      if (!validToken || validToken !== token) {
        throw new BadRequestException('Invalid or expired password reset link');
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.userRepository.update(user.id, { password: hashedPassword });

      await this.otpService.deleteForgotPasswordOtp(email, token);

      return true;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error resetting password');
    }
  }

  async verifyOTP(input: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({
        email: input.email,
      });

      if (!user) {
        if (input.type === OtpType.REGISTER) {
          await this.userService.createUser({ email: input.email });
        } else {
          throw new BadRequestException('User not found');
        }
      } 

      // validate OTP
      await this.validateRegisterOtp(input);


      // const payload: AuthPayload = {
      //   id: user.id,
      //   email: user.email,
      //   role: user.role,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   phoneCode: user.phoneCode ?? '',
      //   phoneNumber: user.phoneNumber ?? '',
      // };
      // const token = this.generateToken(payload);
      // return plainToInstance(LoginResponseDto, { accessToken: token });
      return plainToInstance(VerifyOtpResponseDto, { status: true });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error in verifying OTP');
    }
  }

  @Transactional()
  async register(input: RegisterRequestDto): Promise<LoginResponseDto> {
    try {
      const { email, password } = input;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!existingUser) {
        throw new BadRequestException('Account is registered illegally, please verify email with OTP first');
      }

      // hash password
      input.password = await hashPassword(password);

      // verify register OTP
      // await this.validateRegisterOtp({
      //   email,
      //   otp,
      //   sessionId,
      // });

      await this.userRepository.update(
        existingUser.id, {
          ...input,
          isOnBoardingCompleted: true,
        }
      );

      // fetch the updated user entity
      const savedUser = await this.userRepository.findOne({
        where: { id: existingUser.id },
      });

      if (!savedUser) {
        throw new BadRequestException('User not found after update');
      }

      // create novu user
      await this.internalWorkerService.createNovuUser({
        id: savedUser.id,
        email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      });
      
      // create patient profile for user
      await this.patientService.createPatient(savedUser.id);

      const payload: AuthPayload = {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        phoneCode: savedUser.phoneCode ?? '',
        phoneNumber: savedUser.phoneNumber ?? '',
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

  // private async validateLoginOtp(input: VerifyOtpRequestDto) {
  //   const validOtp = await this.otpService.getLoginOtp(
  //     input.email,
  //     input.sessionId,
  //   );

  //   if (!validOtp) {
  //     throw new BadRequestException('OTP is expired');
  //   }

  //   if (validOtp !== input.otp.toString()) {
  //     throw new BadRequestException('Wrong OTP');
  //   }

  //   await this.otpService.deleteLoginOtp(input.email, input.sessionId);

  //   return validOtp;
  // }

  private async validateRegisterOtp(input: VerifyOtpRequestDto) {
    const validOtp = await this.otpService.getRegisterOtp(
      input.email,
      input.sessionId,
    );

    if (!validOtp) {
      throw new BadRequestException('OTP is expired');
    }

    if (validOtp !== input.otp) {
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

  private async generateAndSaveForgotPasswordToken(
    email: string,
  ): Promise<{ token: string }> {
    const expireTime = await this.otpService.getForgotPasswordResendExpireTime(
      email,
    );

    if (expireTime) {
      throw new BadRequestException(
        `Waiting ${expireTime.toString()} seconds to send link again`,
      );
    }

    const token = uuidv4();

    await this.otpService.saveForgotPasswordOtp(email, token, token);
    return { token };
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
